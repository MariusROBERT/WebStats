import {Button, Center, Flex, SegmentedControl, Text, useMantineTheme} from '@mantine/core';
import React, {useEffect} from 'react';
import SpotifyLogo from '../../assets/Spotify_Logo_RGB_White.png';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {ArtistDisplay} from '../../components/Spotify/ArtistDisplay';
import {MenuChoice} from '../../components/Spotify/MenuChoice';
import {sizeRanges, timeRanges} from '../../components/Spotify/utils';
import {AlbumDisplay} from '../../components/Spotify/AlbumDisplay';

export default function Spotify() {
  const newToken = new URLSearchParams(window.location.search).get('jwt');
  if (newToken) {
    localStorage.setItem('spotifyJwt', newToken);
  }
  const [jwt, setJwt] = React.useState(localStorage.getItem('spotifyJwt'));
  const [timeRange, setTimeRange] = React.useState<string>('short_term');
  const [size, setSize] = React.useState<string>('200');
  const [currentPage, setCurrentPage] = React.useState<string>(localStorage.getItem('spotifyPage') || 'Artists');

  const theme = useMantineTheme();

  useEffect(() => {
    localStorage.setItem('spotifyPage', currentPage);
  }, [currentPage]);

  if (!jwt)
    return (
      <Flex style={{display: jwt ? 'block' : 'hidden'}} align={'center'} justify={'space-around'}>
        <Button fz={'xl'} size={'xl'}
                component={'a'}
                href={'http://paco.pening.fr:6930/spotify/login'}
                rightIcon={<img width={100} src={SpotifyLogo} alt="Spotify logo"/>}>
          Login in with
        </Button>
      </Flex>
    );

  return (
    <Flex justify={'space-evenly'} align={'center'} m={theme.fn.smallerThan('md') ? 0 : 50} direction={'row'}
          wrap={'wrap'}>
      <Center>
        <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
          <Flex align={'center'}>
            <Text size={35} mr={'1ch'}>Top</Text>
            <MenuChoice currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </Flex>
          <div style={{width: '100%'}}>
            <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
          </div>
          <Center>
            <Flex wrap={'wrap'} align={'stretch'} mx={theme.fn.smallerThan('md') ? 0 : 20} justify={'center'}>
              {currentPage === 'Artists' ?
                <Artists size={size} timeRange={timeRange} token={jwt || ''} setJwt={setJwt}/>
                : currentPage === 'Tracks' ?
                  <Tracks size={size} timeRange={timeRange} token={jwt || ''} setJwt={setJwt}/>
                  : <h1>Unknow value</h1>}
            </Flex>
          </Center>
        </Flex>
        <SegmentedControl pos={'fixed'}
                          left={0}
                          top={'50%'}
                          style={{transform: 'translateY(-50%)'}}
                          orientation={'vertical'}
                          value={size}
                          onChange={setSize}
                          data={sizeRanges}
        />
      </Center>
    </Flex>
  );
}

interface Props {
  size: string,
  timeRange: string,
  token: string,
  setJwt: (jwt: string | null) => void
}

function Artists({size, timeRange, token, setJwt}: Props) {
  const queryClient = useQueryClient();

  const {isLoading, data} = useQuery({
    queryKey: ['artists', timeRange],
    queryFn: () => fetch(`http://paco.pening.fr:6930/spotify/artists/${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => r.json()),
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (isLoading) {
    return (
      [...Array(10)].map((_, index) => <ArtistDisplay loading key={index} width={parseInt(size)}/>
      )
    );
  }

  if (data.message)
    return unauthorized(data, setJwt, timeRange, queryClient, 'artists');

  return (
    data['items'].map((artist: any, index: any) => (
      <ArtistDisplay name={artist.name}
                     img={artist.images[1].url}
                     url={artist.external_urls.spotify}
                     index={index}
                     width={parseInt(size)}
                     key={artist.name + index}
                     genres={artist.genres}
      />
    ))
  );
}

function Tracks({size, timeRange, token, setJwt}: Props) {
  const queryClient = useQueryClient();
  const {isLoading, data} = useQuery({
    queryKey: ['tracks', timeRange],
    queryFn: () => fetch(`http://paco.pening.fr:6930/spotify/tracks/${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => r.json()),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24 * 7,
  });

  if (isLoading) {
    return (
      [...Array(10)].map((_, index) => <AlbumDisplay loading key={index} width={parseInt(size)}/>
      )
    );
  }

  if (data.message)
    return unauthorized(data, setJwt, timeRange, queryClient, 'tracks');


  return (
    data['items'].map((track: any, index: any) => (
      <AlbumDisplay
        index={index + 1}
        name={track.name}
        artists={track.artists}
        albumImg={track.album.images[1].url}
        albumUrl={track.album.external_urls.spotify}
        url={track.external_urls.spotify}
        duration={track.duration_ms}
        width={parseInt(size)}
        key={track.name + index}
      />
    ))
  );
}

function unauthorized(data: any, setJwt: (jwt: string | null) => void, timeRange: string, queryClient: any, page: string) {
  console.error(data);

  if (data.statusCode === 401) {
    localStorage.removeItem('spotifyJwt');
    setJwt(null);
  }

  return (
    <Flex w={'85vw'} m={'xl'} direction={'column'} align={'center'}>
      <Text fz={'3em'} color={'red'}>{data.message}</Text>
      <Button onClick={() => queryClient.invalidateQueries({queryKey: [page, timeRange]})}>Refresh</Button>
    </Flex>
  );
}