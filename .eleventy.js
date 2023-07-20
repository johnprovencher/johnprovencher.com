module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('./src/style.css')
	eleventyConfig.addPassthroughCopy('./src/script.js')
	eleventyConfig.addPassthroughCopy('./src/assets')

	return {
		dir: {
			input: "src",
			output: "public"
		}
	}
}