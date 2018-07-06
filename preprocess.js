#!/usr/bin/env node

const fs = require('fs');

// ~~ Set up ~~

// Names of our bike counters and their two bike direction fields
const metadata = [
  { name: '2nd-ave', dirs: ['nb', 'sb'], coords: [179, 318] },
  { name: '26th-ave', dirs: ['north', 'south'] , coords: [135, 410] },
  { name: '39th-ave', dirs: ['north', 'south'] , coords: [255, 160] },
  { name: '58th-st', dirs: ['east', 'west'] , coords: [110, 170] },
  { name: 'broadway', dirs: ['nb', 'sb'] , coords: [205, 292] },
  { name: 'burke-gilman', dirs: ['bike_north', 'bike_south'] , coords: [285, 153] },
  { name: 'elliott-bay', dirs: ['bike_north', 'bike_south'] , coords: [145, 285] },
  { name: 'fremont-bridge', dirs: ['fremont_bridge_nb', 'fremont_bridge_sb'] , coords: [160, 222] },
  { name: 'mts', dirs: ['bike_north', 'bike_south'] , coords: [256, 350] },
  { name: 'spokane-st', dirs: ['east', 'west'] , coords: [160, 390] },
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

const filterHour = function filterHour(data, hourStr) {
  // String is like 2014-01-01T02:00:00.000 --> slice(11,13) is like '02'
  return data.filter(r => (r.date.slice(11, 13) === hourStr));
};

const sumField = function sumField(data, fieldName) {
  return data.reduce((sum, curr) => sum + (Number(curr[fieldName]) || 0), 0); // TODO: Consider sad nulls :(
};

// This will probably not mess up on timezones?
const dayOfWeek = function dayOfWeek(row) {
  return (new Date(row.date)).getDay();
};

const bikesPerDayOfWeek = function bikesPerDayOfWeek(data, fields, day) {
  const filteredData = data.filter(r => dayOfWeek(r) === day);
  const dates = filteredData.map(r => r.date.slice(0,10));
  const uniqueDays = new Set(dates);
  return (sumField(filteredData, fields[0]) + sumField(filteredData, fields[1])) / uniqueDays.size;
};

const monthRange  = function monthRange(startYear, startMonth, endYear, endMonth) {
  const result = [];
  let [currYear, currMonth] = [startYear, startMonth];
  while (currYear < endYear || (currYear === endYear && currMonth <= endMonth)) {
    result.push(`${currYear}-${currMonth.toString().padStart(2, '0')}-01`);
    if (currMonth === 12) {
      currYear += 1;
      currMonth = 1;
    } else {
      currMonth += 1
    }
  }
  return result;
};

// ~~ Preprocess data in several ways ~~

// Calculate total bikes in each direction for May 2016-April 2017 and May 2017-April 2018
metadata.forEach((bc) => {
  const timePeriods = [
    filterDate(raws[bc.name], '2015-05-01', '2016-05-01'),
    filterDate(raws[bc.name], '2016-05-01', '2017-05-01'),
    filterDate(raws[bc.name], '2017-05-01', '2018-05-01'),
  ];
  result[bc.name].totals = timePeriods.map(timeData => sumField(timeData, bc.dirs[0]) + sumField(timeData, bc.dirs[1]));
});

// Calculate average per day in each direction for May 2017-April 2018
metadata.forEach((bc) => {
  const data = filterDate(raws[bc.name], '2017-05-01', '2018-05-01');
  result[bc.name].weekly = [0,1,2,3,4,5,6].map(day => bikesPerDayOfWeek(data, bc.dirs, day));
});

// Total bikes for each month from May 2016 - April 2018
metadata.forEach((bc) => {
  const months = monthRange(2016, 5, 2018, 4);
  result[bc.name].monthly = months.map((monthStr, i) => {
    // Sad special case for erroneous 2nd-ave data
    // Corrected numbers from https://www.seattle.gov/transportation/projects-and-programs/programs/bike-program/bike-counters/2nd-ave-bike-counter
    if (bc.name === '2nd-ave' && monthStr === '2016-11-01') return (9529 + 6559) / 30;

    const data = filterDate(raws[bc.name], monthStr, months[i + 1] || '2018-05-01') // Filter to dates from the desired month
      .filter(r => Number(r[bc.dirs[0]]) > 0 || Number(r[bc.dirs[1]]) > 0); // Remove hours with no counters
    const dates = data.map(r => r.date.slice(0,10));
    const uniqueDays = new Set(dates);
    return (sumField(data, bc.dirs[0]) + sumField(data, bc.dirs[1])) / uniqueDays.size;
    // If we have an empty month, this returns (0 + 0) / 0 = NaN, which gets stringified to null, lol
  });
});

// Average bikes per hr for May 2017-April 2018 - separated by weekend/weekday and direction
metadata.forEach((bc) => {
  const data = filterDate(raws[bc.name], '2017-05-01', '2018-05-01');
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  hours.push('00'); // 12am at start and end
  ['weekday', 'weekend'].forEach((dayType) => {
    const acceptableDays = (dayType === 'weekday') ? new Set([1,2,3,4,5]) : new Set([0,6]);
    result[bc.name][dayType] = bc.dirs.map(dir => ({
      dir,
      values: hours.map((hourStr) => {
        const hourData = filterHour(data, hourStr);
        const dayTypeData = hourData.filter(r => acceptableDays.has(dayOfWeek(r)));
        return sumField(dayTypeData, dir) / dayTypeData.length;
      }),
    }));
  });
});

// Attach coords
metadata.forEach((bc) => {
  result[bc.name].coords = bc.coords;
});

// ~~ Save preprocessed data to disk ~~

console.log('Saving output');
fs.writeFileSync('./data/processed.json', JSON.stringify(result, null, 2));
console.log('Done');
