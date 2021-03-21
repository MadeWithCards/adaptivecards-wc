import Vue from 'vue'
import App from './App.vue'
import { defineCustomElements } from '@madewithcards/adaptivecards-wc/dist/loader';
defineCustomElements(window); 
Vue.config.productionTip = false

// Tell Vue to ignore all components defined in the test-components
// package. The regex assumes all components names are prefixed
// 'test'
Vue.config.ignoredElements = [/adaptive-\w*/];

new Vue({
  render: h => h(App),
}).$mount('#app')
