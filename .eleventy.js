module.exports = function(eleventyConfig) {

	eleventyConfig.addPassthroughCopy('./src/style.css')
	eleventyConfig.addPassthroughCopy('./src/script.js')
	eleventyConfig.addPassthroughCopy('./src/assets')
	eleventyConfig.addPassthroughCopy('./src/admin')

	return {
		dir: {
			input: "src",
			output: "public"
		}
	}
}