var { commafy, decipher, percentify } = require("./util");

module.exports = function countGrid() {
  return {
    data() {
      return {
        decipher,
      };
    },
    props: ['totals', 'throwaways'],
    computed: {
      deltas() {
        return this.totals.map((tot, i) => {
          if (i === 0) return null;
          return (tot - this.totals[i - 1]) / this.totals[i - 1];
        });
      },
    },
    methods: {
      commafy,
      percentify,
    },
    template: require('./_count-grid.html'),
  };
};
