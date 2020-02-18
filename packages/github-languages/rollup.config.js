import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

const banner =
  '/*!\n' +
  ` * ${pkg.name} v${pkg.version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} ${pkg.authors[0]}\n` +
  ` * Released under the ${pkg.license} License.\n` +
  ' */'

const isProd = process.env.NODE_ENV === 'production'
const prefix = isProd ? '.min' : ''

export default (async () => [
  {
    input: 'src/index.js',
    output: {
      file: `dist/github-languages.umd${prefix}.js`,
      format: 'umd',
      name: 'GitHubLanguages',
      banner,
    },
    plugins: [
      json(),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      isProd && (await import('rollup-plugin-terser')).terser(),
    ],
  },
  {
    input: 'src/index.js',
    external: Object.keys(pkg.dependencies),
    output: [
      { file: `dist/github-languages.cjs${prefix}.js`, format: 'cjs', banner },
      { file: `dist/github-languages.esm${prefix}.js`, format: 'es', banner },
    ],
    plugins: [isProd && (await import('rollup-plugin-terser')).terser()],
  },
])()
