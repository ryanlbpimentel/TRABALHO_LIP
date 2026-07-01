import React from 'react';
import { createRoot } from 'react-dom/client';
import { html } from './utils/html.js';
import App from './App.js';

createRoot(document.getElementById('root')).render(
  html`<${React.StrictMode}>
    <${App} />
  </${React.StrictMode}>`
);
