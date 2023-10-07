import React, {useState} from 'react';
import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Spotify from './pages/Spotify/Spotify';
import Youtube from './pages/Youtube';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import MainHeader from './components/MainHeader';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useColorScheme} from '@mantine/hooks';
import Deezer from './pages/Deezer/Deezer';


function App() {
  const [primaryColor, setPrimaryColor] = React.useState('blue');
  const queryClient = new QueryClient();
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{
          colors: {
            'green': ['#e8fdf1', '#d6f9e2', '#acf1c4', '#7ee9a3', '#59e388', '#42df76', '#35dd6d', '#27c45b', '#1bae4f', '#009741'],
          },
          colorScheme,
          primaryColor: primaryColor,
        }}
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
      >
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <MainHeader onPrimaryColor={setPrimaryColor}/> {/*test*/}
            <Routes>
              <Route path={'/'} element={<Home/>}/>
              <Route path={'/spotify'} element={<Spotify/>}/>
              <Route path={'/youtube'} element={<Youtube/>}/>
              <Route path={'/deezer'} element={<Deezer/>}/>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
