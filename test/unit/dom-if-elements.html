<!--
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
-->
<dom-module id="x-foo">
  <template>
    <x-bar id="bar"
           prop="{{prop}}"
           item-prop="{{item.prop}}">
    </x-bar>
  </template>
</dom-module>
<script>
  Polymer({
    is: 'x-foo',
    properties: {
      prop: {
        notify: true
      },
      itemProp: {
        notify: true
      }
    }
  });
  Polymer({
    is: 'x-bar',
    properties: {
      prop: {
        notify: true
      },
      itemProp: {
        notify: true
      }
    }
  });
</script>

<dom-module id="x-nested-if">
  <template>
    <template is="dom-if" id="if-1" if="{{shouldStamp}}" on-dom-change="domUpdateHandler">
      <!-- Comments should be good -->
      <x-foo on-test1="testHandler1"
             prop="{{prop}}"
             item-prop="{{item.prop}}">
      </x-foo>
      <template is="dom-if" id="if-2" if="{{shouldStamp}}">
        <!-- Comments should be good -->
        <x-foo on-test2="testHandler2"
               prop="{{prop}}"
               item-prop="{{item.prop}}">
        </x-foo>
        <template is="dom-if" id="if-3" if="{{shouldStamp}}">
        <!-- Comments should be good -->
          <x-foo on-test3="testHandler3"
                 prop="{{prop}}"
                 item-prop="{{item.prop}}">
          </x-foo>
        </template>
      </template>
    </template>
  </template>
</dom-module>
<script>
  Polymer({
    is: 'x-nested-if',
    testHandler1Count: 0,
    testHandler2Count: 0,
    testHandler3Count: 0,
    domUpdateHandlerCount: 0,
    testHandler1: function() {
      this.testHandler1Count++;
    },
    testHandler2: function() {
      this.testHandler2Count++;
    },
    testHandler3: function() {
      this.testHandler3Count++;
    },
    render: function() {
      this.$['if-1'].render();
    },
    domUpdateHandler: function() {
      this.domUpdateHandlerCount++;
    }
  });
</script>

<dom-module id="x-nested-if-configured">
  <template>
    <template is="dom-if" id="if-1" if="{{shouldStamp}}">
      <!-- Comments should be good -->
      <x-foo prop="{{prop}}"
             item-prop="{{item.prop}}">
      </x-foo>
      <template is="dom-if" id="if-2" if="{{shouldStamp}}">
        <!-- Comments should be good -->
        <x-foo prop="{{prop}}"
               item-prop="{{item.prop}}">
        </x-foo>
        <template is="dom-if" id="if-3" if="{{shouldStamp}}">
          <!-- Comments should be good -->
          <x-foo prop="{{prop}}"
                 item-prop="{{item.prop}}">
          </x-foo>
        </template>
      </template>
    </template>
  </template>
</dom-module>
<script>
  Polymer({
    is: 'x-nested-if-configured',
    properties: {
      shouldStamp: {
        value: true
      },
      prop: {
        value: 'outer'
      },
      item: {
        value: function() { return {prop: 'outerItem'}; }
      }
    },
    render: function() {
      this.$['if-1'].render();
    }
  });
</script>

<dom-module id="x-nested-if-individual">
  <template>
    <template is="dom-if" id="if-1" if="{{shouldStamp1}}">
      <x-foo prop="{{prop1}}"></x-foo>
      <template is="dom-if" id="if-2" if="{{shouldStamp2}}">
        <x-foo prop="{{prop2}}"></x-foo>
        <template is="dom-if" id="if-3" if="{{shouldStamp3}}">
          <x-foo prop="{{prop3}}"></x-foo>
        </template>
      </template>
    </template>
  </template>
</dom-module>
<script>
  Polymer({
    is: 'x-nested-if-individual',
    properties: {
      prop1: {
        value: 'prop1'
      },
      prop2: {
        value: 'prop2'
      },
      prop3: {
        value: 'prop3'
      },
      item: {
        value: function() { return {prop: 'outerItem'}; }
      }
    },
    render: function() {
      this.$['if-1'].render();
    }
  });
</script>

<dom-module id="x-textcontent">
  <template>
    <template id="domIf" is="dom-if" if>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      {{text}}
      <div>4</div>
    </template>
  </template>
  <script>
  Polymer({
    is: 'x-textcontent',
    properties: {
      text: {
        value: 'Stuff'
      }
    }
  });
  </script>
</dom-module>

<dom-module id="x-slot">
    <template>
      <template id="domIf" is="dom-if" if>
        <div class="stuff">stuff</div>
        <slot id="one" name="one"></slot><template id="innerIf" is="dom-if" if restamp>hi</template>
        <slot id="two" name="two"></slot>
        {{text}}
        <slot id="three" name="three"></slot>
      </template>
    </template>
    <script>
    Polymer({
      is: 'x-slot',
      properties: {
        text: {
          value: 'Stuff'
        }
      }
    });
    </script>
  </dom-module>

<dom-module id="x-host">
  <template>
    <template id="domif" is="dom-if" if>
      <x-client></x-client>
      <x-client></x-client>
      <x-client></x-client>
    </template>
  </template>
  <script>
  Polymer({
    is: 'x-host'
  });
  Polymer({
    is: 'x-client',
    statics: {
      uid: 0
    },
    ready: function() {
      this.uid = this.statics.uid++;
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-prop">
  <template>
    <template is="dom-if" if="{{bool}}" restamp="{{restamp}}">{{guarded(bool)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-prop',
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-inline">
  <template>
    <template is="dom-if" if="{{isTrue(bool)}}" restamp="{{restamp}}">{{guarded(bool)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-inline',
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    },
    isTrue: function(val) {
      return val;
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-computed">
  <template>
    <template is="dom-if" if="{{switch}}" restamp="{{restamp}}">{{guarded(bool)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-computed',
    properties: {
      switch: {
        computed: 'computeSwitch(bool)'
      }
    },
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    },
    computeSwitch: function(val) {
      return val;
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-object">
  <template>
    <template is="dom-if" if="{{obj.bool}}" restamp="{{restamp}}">{{guarded(obj.bool)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-object',
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-object-computed">
  <template>
    <template is="dom-if" if="{{switch}}" restamp="{{restamp}}">{{guarded(obj.bool)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-object-computed',
    properties: {
      switch: {
        computed: 'computeSwitch(obj.bool)'
      }
    },
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    },
    computeSwitch: function(val) {
      return val;
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-separate-props">
  <template>
    <template is="dom-if" if="{{b}}" restamp="{{restamp}}">{{guarded(a)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-separate-props',
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    }
  });
  </script>
</dom-module>

<dom-module id="x-guard-separate-paths">
  <template>
    <template is="dom-if" if="{{obj.b}}" restamp="{{restamp}}">{{guarded(obj.a)}}</template>
  </template>
  <script>
  Polymer({
    is: 'x-guard-separate-paths',
    created: function() {
      this.guarded = sinon.spy(function(val) {
        return val;
      });
    }
  });
  </script>
</dom-module>