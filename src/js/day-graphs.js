var { canvasDraw, canvasSetup } = require("./util");

module.exports = function dayGraphs() {
  return {
    data() {
      return { resizeListener: null };
    },
    props: ['daily'],
    template: '<canvas class="day-graphs"></canvas>',
    methods: {
      draw() {
        var canvas = this.$el;
        var context = canvasSetup(canvas);
        context.fillText('TK', 50, 50);
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
