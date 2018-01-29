(function() {

  'use strict';

  class PerfTester extends HTMLElement {

    static get observedAttributes() {
      return ['runs', 'base', 'strategy', 'chart', 'chartmin', 'chartmax'];
    }

    static get template() {
      return `
        <style>
          :host {
            display: block;
            font-family: sans-serif;
            overflow: hidden;
          }

          iframe {
            position: absolute;
            border: 0;
            width: 100vw;
            height: 100vh;
            top: 50vh;
            left: 50vw;
          }

          o, n {
            display: inline-block;
            margin: 2px;
            text-align: right;
            font-family: monospace;
          }

          o {
            color: rgba(255, 0, 0, 0.5);
          }

          n {
            display: inline-block;
            color: green;
            font-weight: bold;
          }

          .card {
            padding: 16px;
            box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                        0 3px 14px 2px rgba(0, 0, 0, 0.12),
                        0 5px 5px -3px rgba(0, 0, 0, 0.4);
            margin: 16px;
            overflow: hidden;
            background-color: #fff;
          }

          .baseline {
            background: beige;
          }

          #chartmin,
          #chartmax {
            width: 40px;
          }
        </style>
        <label><input type="checkbox" id="showCharts">Show histograms</label>
        <span id="chartOpts">
          <input type="number" placeholder="min" id="chartmin"> ~
          <input type="number" placeholder="max" id="chartmax">
        </span>
        <div id="log"></div>
      `;
    }

    constructor() {
      super();
      this.strategy = this._strategies.minimum;
      this.runs = 25;
      this.base = '';
      this._baselineTest = 0;
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.constructor.template;
        this.$ = {};
        if (!this.chartmin) {
          this.chartmin = 0;
        }
        if (!this.chartmax) {
          this.chartmax = 300;
        }
        this.chart = false;
        this.$.log = this.shadowRoot.querySelector('#log');
        window.addEventListener('message', (e) => this._scoreMessage(e));
        this.shadowRoot.querySelector('#showCharts').addEventListener('change', (e) => {
          this.chart = e.target.checked;
        });
        this.shadowRoot.querySelector('#chartmin').addEventListener('input', (e) => {
          this._rangeSet = true;
          this.chartmin = e.target.valueAsNumber;
        });
        this.shadowRoot.querySelector('#chartmax').addEventListener('input', (e) => {
          this._rangeSet = true;
          this.chartmax = e.target.valueAsNumber;
        });
        this.$.log.addEventListener('click', (e) => {
          let t = e.target;
          while (!t.classList || !t.classList.contains('card')) {
            t = t.parentNode;
          }
          let i = Array.from(this.$.log.querySelectorAll('.card')).indexOf(t);
          this._baselineTest = i >= 0 ? i : 0;
          this._report();
        });
      }
    }

    attributeChangedCallback(name, old, value) {
      if (old !== value) {
        switch(name) {
          case 'runs':
            this.runs = value;
            break;
          case 'base':
            this.base = value;
            break;
          case 'strategy':
            this.strategy = this._strategies[value] || this.strategy;
            break;
          case 'chart':
            this.chart = value != null;
            break;
          case 'chartmin':
            this.chartmin = value;
            break;
          case 'chartmax':
            this.chartmax = value;
            break;
        }
      }
    }

    get tests() {
      return this._tests;
    }

    set tests(value) {
      this._tests = value;
      this._go();
    }

    set chart(value) {
      this._chart = value;
      this.shadowRoot.querySelector('#showCharts').checked = value;
      this.shadowRoot.querySelector('#chartOpts').hidden = !value;
      if (value && !this._chartLoaded) {
        this._chartLoaded = true;
        let script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
          window.google.charts.load("current", {packages:["corechart"]});
          window.google.charts.setOnLoadCallback(() => {
            this._shouldDrawChart = this._chart;
            this._drawCharts();
          });
        }
        script.onerror = function(e) { console.error(`couldn't load chart lib: ${e}`); };
        document.head.appendChild(script);
      } else {
        this._shouldDrawChart = value;
      }
      if (this.tests) {
        this._report();
      }
    }

    get chart() {
      return this._chart;
    }

    set chartmin(value) {
      this._chartmin = value;
      this.shadowRoot.querySelector('#chartmin').value = value;
      this._drawCharts();
    }

    get chartmin() { return this._chartmin }

    set chartmax(value) {
      this._chartmax = value;
      this.shadowRoot.querySelector('#chartmax').value = value;
      this._drawCharts();
    }

    get chartmax() { return this._chartmax }

    _shuffle(tests) {
      let shuffled = [];
      let ordered = tests.slice(0);
      let _count = ordered.length;
      for (let i=0, j; i<_count; i++) {
        j = Math.floor(Math.random()*_count);
        // TODO(sjmiles): this is an easy but poorly randomized distribution
        for (; !ordered[j]; j = (j + 1) % _count);
        shuffled.push(j);
        ordered[j] = null;
      }
      return shuffled;
    }

    _go() {
      this._count = 0;
      this._total = [];
      this._times = [];
      this._infos = [];
      for (let i=0; i<this.tests.length; i++) {
        this._total[i] = 0;
        this._times[i] = [];
      }
      this._startRun();
    }

    _startRun() {
      this._shuffled = this._shuffle(this.tests);
      this._index = -1;
      //console.group('run', this._count);
      this._nextTest();
    }

    _nextTest() {
      // last test in this run?
      if (++this._index === this.tests.length) {
        //console.groupEnd();
        // report results
        ++this._count;
        this._report();
        // more runs?
        if (this._count < this.runs) {
          this._startRun();
        } else {
          // all done!
          this.dispatchEvent(new CustomEvent('done'));
          this._frame.style.display = 'none';
        }
        return;
      }
      // test order is randomized
      this._test = this._shuffled[this._index];
      if (this._frame) {
        this.shadowRoot.removeChild(this._frame);
      }
      this._frame = document.createElement('iframe');
      this.shadowRoot.appendChild(this._frame);
      this._frame.src = this.base + this.tests[this._test];
      // it's possible for a test to end before the load event fires,
      // so assume the frame loads immediately and start waiting
      // for a result.
      this._load();
    }

    _load() {
      // frame is loaded, measure the time, then proceed
      this._measure((info) => {
        this._record(info);
        this._nextTest();
      });
    }

    _measure(next) {
      this.afterScore = next;
    }

    _scoreMessage(e) {
      if (this.afterScore) {
        let info = e.data;
        if (typeof info !== 'object') {
          info = {time: info};
        }
        info.time = parseInt(info.time);
        this.afterScore(info);
      }
    }

    _record(info) {
      if (!this._infos[this._test]) {
        this._infos[this._test] = info;
      }
      this._times[this._test].push(info.time);
      this._total[this._test] += info.time;
    }

    _report() {
      let data = [];
      let baseline;
      for (let i=0; i<this.tests.length; i++) {
        let url = this.tests[i],
            times = this._times[i],
            testInfo = this._infos[i];
        data.push({url, times, testInfo});
        if (i == this._baselineTest) {
          baseline = this._calcScores(times);
        }
      }
      let min = 0, max = 0;
      let info = `<br>Runs: ${this._count}/${this.runs}<br><br>`;
      for (let i=0; i<data.length; i++) {
        let {url, times, testInfo} = data[i];
        let timeInfo = this._calcScores(times, baseline);
        let timeReport = '';
        let stats = null;
        for (let kind in timeInfo) {
          let stratInfo = timeInfo[kind];
          if (!stats) {
            stats = stratInfo.stats;
          }
          timeReport += `${kind}: ${(stratInfo.time).toFixed(1)}ms (${stratInfo.compare}x) ${stratInfo.extra ? `[${stratInfo.extra}]` : ''} `;
        }
        //timeReport += `[σ ${stats.deviation.toFixed(2)}]`;
        let title = (testInfo && testInfo.info && testInfo.info.name) || url;
        info += `<div class="card ${i == this._baselineTest ? 'baseline' : ''}">
          <b>${timeReport}</b>
          &nbsp;&nbsp;<a href="${this.base}${url}" target="_blank">${title}</a>
          <br>
          <span style="font-size: 8px; white-space: nowrap">`;
        //
        for (let j=0, v; (v=times[j]); j++) {
          max = Math.max(v, max);
          let o = stats.outlier(v);
          info += (o ? '<o>' : '<n>') + v.toFixed(0) + (o ? '</o>' : '</n>') + '|';
        }
        info += `</span><div class="chart" id="chart${i}"></div></div>`;
      }
      //
      this.$.log.innerHTML = info;
      if (!this._rangeSet) {
        this.chartmin = min;
        this.chartmax = max;
      }
      this._drawCharts();
    }

    _drawCharts() {
      if (this._shouldDrawChart) {
        for (let i=0; i<this.tests.length; i++) {
          let data = [[this.tests[i]]].concat(this._times[i].map(function(t) { return [t] }));
          let table = window.google.visualization.arrayToDataTable(data);
          let options = {
            fontSize: 6,
            width: 400,
            chartArea: { width: 400, left: 0 },
            height: 75,
            bar: { gap: 0 },
            lastBucketPercentile: 5,
            legend: { position: 'none' },
            vAxis: { textPosition: 'none' },
            hAxis: { slantedText: false, viewWindow: {min: this._chartmin, max: this._chartmax} },
            histogram: {
              hideBucketItems: true,
              bucketSize: 2,
              maxNumBuckets: 200,
              minValue: this._chartmin,
              maxValue: this._chartmax
            }
          };
          let chart = new window.google.visualization.Histogram(this.shadowRoot.querySelector('#chart' + i));
          chart.draw(table, options);
        }
      }
    }

    _calcScores(times, baseline) {
      let info = {};
      times = times.slice();
      for (let kind in this._strategies) {
        let stats = this._stats(times, kind);
        let time = this._strategies[kind].score(times, stats, this);
        let extra = this._strategies[kind].extra(times, stats);
        let compare = baseline ?
          ((time / baseline[kind].time)).toFixed(2) : 1;
        info[kind] = {time: time, compare: compare, stats: stats, extra: extra};
      }
      return info;
    }

    _stats(a, kind) {
      let r = {mean: 0, letiance: 0, deviation: 0}, t = a.length;
      r.outlier = this._strategies[kind].outlier;
      const s = a.reduce((ac, v) => ac + v);
      const m = r.mean = s / t;
      const l = r.letiance = a.reduce((ac, v) => ac + Math.pow(v - m, 2));
      const o = r.deviation = Math.sqrt(s / t);
      let cs=0, ct=0;
      for (let i=0; i < t; i++) {
        let v = a[i];
        if (Math.abs(v - m) < 3 * o) {
          ct++;
          cs += v;
        }
      }
      r.centralMean = ct > 0 ? cs / ct : r.mean;
      // 95%
      const p = 1.960;
      r.ci = p * o / Math.sqrt(t);
      return r;
    }

  }

  //
  // selectable statical strategies
  //
  PerfTester.prototype._strategies = {
    // This strategy selects the minimum timing for score.
    min: {
      score: function(times, stats) {
        let min = Number.MAX_VALUE;
        for (let j=0, v; (v=times[j]); j++) {
          min = Math.min(v, min);
        }
        stats.score = min;
        return min;
      },
      // called in stats context
      outlier: function(value) {
        return value > this.score;
      },
      extra: function() {}
    },

    med: {
      score: function(times, stats) {
        times.sort((a,b) => a - b);
        let middle = Math.floor(times.length / 2);
        stats.score = times[middle];
        return stats.score;
      },
      outlier: function(value) {
        return value != this.score;
      },
      extra: function(times, stats) {
        return `σ ${stats.deviation.toFixed(2)}`;
      }
    },

    mean: {
      score: function(times, stats) {
        stats.score = stats.centralMean;
        return stats.score;
      },
      outlier: function(value) {
        return value
        //return value != this.score;
      },
      extra: function(times, stats) {
        return `± ${stats.ci.toFixed(2)}`;
      }
    },

    // This strategy selects the mean of all _times not more than one stddev
    // away from the _total sampling mean.
    /*
    onedev: {
      score: function(_times, stats, context) {
        let cleaned = [];
        for (let j=0, v; v=_times[j]; j++) {
          if (!stats.outlier(v)) {
            cleaned.push(v);
          }
        }
        return context._stats(cleaned).mean;
      },
      // called in stats context
      outlier: function(value) {
        return Math.abs(value - this.mean) > (1 * this.deviation);
      }
    }
    */
  }

  customElements.define('perf-tester', PerfTester);

})();
