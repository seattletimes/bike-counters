var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup, commafy, decipher } = require("./util");

var padding= {
  top: 1,
  bottom: 5,
};

var drawDay = function drawDay(dayType) {
  var data = this[dayType];
  var canvas = this.$el.querySelector(`.${dayType}`);
  var context = canvasSetup(canvas);
  this.canvasWidth = canvas.width;

  // Temporary..
  var baselineY = canvas.height - padding.bottom;

  //Shade left and right
  context.fillStyle = '#eee';
  context.fillRect(0, 0, this.xs[9], baselineY);
  context.fillRect(this.xs[17], 0, this.xs[24] - this.xs[17], baselineY);

  // Draw baseline
  context.lineWidth = 1;
  context.strokeStyle = palette.dfMiddleGray;
  context.beginPath();
  context.moveTo(0, baselineY);
  context.lineTo(canvas.width, baselineY);
  context.stroke();

  // Draw annotation line
  context.beginPath();
  context.moveTo(this.annotations[dayType].startX, this.annotations[dayType].startY);
  context.lineTo(this.annotations[dayType].endX, this.annotations[dayType].endY);
  context.stroke();

  // max of both directions
  var maxVal = this.maxValsAndIndexes[dayType][0];

  // Draw actual lines
  context.lineWidth = 2;
  data.forEach((dirData, dirNum) => {
    var ys = dirData.values.map((numBikes) => {
      var scaled = numBikes / maxVal;
      // Map [0,1] to [baselineY, 1]
      return (1 - scaled) * baselineY + scaled * padding.top;
    });
    context.strokeStyle = dirNum  ? palette.stDarkBlue : palette.stDarkRed;
    context.beginPath();
    ys.forEach((y, i) => {
      var x = this.xs[i];
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  });

  // Ticks
  context.fillStyle = palette.dfMiddleGray;
  this.xs.forEach((x) => {
    context.fillRect(x - 1, baselineY - 2, 2, 4);
  });
};

module.exports = function dayGraphs() {
  return {
    data() {
      return {
        ticks: {
          9: '9 a.m.',
          17: '5 p.m.',
        },
        canvasWidth: 0,
        decipher,
        resizeListener: null
      };
    },
    props: ['weekday', 'weekend', 'slug'],
    computed: {
      maxValsAndIndexes() {
        var result = {};
        ['weekday', 'weekend'].forEach((dayType) => {
          var valAndIndex = [this[dayType][0].values[0], 0];
          [0, 1].forEach((dir) => {
            this[dayType][dir].values.forEach((n, i) => {
              if (n > valAndIndex[0]) valAndIndex = [n, i];
            });
          });
          result[dayType] = valAndIndex;
        });
        return result;
      },
      annotations() {
        var result = {};
        ['weekday', 'weekend'].forEach((dayType) => {
          var maxValIndex = this.maxValsAndIndexes[dayType][1];
          var goRight = (maxValIndex > 12) ? 1 : -1;
          result[dayType] = {
            startX: this.xs[maxValIndex] + 5 * goRight,
            startY: 2,
            endX: (goRight === 1) ? this.xs[20] : this.xs[4],
            endY: 8,
            textX: (goRight === 1) ? this.xs[20] : this.xs[4],
            textY: 10,
          }
        });
        return result;
      },
      xs() {
        return this.weekday[0].values.map((_, i) =>
          this.canvasWidth * i / (this.weekday[0].values.length - 1));
      },
    },
    template: require('./_day-graphs.html'),
    methods: {
      draw() {
        drawDay.call(this, 'weekday');
        drawDay.call(this, 'weekend');
      },
      commafy,
      betterDecipher(shorthand) { // mts labels are wrong
        if (this.slug === 'mts' ) {
          if (shorthand === 'bike_north') return 'eastbound';
          if (shorthand === 'bike_south') return 'westbound';
        }
        return this.decipher[shorthand];
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
