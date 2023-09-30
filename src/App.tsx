import React from 'react';
import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Spotify from './pages/Spotify/Spotify';
import Youtube from './pages/Youtube';
import {MantineProvider} from '@mantine/core';
import MainHeader from './components/MainHeader';
import {Tracks} from './pages/Spotify/Tracks';

function App() {
  const [currentPage, setCurrentPage] = React.useState('Home');
  const [primaryColor, setPrimaryColor] = React.useState('blue');

  return (
    <MantineProvider
      theme={{
        colors: {
          'green': ['#e8fdf1', '#d6f9e2', '#acf1c4', '#7ee9a3', '#59e388', '#42df76', '#35dd6d', '#27c45b', '#1bae4f', '#009741'],
        },
        colorScheme: 'dark',
        primaryColor: primaryColor,
        //  TODO: change background color to a slightly brighter gray (currently the same as the header)
      }}
      withCSSVariables
      withGlobalStyles
      withNormalizeCSS
    >
      <BrowserRouter>
        <MainHeader currentPage={currentPage}/> {/*test*/}
        <Routes>
          <Route path={'/'} element={<Home onData={setCurrentPage} onPrimaryColor={setPrimaryColor}/>}/>
          <Route path={'/spotify'}>
            <Route path={''} element={<Spotify onData={setCurrentPage} onPrimaryColor={setPrimaryColor}/>}/>
            <Route path={'tracks'} element={<Tracks/>}/>
          </Route>
          <Route path={'/youtube'} element={<Youtube onData={setCurrentPage} onPrimaryColor={setPrimaryColor}/>}/>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
