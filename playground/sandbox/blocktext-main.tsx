import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import BlockTextPlayground from './BlockTextPlayground';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlockTextPlayground />
  </StrictMode>,
);
