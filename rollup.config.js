import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [{ file: pkg.main, format: 'cjs' }],
  plugins: [terser()],
  external: ['fs'],
};
