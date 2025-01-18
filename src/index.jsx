import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { BrowserRouter } from 'react-router-dom';

import HistoryRouter from './components/history-router/history-router.jsx';
import browserHistory from './browser-history.js';

import { App } from './components/app/app.jsx';

const rootNode = document.querySelector('#root');
const root = createRoot(rootNode);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
