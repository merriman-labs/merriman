import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import 'bootswatch/dist/darkly/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { AuthProvider } from './context/UserContext';
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById('root')
);
