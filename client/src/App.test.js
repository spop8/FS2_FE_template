import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});


// POST http://localhost:3001/api/cart
// Content-Type: application/json

// {
//   "name": "IPhone 14 Pro Max",
//   "description": "Latest model with advanced features",
//   "price": 1099,
//   "image_url": "https://example.com/iphone14.jpg"
// }