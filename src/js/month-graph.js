var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup } = require("./util");

var padding = {
  top: 1,
  bottom: 5,
};

module.exports = function monthGraph() {
  return {
    data() {
      return {
        ticks: {
          2: 'July 2016',
          8: 'Jan. 2017',
          14: 'July 2017',
          20: 'Jan. 2018',
        },
        canvasWidth: 0,
        resizeListener: null,
      };
    },
    props: ['datasets'],
    computed: {
      maxVal() {
        return Math.max(... this.datasets.monthly);
      },
      xs() {
        return this.datasets.monthly.map((_, i) =>
          this.canvasWidth * i / (this.datasets.monthly.length - 1));
      },
    },
    template: require('./_month-graph.html'),
    methods: {
      draw() {
        var canvas = this.$el.querySelector('canvas');
        var context = canvasSetup(canvas);
        this.canvasWidth = canvas.width;

        var baselineY = canvas.height - padding.bottom;
        ['monthly', 'monthly_weekday', 'monthly_weekend'].forEach((data) => {
        var ys = this.datasets[data].map((numBikes) => {
          if (numBikes === null) return null; // months to skip (no data)

          // Map from [0, maxVal] to [0, 1]
          var scaled = numBikes / this.maxVal;
          // Map from [0, 1] to [baselineY, padding.top]
          return (1 - scaled) * (baselineY) + scaled * padding.top;
        });

        // Draw baseline
        context.lineWidth = 1;
        context.strokeStyle = palette.dfMiddleGray;
        context.beginPath();
        context.moveTo(0, baselineY);
        context.lineTo(canvas.width, baselineY);
        context.stroke();

        context.lineWidth = 2;

        // Mark when bikeshare started
        context.setLineDash([5,5]);
        context.strokeStyle = palette.stLightRed;
        context.beginPath();
        var x = this.xs[14];
        context.moveTo(x, padding.top);
        context.lineTo(x, baselineY);
        context.stroke();

        // Draw line graph + ticks
        context.setLineDash([]);
        const strokeColors = {
          monthly: 'black',
          monthly_weekday: 'green',
          monthly_weekend: 'purple',
        }
        context.strokeStyle = strokeColors[data];
        context.fillStyle = palette.dfMiddleGray;
        context.beginPath();
        var skipTo = true; // Use moveTo for first month, and whenever we skip
        ys.forEach((y, i) => {
          var x = this.xs[i];

          // Skip, or move to, or line to
          if (y === null) {
            skipTo = true;
          } else if (skipTo) {
            context.moveTo(x, y);
            skipTo = false;
          } else {
            context.lineTo(x, y);
          }

          // Ticks for certain months
          if (this.ticks[i]) context.fillRect(x - 1, baselineY - 4, 2, 8);
        });
        context.stroke();
      });
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
