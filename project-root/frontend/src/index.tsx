import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' instead of 'react-dom'
import './styles/global.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // Create a root container
root.render(
    <React.StrictMode>
        <Provider store={store}>
    <App />
  </Provider>,
    </React.StrictMode>
);
