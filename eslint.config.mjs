import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals.js';

export default [
  ...next,
  ...nextCoreWebVitals,
  { ignores: ['.next/**', 'node_modules/**', 'wordpress-export/**', 'playwright-report/**', 'test-results/**'] },
];
