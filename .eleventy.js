const { DateTime } = require("luxon")

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/style.css')
    eleventyConfig.addPassthroughCopy('./src/script.js')
    eleventyConfig.addPassthroughCopy('./src/assets')
    eleventyConfig.addPassthroughCopy('./src/admin')
    eleventyConfig.addPassthroughCopy('./src/data/lore.json')
    eleventyConfig.addPassthroughCopy("./src/admin/config.yml");

    // Custom function to load data from 'data' folder
    eleventyConfig.addDataExtension("json", (contents) => {
        return JSON.parse(contents);
    });

    // Set the data directory to 'data'
    eleventyConfig.setDataDeepMerge(true);
    eleventyConfig.setDataDir("data");
    
    eleventyConfig.addFilter('postDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
    })

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}