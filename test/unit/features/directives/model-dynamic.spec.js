import Vue from 'vue'

describe('Directive v-model dynamic input type', () => {
  it('should work', done => {
    const vm = new Vue({
      data: {
        type: null,
        test: 'b'
      },
      template: `<input :type="type" v-model="test">`
    }).$mount()
    document.body.appendChild(vm.$el)

    // test text
    assertInputWorks(vm).then(done)
  })

  it('with v-if', done => {
    const vm = new Vue({
      data: {
        ok: true,
        type: null,
        test: 'b'
      },
      template: `<input v-if="ok" :type="type" v-model="test"><div v-else>haha</div>`
    }).$mount()
    document.body.appendChild(vm.$el)

    const chain = assertInputWorks(vm).then(() => {
      vm.ok = false
    }).then(() => {
      expect(vm.$el.textContent).toBe('haha')
    }).then(() => {
      // reset
      vm.ok = true
      vm.type = null
      vm.test = 'b'
    })

    assertInputWorks(vm, chain).then(done)
  })

  it('with v-for', done => {
    const vm = new Vue({
      data: {
        data: {
          text: 'foo',
          checkbox: true
        },
        types: ['text', 'checkbox']
      },
      template: `<div>
        <input v-for="type in types" :type="type" v-model="data[type]">
      </div>`
    }).$mount()
    document.body.appendChild(vm.$el)

    let el1 = vm.$el.children[0]
    expect(el1.type).toBe('text')
    expect(el1.value).toBe('foo')
    el1.value = 'bar'
    triggerEvent(el1, 'input')
    expect(vm.data.text).toBe('bar')

    let el2 = vm.$el.children[1]
    expect(el2.type).toBe('checkbox')
    expect(el2.checked).toBe(true)
    el2.click()
    expect(vm.data.checkbox).toBe(false)

    // now in reverse!
    vm.types.reverse()
    waitForUpdate(() => {
      el1 = vm.$el.children[0]
      expect(el1.type).toBe('checkbox')
      expect(el1.checked).toBe(false)
      el1.click()
      expect(vm.data.checkbox).toBe(true)

      el2 = vm.$el.children[1]
      expect(el2.type).toBe('text')
      expect(el2.value).toBe('bar')
      el2.value = 'foo'
      triggerEvent(el2, 'input')
      expect(vm.data.text).toBe('foo')
    }).then(done)
  })
})

function assertInputWorks (vm, chain) {
  if (!chain) chain = waitForUpdate()
  chain.then(() => {
    expect(vm.$el.value).toBe('b')
    vm.test = 'a'
  }).then(() => {
    expect(vm.$el.value).toBe('a')
    vm.$el.value = 'c'
    triggerEvent(vm.$el, 'input')
    expect(vm.test).toBe('c')
  }).then(() => {
    // change it to password
    vm.type = 'password'
    vm.test = 'b'
  }).then(() => {
    expect(vm.$el.type).toBe('password')
    expect(vm.$el.value).toBe('b')
    vm.$el.value = 'c'
    triggerEvent(vm.$el, 'input')
    expect(vm.test).toBe('c')
  }).then(() => {
    // change it to checkbox...
    vm.type = 'checkbox'
  }).then(() => {
    expect(vm.$el.type).toBe('checkbox')
    expect(vm.$el.checked).toBe(true)
  }).then(() => {
    vm.$el.click()
    expect(vm.$el.checked).toBe(false)
    expect(vm.test).toBe(false)
  })
  return chain
}
