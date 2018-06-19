var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup } = require("./util");

module.exports = function monthGraph() {
  return {
    data() {
      return { resizeListener: null };
    },
    props: ['monthly'],
    template: '<canvas class="month-graph"></canvas>',
    methods: {
      draw() {
        var canvas = this.$el;
        var context = canvasSetup(canvas);

        // Baseline
        context.lineWidth = 1;
        context.strokeStyle = palette.dfMiddleGray;
        context.beginPath();
        context.moveTo(0, canvas.height - 20);
        context.lineTo(canvas.width, canvas.height - 20);
        context.stroke();

        var maxVal = Math.max(... this.monthly);
        var ys = this.monthly.map((numBikes) => {
          var scaled = numBikes / maxVal;
          // Map from [0, 1] to [canvas.height - 20, 1]
          return (1 - scaled) * (canvas.height - 20) + scaled;
        });
        context.font = '15px sans-serif';
        context.textAlign = 'center';
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.beginPath();
        ys.forEach((y, i) => {
          var x = i * canvas.width / (ys.length - 1);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);

          // Label a couple of months
          if (i === 2 || i === 8 || i === 14 || i === 20) {
            var labels = { 2: 'July 2016', 8: 'Jan. 2017', 14: 'July 2017', 20: 'Jan. 2018' };
            var label = labels[i];
            context.fillStyle = palette.dfMiddleGray;
            context.fillRect(x - 1, canvas.height - 24, 2, 8);
            context.fillStyle = 'black';
            context.fillText(label, x, canvas.height - 3);
          }
        });
        context.stroke();

        // Mark when bikeshare started
        context.setLineDash([5,5]);
        context.strokeStyle = palette.stLightRed;
        context.beginPath();
        var x = 14 * canvas.width / (ys.length - 1);
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height - 20);
        context.stroke();
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
