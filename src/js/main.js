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
    sortedBy: null,  // 0, 1, or 2
    sortOrder: null, // -1 for descending, 1 for ascending
    bikeCounts: window.bikeCounts,
    drilldown: null,
    sortHeaders: ['May 2016 - Apr. 2017', 'May 2017 - Apr. 2018', 'Change'],
  },
  methods: {
    toggleDrilldown(counter) {
      if (this.drilldown === counter) this.drilldown = null;
      else this.drilldown = counter;
    },
    sortRows(index) {
      // Case: reverse sort order
      if (index === this.sortedBy) {
        this.counterNames.reverse();
        this.sortOrder *= -1;
        return;
      }

      // Case: sort by new column
      this.counterNames.sort((a, b) => {
        if (index === 2) {
          var changeB = (this.bikeCounts[b].totals[1] - this.bikeCounts[b].totals[0]) / this.bikeCounts[b].totals[0];
          var changeA = (this.bikeCounts[a].totals[1] - this.bikeCounts[a].totals[0]) / this.bikeCounts[a].totals[0];
          return changeB - changeA;
        }
        return this.bikeCounts[b].totals[index] - this.bikeCounts[a].totals[index];
      });
      this.sortedBy = index;
      this.sortOrder = -1;
    }
  },
  created() {
    this.sortRows(1);
  }
});
