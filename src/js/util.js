var debounce = require("./lib/debounce");

module.exports = {
  commafy(num) {
    return num.toLocaleString('en-US');
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
    fremont_bridge_nb: 'northbound',
    fremont_bridge_sb: 'southbound',
    '2nd-ave': '2nd Ave between Madison and Marion',
    '26th-ave': '26th Ave SW Greenway at SW Oregon St',
    '39th-ave': '39th Ave NE Greenway at NE 62nd St',
    '58th-st': 'W 58th St Greenway at 22nd Ave NW',
    broadway: 'Broadway between Pike and Union',
    'burke-gilman': 'Burke Gilman Trail north of NE 70th St',
    'elliott-bay': 'Elliott Bay Trail (Myrtle Edwards Park)',
    'fremont-bridge': 'Fremont Bridge',
    mts: 'Mountain to Sound Trail at Lakeside Ave S',
    'spokane-st': 'S Spokane St Bridge',
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
