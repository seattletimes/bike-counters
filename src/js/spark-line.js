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

        // Draw the line
        var maxDaily = Math.max(... this.weekly);
        var minDaily = Math.min(... this.weekly);
        context.strokeStyle = 'black';
        var ys = this.weekly.map((numBikes) => {
          var scaled = (numBikes - minDaily) / (maxDaily - minDaily);
          // Now map from [0,1] space to [canvas.height - 1, 1]
          return 1 + (canvas.height - 2) * (1 - scaled);
        });
        context.beginPath();
        ys.forEach((y, i) => {
          var x = (i * canvas.width / 6);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
      },
    },
    mounted: canvasDraw,
  };
};
