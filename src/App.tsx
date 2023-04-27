import React from 'react';
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Spotify from "./pages/Spotify";
import Youtube from "./pages/Youtube";
import {MantineProvider} from "@mantine/core";
import MainHeader from "./components/MainHeader";

function App() {
  const [currentPage, setCurrentPage] = React.useState("Home");

  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: "red",
            //  TODO: change primary color depending on the page
            //  TODO: change background color to a slightly brighter gray (currently the same as the header)
          }}
          withCSSVariables
          withGlobalStyles
          withNormalizeCSS
      >
        <BrowserRouter>
          <MainHeader currentPage={currentPage}/>
          <Routes>
            <Route path={"/"} element={<Home onData={setCurrentPage}/>}>
            </Route>
            <Route path={"/spotify"} element={<Spotify onData={setCurrentPage}/>}>
            </Route>
            <Route path={"/youtube"} element={<Youtube onData={setCurrentPage}/>}>
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
  );
}

export default App;
