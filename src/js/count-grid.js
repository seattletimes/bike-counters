module.exports = function countGrid({decipher, maxVal, commafy, percentify}) {
  return {
    data() {
      return {
        decipher,
        maxVal,
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
