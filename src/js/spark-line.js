var { palette } = require("./lib/colors");

module.exports = function sparkLine(maxDaily) {
  return {
    data() {
      return {
        maxDaily,
      };
    },
    props: ['weekly'],
    template: '<canvas></canvas>',
    methods: {
      draw() {
        var canvas = this.$el;
        var context = canvas.getContext('2d');
        canvas.width = 0;
        canvas.height = 0;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        var abbrevs = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        var xs = [1, 2, 3, 4, 5, 6, 7].map(n => Math.round(n * canvas.width / 8));

        // Draw day of week letters
        context.font = '16px sans-serif'; // TODO: fix font
        context.textAlign = 'center';
        abbrevs.forEach((abbrev, i) => {
          var x = xs[i];
          context.fillText(abbrev, x, canvas.height - 5);
        });

        // Draw baseline (20 pixels room at bottom for text)
        context.beginPath();
        context.moveTo(0, canvas.height - 20);
        context.lineTo(canvas.width, canvas.height - 20);
        context.stroke();

        // Draw each line
        this.weekly.forEach((row, dirNum) => {
          var ys = row.values.map((numBikes) => {
            var scaled = numBikes / this.maxDaily;
            // Now map from [0,1] space to [canvas.height - 20, 10]
            // i.e. 20 padding at bottom (for letters), 10 padding at top
            return Math.round((canvas.height - 20) * (1 - scaled) + 10 * scaled);
          });
          context.strokeStyle = dirNum ? palette.stDarkBlue : palette.stDarkRed;
          context.beginPath();
          xs.forEach((x, i) => {
            var y = ys[i];
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
            // context.fillRect(x - 2, y - 2, 4, 4);
          });
          context.stroke();
        });
      },
    },
    mounted() {
      this.draw();
      window.addEventListener('resize', () => {
        debounce(this.draw)();
      });
    },
  };
};
