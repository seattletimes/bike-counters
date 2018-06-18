var { commafy, decipher, percentify } = require("./util");

module.exports = function countGrid() {
  return {
    data() {
      return {
        decipher,
      };
    },
    props: ['totals'],
    methods: {
      commafy,
      percentify,
    },
    template: require('./_count-grid.html'),
  };
};
