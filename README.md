# Bike Counters

This is a Vue project with lots of components (perhaps too many, as opposed to the tax burden project).

* locator.js is for the little maps (corresponding data in processed.json is `coords`)

* count-grid.js represents those yearly totals in the main screen. A lot of the naming is realy bad here (e.g. "pair" when there are now 3 columns). The last thing I did was add those asterisks with the "x days with no bikes" messages - it was pretty rushed so it could be improved or removed. I've been trying in lots of ways to caveat the large number of discrepancies in this data. More on that below. (corresponding data in processed.json is `totals` and `numDaysThrownAwayPerYear`)

* spark-line.js represents the weeklong graph on the main screen. It's drawn in Canvas, as are the monthly/daily graphs; canvas redraws all the graphs when you resize the window. (corresponding data in processed.json is `weekly`)

* month-graph.js shows **averge bikes per day** over a 3 year period. Ignore "annotations" - here and in the daily graph: I was drawing annotations on the graphs themselves in canvas, before reverting to just writing "peak of n bikes per day in xx month" as a subhead, which is just as clear; that said, this graph could maybe be improved with a y-axis but space is tight... I want to say a bit more on the choice to use the measurement of bikes per day, which serves two purposes: 1, it is arguably a more cognitively helpful (we can almost grasp what a daily bike count is, whereas imagining all the bikes passing through a spot over a whole month is harder) and less deceptive, as it smoothes out variations based on the length of the month (e.g. even if people ride bikes just as often in february as in january, a total would underrepresent feb. by a factor of 28/31). 2, more importantly, it lets us clean the data and try to address discrepancies (more below) by only averaging over days where *at least one bike* was counted. (corresponding data in processed.json is `monthly` - and, if you choose to add it, `numDaysThrownAwayPerMonth` - could be useful context... on hover?)

* day-graphs.js shows the two graphs of bike ridership throughout the day, with directions separated out. (Important note: The seemingly reversed directions for fremont_bridge_nb and fremont_bridge_sb in util.js are **correct** according to our correspondence with dept of transportation contacts ... the data portal is exporting the directions with opposite names in the SODA API, which is how I got the data). (corresponding data in processed.json is `daily`)

## Context about the data

Here's the city's homepage: https://www.seattle.gov/transportation/projects-and-programs/programs/bike-program/bike-counters (This should probably be linked somewhere in the project, perhaps in a notes section, or in the top chatter.) We are using the data for 10 bike counters, (direct links to data below), the raw files for which are in the `raw` folder. (The Chief Sealth bike counter is not used because it hasn't been updated in years).

All the data comes from the city's data.seattle.gov portals. 3 counters (fremont, spokane st, 2nd ave) have alternate sources that you can find on that website - these are "eco-counter" widgets updated daily. I have downloaded some of this data into the `check` folder (and used the illegible `check.js` script with these) to cross check the data between the "eco-counter" and "data.seattle.gov" sources. There are a number of inconsistencies that I have brought up with the city, and they have said to trust the data.seattle.gov data. There are still periods (especially for the 2nd ave bike counter) where the numbers from "eco-counter" seem more likely to be correct to me, based on common sense. But we'll go with what the city says is the "correct" data to have a consistent and clear methodology, but we should caveat it as much as possible. Removing days with 0 bikes counted (this is so improbable to basically be impossible - there are a few people biking even in the dead of winter) is one way I've tried to account for the issues (you'll see gaps in the monthly graph when no bikes were counted for the whole month, and of course the averaging per days method corrects a bit), but there are also days when bikes were counted but likely undercounted. :( Michelle has all of our correspondences with the city and can go into the issues.

Basically we probably can't fix everything, but we should make sure appropriate caveats are presented with the graphs.

preprocess.js takes all the data in `raw/` and spits out the aggregated data we want into `data/processed.json` which is then loaded into the app through the Grunt build process. preprocess.js runs automatically as part of the grunt pipeline (a task called `bike`) so if you change it, processed.json should change within a few seconds. You can also run it manually with `node preprocess.js`

Good luck! I'm so so sorry the CSS (and other stuff, but especially the CSS) is such a mess.


## Data Sources

https://www.seattle.gov/transportation/projects-and-programs/programs/bike-program/bike-counters

* burke-gilman
  https://data.seattle.gov/Transportation/Burke-Gilman-Trail-north-of-NE-70th-St-Bike-and-Pe/2z5v-ecg8

  https://data.seattle.gov/resource/9nka-b3jn.json?$limit=999999999&$order=date

  2014-01-01 through 2018-04-30

* 58th-st
  https://data.seattle.gov/Transportation/NW-58th-St-Greenway-at-22nd-Ave-NW-Bike-Counter/47yq-6ugv

  https://data.seattle.gov/resource/kng8-tayh.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-31

* 39th-ave
  https://data.seattle.gov/Transportation/39th-Ave-NE-Greenway-at-NE-62nd-St/3h7e-f49s/

  https://data.seattle.gov/resource/5cig-k5cs.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-31

* mts
  https://data.seattle.gov/Transportation/MTS-Trail-west-of-I-90-Bridge/u38e-ybnc

  https://data.seattle.gov/resource/ekqi-b8f3.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-31

* chief-sealth
  https://data.seattle.gov/Transportation/Chief-Sealth-Trail-North-of-Thistle/uh8h-bme7

  https://data.seattle.gov/resource/t4f9-hyjz.json?$limit=999999999&$order=date

  2014-01-01 through 2015-11-30

* broadway
  https://data.seattle.gov/Transportation/Broadway-Cycle-Track-North-Of-E-Union-St/j4vh-b42a

  https://data.seattle.gov/resource/keqs-cqp7.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-31

* elliott-bay
  https://data.seattle.gov/Transportation/Elliott-Bay-Trail-in-Myrtle-Edwards-Park/4qej-qvrz

  https://data.seattle.gov/resource/65r9-nekm.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-31

* 26th-ave
  https://data.seattle.gov/Transportation/26th-Ave-SW-Greenway-at-SW-Oregon-St/mefu-7eau

  https://data.seattle.gov/resource/ibyv-67da.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-01

  check east: http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/102008768/?begin=20150501&end=20180430&step=3

  check west: http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/101008768/?begin=20150501&end=20180430&step=3

* spokane-st
  https://data.seattle.gov/Transportation/Spokane-St-Bridge-Counter/upms-nr8w

  https://data.seattle.gov/resource/v6y4-2gyc.json?$limit=999999999&$order=date

  2014-01-01 through 2018-05-31

* 2nd-ave
  https://data.seattle.gov/Transportation/2nd-Ave-Cycle-Track-North-of-Marion-St/avwm-i8ym

  https://data.seattle.gov/resource/aq6e-mcz8.json?$limit=999999999&$order=date

  2015-01-01 through 2018-05-31

  check nb: http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/101030820/?begin=20160501&end=20180430&step=3

  check sb: http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/102030820/?begin=20160501&end=20180430&step=3

* fremont-bridge
  https://data.seattle.gov/Transportation/Fremont-Bridge-Hourly-Bicycle-Counts-by-Month-Octo/65db-xm6k

  https://data.seattle.gov/resource/4xy5-26gy.json?$limit=999999999&$order=date

  2012-10-03 through 2018-05-31

  check "nb" (not actually northbound): http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/101020981/?begin=20150501&end=20180430&step=3
  
  check "sb" (not actually southbound): http://www.eco-public.com/api/cw6Xk4jW4X4R/data/periode/102020981/?begin=20150501&end=20180430&step=3

* linden-ave
  ??? Can't find dataset, even though it's on the city's map of bike counters
