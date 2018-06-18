var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup } = require("./util");

module.exports = function sparkLine() {
  return {
    data() {
      return { resizeListener: null };
    },
    props: ['weekly'],
    template: '<canvas></canvas>',
    methods: {
      draw() {
        var canvas = this.$el;
        var context = canvasSetup(canvas);
        context.lineWidth = 1.5;

        // Draw each line
        this.weekly.forEach((row, dirNum) => {
          var maxDaily = Math.max(... row.values);
          var minDaily = Math.min(... row.values);
          var ys = row.values.map((numBikes) => {
            var scaled = (numBikes - minDaily) / (maxDaily - minDaily);
            // Now map from [0,1] space to [canvas.height - 1, 1]
            return Math.round(1 + (canvas.height - 2) * (1 - scaled));
          });
          context.strokeStyle = dirNum ? palette.stDarkBlue : palette.stDarkRed;
          context.beginPath();
          ys.forEach((y, i) => {
            var x = Math.round(i * canvas.width / 6);
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          });
          context.stroke();
        });
      },
    },
    mounted: canvasDraw,
  };
};
