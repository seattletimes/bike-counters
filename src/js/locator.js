var { decipher } = require("./util");

module.exports = function locator() {
  return {
    data() {
      return { decipher };
    },
    props: ['counter', 'coords'],
    template: require('./_locator.html'),
  };
};
