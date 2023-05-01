import React from 'react';
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Spotify from "./pages/Spotify";
import Youtube from "./pages/Youtube";
import {MantineProvider} from "@mantine/core";
import MainHeader from "./components/MainHeader";

function App() {
  const [currentPage, setCurrentPage] = React.useState("Home");
  const [primaryColor, setPrimaryColor] = React.useState("blue");

  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: primaryColor,
            //  TODO: change background color to a slightly brighter gray (currently the same as the header)
          }}
          withCSSVariables
          withGlobalStyles
          withNormalizeCSS
      >
        <BrowserRouter>
          <MainHeader currentPage={currentPage}/>
          <Routes>
            <Route path={"/"} element={<Home onData={setCurrentPage} onPrimaryColor={setPrimaryColor}/>}>
            </Route>
            <Route path={"/spotify"} element={<Spotify onData={setCurrentPage} onPrimaryColor={setPrimaryColor}/>}>
            </Route>
            <Route path={"/youtube"} element={<Youtube onData={setCurrentPage} onPrimaryColor={setPrimaryColor}/>}>
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
  );
}

export default App;
