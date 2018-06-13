#!/usr/bin/env node

const fs = require('fs');

// ~~ Set up ~~

// Names of our bike counters and their two bike direction fields
const metadata = [
  { name: '2nd-ave', dirs: ['nb', 'sb'] },
  { name: '26th-ave', dirs: ['north', 'south'] },
  { name: '39th-ave', dirs: ['north', 'south'] },
  { name: '58th-st', dirs: ['east', 'west'] },
  { name: 'broadway', dirs: ['nb', 'sb'] },
  { name: 'burke-gilman', dirs: ['bike_north', 'bike_south'] },
  // { name: 'chief-sealth', dirs: ['bike_north', 'bike_south'] },
  { name: 'elliott-bay', dirs: ['bike_north', 'bike_south'] },
  { name: 'fremont-bridge', dirs: ['fremont_bridge_nb', 'fremont_bridge_sb'] },
  { name: 'mts', dirs: ['bike_north', 'bike_south'] },
  { name: 'spokane-st', dirs: ['east', 'west'] },
];

// Load in all the raw data into the `raws` object
const raws = {};
metadata.forEach((bc) => {
  raws[bc.name] = require(`./raw/${bc.name}.json`);
});

// Set up our `result` object, which we'll ultimately save as a new .json file
const result = {};
metadata.forEach((bc) => {
  result[bc.name] = {};
});

// ~~ Helper functions ~~

// Params: *inclusive* start date and *exclusive* end date, both as YYYY-MM-DD strings
// e.g. filterDate(someArray, '2014-01-01', '2018-05-01') gets us thru April 30 2018
// (because I'm lazy, and this way I don't need to think about timezones... or time of day...)
const filterDate = function filterDate(data, start, end) {
  return data.filter(r => (r.date >= start && r.date < end));
};

const sumField = function sumField(data, fieldName) {
  return data.reduce((sum, curr) => sum + (Number(curr[fieldName]) || 0), 0); // TODO: Consider sad nulls :(
};

// This will probably not mess up on timezones?
const dayOfWeek = function dayOfWeek(row) {
  return (new Date(row.date)).getDay();
};

const bikesPerDayOfWeek = function bikesPerDayOfWeek(data, field, day) {
  const filteredData = data.filter(r => dayOfWeek(r) === day);
  const dates = filteredData.map(r => r.date.slice(0,10));
  const uniqueDays = new Set(dates);
  return sumField(filteredData, field) / uniqueDays.size;
};

// ~~ Preprocess data in several ways ~~

// Calculate total bikes in each direction for May 2016-April 2017 and May 2017-April 2018
metadata.forEach((bc) => {
  const timePeriods = [
    filterDate(raws[bc.name], '2016-05-01', '2017-05-01'),
    filterDate(raws[bc.name], '2017-05-01', '2018-05-01'),
  ];
  result[bc.name].totals = bc.dirs.map(dir => ({
    dir,
    values: timePeriods.map(timeData => sumField(timeData, dir)),
  }));
});

// Calculate average per day in each direction for May 2017-April 2018
metadata.forEach((bc) => {
  const data = filterDate(raws[bc.name], '2017-05-01', '2018-05-01');
  result[bc.name].weekly = bc.dirs.map(dir => ({
    dir,
    values: [0,1,2,3,4,5,6].map(day => bikesPerDayOfWeek(data, dir, day)),
  }))
});

// ~~ Save preprocessed data to disk ~~

console.log('Saving output');
fs.writeFileSync('./data/processed.json', JSON.stringify(result, null, 2));
console.log('Done');