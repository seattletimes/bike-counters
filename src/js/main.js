var Vue = require("vue/dist/vue.min");
require("component-responsive-frame/child");
var locator = require("./locator");
var countGrid = require("./count-grid");
var sparkLine = require("./spark-line");

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
  '2nd-ave': '2nd Ave between Madison and Marion',
  '26th-ave': '26th Ave SW Greenway at SW Oregon St',
  '39th-ave': '39th Ave NE Greenway at NE 62nd St',
  '58th-st': 'W 58th St Greenway at 22nd Ave NW',
  broadway: 'Broadway between Pike and Union',
  'burke-gilman': 'Burke Gilman Trail north of NE 70th St',
  'elliott-bay': 'Elliott Bay Trail (Myrtle Edwards Park)',
  'fremont-bridge': 'Fremont Bridge',
  mts: 'Mountain to Sound Trail at Lakeside Ave S',
  'spokane-st': 'S Spokane St Bridge',
};

var commafy = function commafy(num) {
  return num.toLocaleString('en-US');
};

var percentify = function percentify(num) {
  return `${num > 0 ? '+' : ''}${Math.round(100 * num)}%`;
};

// TODO: Calculate this number in preprocess OR scale by counter, not across counters
var allTotals =[];
Object.values(window.bikeCounts).forEach((bc) => {
  bc.totals.forEach((row) => {
    allTotals.push(... row.values);
  });
});
var maxVal = Math.max(...allTotals);
// TODO: Same as above :P
var allDaily = [];
Object.values(window.bikeCounts).forEach((bc) => {
  bc.weekly.forEach((row) => {
    allDaily.push(... row.values);
  });
})
var maxDaily = Math.max(...allDaily);

var helpers = { decipher, commafy, maxVal, maxDaily, percentify };

Vue.component('locator', locator(helpers));
Vue.component('count-grid',countGrid(helpers));
Vue.component('spark-line', sparkLine(helpers));

var app = new Vue({
  el: 'main',
  data: {
    counterNames: [ '2nd-ave', '26th-ave', '39th-ave', '58th-st', 'broadway',
      'burke-gilman', 'elliott-bay', 'fremont-bridge', 'mts', 'spokane-st'],
    bikeCounts: window.bikeCounts,
    drilldown: null,
    decipher,
    locatorReady: false,
  },
  methods: {
    toggleDrilldown(counter) {
      if (this.drilldown === counter) this.drilldown = null;
      else this.drilldown = counter;
    }
  },
});
