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
        context.fillText('TK', 50, 50);
      },
    },
    mounted: canvasDraw,
    destroyed() {
      window.removeEventListener('resize', this.resizeListener);
    },
  };
};
