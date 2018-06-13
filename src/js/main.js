var Vue = require("vue/dist/vue.min");
require("component-responsive-frame/child");

// TODO: double check these meanings with the city
var decipher = {
  nb: 'northbound',
  sb: 'southbound',
  north: 'northbound',
  south: 'southbound',
  east: 'eastbound',
  west: 'westbound',
  bike_north: 'northbound',
  bike_south: 'southbound',
  fremont_bridge_nb: 'northbound',
  fremont_bridge_sb: 'southbound',
};

var commafy = function commafy(num) {
  return num.toLocaleString('en-US');
};

// TODO: Calculate this number in preprocess OR scale by counter, not across counters
var allTotals =[];
Object.values(window.bikeCounts).forEach((bc) => {
  bc.totals.forEach((row) => {
    allTotals.push(... row.values);
  });
});
var maxVal = Math.max(...allTotals);

Vue.component('count-grid', {
  data() {
    return {
      decipher,
      maxVal,
   };
  },
  props: ['totals'],
  methods: {
    commafy,
  },
  template: require('./_count-grid.html'),
});

Vue.component('spark-line', {
  props: ['weekly'],
  template: '<div>TK</div>'
})

var app = new Vue({
  el: 'main',
  data: {
    counterNames: [ '2nd-ave', '26th-ave', '39th-ave', '58th-st', 'broadway',
      'burke-gilman', 'elliott-bay', 'fremont-bridge', 'mts', 'spokane-st'],
    bikeCounts: window.bikeCounts,
    drilldown: null,
    decipher,
  },
  methods: {
    toggleDrilldown(counter) {
      if (this.drilldown === counter) this.drilldown = null;
      else this.drilldown = counter;
    }
  },
});
