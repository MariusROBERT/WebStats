import React from 'react';
import './App.css';
import Home from "./pages/Home";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Spotify from "./pages/Spotify";
import Youtube from "./pages/Youtube";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home/>}>
          </Route>
          <Route path={"/spotify"} element={<Spotify/>}>
          </Route>
          <Route path={"/youtube"} element={<Youtube/>}>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
