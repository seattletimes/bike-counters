var { palette } = require("./lib/colors");
var { canvasDraw, canvasSetup, commafy } = require("./util");

var padding = {
  top: 1,
  bottom: 5,
};

module.exports = function monthGraph() {
  return {
    data() {
      return {
        ticks: {
          2: 'July 2015',
          8: 'Jan. 2016',
          14: 'July 2016',
          20: 'Jan. 2017',
          26: 'July 2017',
          32: 'Jan. 2018',
        },
        canvasWidth: 0,
        resizeListener: null,
      };
    },
    props: ['monthly', 'slug'],
    computed: {
      maxValIndex() {
        var result = 0;
        this.monthly.forEach((m, i) => {
          if (m > this.monthly[result]) result = i;
        });
        return result;
      },
      xWidth() {
        return this.canvasWidth / (this.monthly.length - 1);
      },
      xs() {
        return this.monthly.map((_, i) => i * this.xWidth);
      },
      annotation() {
        if (this.slug === 'broadway' || this.slug === '39th-ave') {
          return {
            startX: this.xs[this.maxValIndex],
            startY: 10,
            endX: this.xs[this.maxValIndex],
            endY: 50,
            textX: this.xs[this.maxValIndex],
            textY: 60,
          };
        }
        return {
          startX: this.xs[this.maxValIndex] + 5,
          startY: 1,
          endX: this.xs[this.maxValIndex] + 40,
          endY: 1,
          textX: this.xs[this.maxValIndex] + 45,
          textY: 1,
        };
      }
    },
    template: require('./_month-graph.html'),
    methods: {
      allowTick(i) {
        return i % 4 === 2 || !window.matchMedia("(max-width: 768px)").matches;
      },
      draw() {
        var canvas = this.$el.querySelector('canvas');
        var context = canvasSetup(canvas);
        this.canvasWidth = canvas.width;

        var baselineY = canvas.height - padding.bottom;
        var maxVal = this.monthly[this.maxValIndex];
        var ys = this.monthly.map((numBikes) => {
          if (numBikes === null) return null; // months to skip (no data)

          // Map from [0, maxVal] to [0, 1]
          var scaled = numBikes / maxVal;
          // Map from [0, 1] to [baselineY, padding.top]
          return (1 - scaled) * (baselineY) + scaled * padding.top;
        });


        context.lineWidth = 2;

        // Mark when bikeshare started
        context.setLineDash([5,5]);
        context.strokeStyle = palette.stLightRed;
        context.beginPath();
        var x = this.xs[26]; // July 2017
        context.moveTo(x, padding.top);
        context.lineTo(x, baselineY);
        context.stroke();

        // Draw line graph + ticks
        context.setLineDash([]);
        context.strokeStyle = 'black';
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

          // Stripe every other
          if (i % 2 === 1) {
            context.fillStyle = '#eee';
            context.fillRect(x - this.xWidth / 2, 0, this.xWidth, baselineY)
          }

          // Ticks for certain months
          // Additional condition: Either screen is bigger than tablet, or it's a "July" month
          // i.e. when screen is small, only print Julys, not Januarys
          if (this.ticks[i] && this.allowTick(i)) {
            context.fillStyle = palette.dfMiddleGray;
            context.fillRect(x - 1, baselineY - 4, 2, 8);
          }
        });
        context.stroke();

        // Draw baseline
        context.lineWidth = 1;
        context.strokeStyle = palette.dfMiddleGray;
        context.beginPath();
        context.moveTo(0, baselineY);
        context.lineTo(canvas.width, baselineY);
        context.stroke();
      },
      commafy,
      indexToMonthStr(i) {
        var months = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var years = [2015, 2016, 2017, 2018];
        var adjustedIndex = i + 4; // Since we start in May
        return `${months[adjustedIndex % 12]} ${years[Math.floor(adjustedIndex / 12)]}`;
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
