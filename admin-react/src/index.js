import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './app/store'
import { Provider } from 'react-redux'
import SuspenseContent from './containers/SuspenseContent';
import { CommonDataProvider } from './context/CommonDataContext'
import { ToastProvider } from './components/Toast/ToastProvider'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Suspense fallback={<SuspenseContent />}>
    <Provider store={store}>
      <ToastProvider>
        <CommonDataProvider>
          <App />
        </CommonDataProvider>
      </ToastProvider>
    </Provider>
  </Suspense>
  // </React.StrictMode>
);
