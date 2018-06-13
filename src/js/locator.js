module.exports = function locator({ decipher }) {
  return {
    data() {
      return { decipher };
    },
    props: ['counter', 'coords'],
    template: require('./_locator.html'),
  };
};
