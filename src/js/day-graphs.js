var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup } = require("./util");

var drawDay = function drawDay(dayType, data, parent) {
  var canvas = parent.querySelector(`.${dayType}`);
  var context = canvasSetup(canvas);

  // Temporary..

  context.lineWidth = 1;
  context.strokeStyle = palette.dfMiddleGray;
  context.beginPath();
  context.moveTo(0, canvas.height - 20);
  context.lineTo(canvas.width, canvas.height - 20);
  context.stroke();

  // max of both directions
  var maxVal = Math.max(... data[0].values.concat(data[1].values));
  data.forEach((dirData, dirNum) => {
    var ys = dirData.values.map((numBikes) => {
      var scaled = numBikes / maxVal;
      // Map [0,1] to [canvas.height - 20, 1]
      return (1 - scaled) * (canvas.height - 20) + scaled;
    });
    context.strokeStyle = dirNum  ? palette.stDarkBlue : palette.stDarkRed;
    context.lineWidth = 2;
    context.beginPath();
    ys.forEach((y, i) => {
      var x = i * canvas.width / (ys.length - 1);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  });
};

module.exports = function dayGraphs() {
  return {
    data() {
      return { resizeListener: null };
    },
    props: ['weekday', 'weekend'],
    template: '<div class="day-graphs"><canvas class="weekday"></canvas><canvas class="weekend"></canvas></div>',
    methods: {
      draw() {
        drawDay('weekday', this.weekday, this.$el);
        drawDay('weekend', this.weekend, this.$el);
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
