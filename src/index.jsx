import React from 'react';
import ReactDOM from 'react-dom';
import 'react-image-lightbox/style.css';
import { Provider } from 'react-redux';
import './styles/app.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store/store';
// import "~slick-carousel/slick/slick.css";
// import "~slick-carousel/slick/slick-theme.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
