var Vue = require("vue/dist/vue.min");
require("component-responsive-frame/child");

var locator = require("./locator");
var countGrid = require("./count-grid");
var sparkLine = require("./spark-line");
var monthGraph = require("./month-graph");
var dayGraphs = require("./day-graphs");

Vue.component('locator', locator());
Vue.component('count-grid',countGrid());
Vue.component('spark-line', sparkLine());
Vue.component('month-graph', monthGraph());
Vue.component('day-graphs', dayGraphs());

var app = new Vue({
  el: 'main',
  data: {
    counterNames: [ '2nd-ave', '26th-ave', '39th-ave', '58th-st', 'broadway',
      'burke-gilman', 'elliott-bay', 'fremont-bridge', 'mts', 'spokane-st'],
    bikeCounts: window.bikeCounts,
    drilldown: null,
  },
  methods: {
    toggleDrilldown(counter) {
      if (this.drilldown === counter) this.drilldown = null;
      else this.drilldown = counter;
    }
  },
});
