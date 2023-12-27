import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import RestaurantDetails from './routes/RestaurantDetails';
import UpdatePage from './routes/UpdatePage';
import { RestaurantsContextProvider } from './Context/RestaurantsContext';

const App = () => {
  return (
    <RestaurantsContextProvider>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/restaurant/:id/update" element={<UpdatePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </RestaurantsContextProvider>
  );
};

export default App;
