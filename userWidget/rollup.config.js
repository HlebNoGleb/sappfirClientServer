import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import { terser } from 'rollup-plugin-terser';

export default {
	input: './src/App.svelte',
	output: {
		format: 'iife',
		name: 'MyWidget', // Name of the class we will call on the page
		file: 'dist/mywidget.js' // the file which we will include on the page
	},
	plugins: [
        css({ output: 'public/build/vendor.css' }),
		svelte({
			emitCss: false  // Let's store CSS in JS (no-depends), but you can emit it in separate *.css file too
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),
		terser()
	]
};