var debounce = require("./lib/debounce");

module.exports = {
  commafy(num) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  },
  percentify(num) {
    return `${num > 0 ? '+' : ''}${Math.round(100 * num)}%`;
  },
  // TODO: double check these meanings with the city
  decipher: {
    nb: 'northbound',
    sb: 'southbound',
    north: 'northbound',
    south: 'southbound',
    east: 'eastbound',
    west: 'westbound',
    bike_north: 'northbound',
    bike_south: 'southbound',
    fremont_bridge_nb: 'southbound',
    fremont_bridge_sb: 'northbound',
    '2nd-ave': '2nd Ave. between Madison and Marion',
    '26th-ave': '26th Ave. SW at SW Oregon St.',
    '39th-ave': '39th Ave. NE at NE 62nd St.',
    '58th-st': 'W 58th St. at 22nd Ave. NW',
    broadway: 'Broadway between Pike and Union',
    'burke-gilman': 'Burke Gilman Trail north of NE 70th St.',
    'elliott-bay': 'Elliott Bay Trail in Myrtle Edwards Park',
    'fremont-bridge': 'Fremont Bridge',
    mts: 'Mountain to Sound Trail west of I-90 Bridge',
    'spokane-st': 'S Spokane St. Bridge',
  },
  canvasSetup(canvas) {
    // Fixed some resizing issues
    canvas.width = 0;
    canvas.height = 0;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    return canvas.getContext('2d');
  },
  canvasDraw() {
    this.draw();
    this.resizeListener = debounce(this.draw);
    window.addEventListener('resize', this.resizeListener);
  },
};
