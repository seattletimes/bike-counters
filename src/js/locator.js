module.exports = function locator({ decipher }) {
  return {
    data() {
      return { decipher };
    },
    props: ['counter'],
    template: `<div>{{ counter }} <svg class="locator" viewBox="0 0 355.6 583.1"><use xlink:href="#North_America"></use></svg></div>`,
  };
};
