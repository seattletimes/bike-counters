var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup } = require("./util");

module.exports = function sparkLine() {
  return {
    data() {
      return {
        canvasWidth: 0,
        ticks: {
          0: 'Sun.',
          6: 'Sat.',
        },
        resizeListener: null
      };
    },
    props: ['weekly'],
    computed: {
      xWidth() {
        return this.canvasWidth / (this.weekly.length - 1);
      },
      xs() {
        return this.weekly.map((_, i) => i * this.xWidth);
      },
    },
    template: require('./_spark-line.html'),
    methods: {
      draw() {
        var canvas = this.$el.querySelector('canvas');
        var context = canvasSetup(canvas);
        this.canvasWidth = canvas.width;
        context.lineWidth = 1.5;

        // Draw the line
        var maxDaily = Math.max(... this.weekly);
        var minDaily = Math.min(... this.weekly);
        context.strokeStyle = 'black';
        context.fillStyle = '#eee';
        var ys = this.weekly.map((numBikes) => {
          var scaled = (numBikes - minDaily) / (maxDaily - minDaily);
          // Now map from [0,1] space to [canvas.height - 1, 1]
          return 1 + (canvas.height - 2) * (1 - scaled);
        });
        context.beginPath();
        ys.forEach((y, i) => {
          var x = this.xs[i];
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);

          // Striping
          if (i % 2 === 1) context.fillRect(x - this.xWidth / 2, 0, this.xWidth, canvas.height - 1);
        });
        context.stroke();
      },
    },
    mounted: canvasDraw,
  };
};
