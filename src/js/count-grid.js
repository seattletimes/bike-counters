module.exports = function countGrid({decipher, maxVal, commafy}) {
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
    },
    template: require('./_count-grid.html'),
  };
};
