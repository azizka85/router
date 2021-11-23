import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import routerInfo from './package.json';

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';

export default {
  input: 'src/main.js',
  output: {
    file: `public/router-${routerInfo.version}.js`,
    format: 'iife',
    sourcemap: dev,    
  },
  plugins: [
    commonjs(),
    serve('public'),
    nodeResolve(),
    terser()
  ]
};