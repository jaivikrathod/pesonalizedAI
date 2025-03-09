import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider
import { store } from './component/redux/store.js'; // Import the Redux store
import './index.css';
import App from './App.jsx';

// Create the root and render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap App with Provider and pass the store */}
      <App />
    </Provider>
  </StrictMode>,
);