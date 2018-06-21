var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup, decipher } = require("./util");

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
  context.fillRect(0, padding.top, this.xs[9], baselineY);
  context.fillRect(this.xs[17], padding.top, this.xs[23] - this.xs[17], baselineY);

  // Draw baseline
  context.lineWidth = 1;
  context.strokeStyle = palette.dfMiddleGray;
  context.beginPath();
  context.moveTo(0, baselineY);
  context.lineTo(canvas.width, baselineY);
  context.stroke();

  // max of both directions
  var maxVal = Math.max(... data[0].values.concat(data[1].values));

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
    props: ['weekday', 'weekend'],
    computed: {
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
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
