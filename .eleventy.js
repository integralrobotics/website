import { DateTime } from "luxon"
import svgSprite from "eleventy-plugin-svg-sprite"
import cssnano from 'cssnano';
import postcss from 'postcss';
const PORT = 8080 // use a port you are reasonably sure is not in use elsewhere

export default function (eleventyConfig) {
    // GENERAL
    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/admin');
    eleventyConfig.addPassthroughCopy({ './src/favicon': '/' });
    eleventyConfig.addPassthroughCopy("./src/fonts");
    eleventyConfig.setBrowserSyncConfig({
        files: './public/css/**/*.css',
        open: 'local'
    });

    // SERVER
    eleventyConfig.setServerOptions({
        liveReload: true,
        watch: ['./public/css/**/*.css'],
        port: PORT,
    });

    // PLUGINS
    eleventyConfig.addPlugin(svgSprite, {
        path: "./src/assets/icons",
        globalClasses: "svg-icon",
    });

    // SHORTCODES
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    eleventyConfig.addShortcode("icon", (name, extraClass) => {
        const svgClass = name.includes('logo') ? extraClass : `svg-icon ${extraClass}`;
        return `<svg class="${svgClass}" focusable="false" aria-hidden="true"><use xlink:href="#svg-${name}"></use></svg>`;
    });

    eleventyConfig.addFilter("inlineFontCSS", async function (code) {
        try {
            const result = await postcss([cssnano]).process(code, { from: undefined });
            const adjustedCSS = result.css.replace(/url\('\.\.\/fonts\//g, "url('/fonts/");
            return `<style>${result.css}</style>`;
        } catch (error) {
            console.error("Error minifying CSS:", error);
            return code;
        }
    });

    return {
        dir: {
            input: "src",
            output: "public",
        },
    };


}