var data = require('./raw/fremont-bridge.json');

var check = require('./check/fremont-sb-not-sb-check.json');

const dataDict = {};
data.forEach((r) => {
  dataDict[r.date] = r;
});

const convertDate = function convertDate(d) {
  return d.slice(0,10) + 'T' + d.slice(11,13) + ':00:00.000';
};

var count = 0;
var days = new Set();
check.forEach((row) => {
  var datum = dataDict[convertDate(row.date)];
  if (!datum) {
    console.log('skipped one');
    return;
  }
  if (row.comptage === null) row.comptage = 0;

  if (datum.fremont_bridge_sb !== row.comptage.toString()) {
    console.log(row);
    count += 1;
    days.add(row.date.slice(0,10));
  }
});

console.log('mismatching hours:', count);
console.log('total hours:', check.length);

console.log('days with mismatch:', days.size);
console.log('total days:', 365 * 3);
Array.from(days).sort().forEach(d => console.log(d));

console.log('below here are days with weird numbers of hours');
var weird = {};
check.forEach((row) => {
  var date = row.date.slice(0,10);
  if (!weird[date]) weird[date] = 0;
  weird[date] += 1;
});
Object.entries(weird).forEach(([key, val]) => {
  if (val !== 24) console.log(key, val);
})