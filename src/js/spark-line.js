var { palette } = require("./lib/colors");
var debounce = require("./lib/debounce");

module.exports = function sparkLine({maxDaily}) {
  return {
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

        // Draw each line
        this.weekly.forEach((row, dirNum) => {
          var maxDaily = Math.max(... row.values);
          var minDaily = Math.min(... row.values);
          var ys = row.values.map((numBikes) => {
            var scaled = (numBikes - minDaily) / (maxDaily - minDaily);
            // Now map from [0,1] space to [canvas.height, 0]
            return Math.round((canvas.height) * (1 - scaled));
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
    mounted() {
      this.draw();
      window.addEventListener('resize', () => {
        debounce(this.draw)();
      });
    },
  };
};
