const { DateTime } = require("luxon")

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/style.css')
    eleventyConfig.addPassthroughCopy('./src/script.js')
    eleventyConfig.addPassthroughCopy('./src/assets')
    eleventyConfig.addPassthroughCopy('./src/admin')
    eleventyConfig.addPassthroughCopy("./src/admin/config.yml");
    eleventyConfig.addGlobalData('lore', '.src/data/lore.json');


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