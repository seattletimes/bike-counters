module.exports = function(grunt) {
  grunt.registerTask("bike", "preprocesses bike data", () => {
    // Since the script itself is what's most likely to change,
    // we make re-require it by force if watch sees a change
    delete require.cache[require.resolve("../preprocess.js")];
    require("../preprocess.js");
  });
};
