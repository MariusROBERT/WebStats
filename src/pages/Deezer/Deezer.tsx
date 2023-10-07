import React from 'react';
import {Button, Center, Flex, SegmentedControl, Text, useMantineTheme} from '@mantine/core';
import {API_URL} from '../../constants';
import DeezerWhite from '../../assets/Deezer_Logo_RVB_MonoWhite.svg';
import {MenuChoice} from '../../components/Spotify/MenuChoice';
import {deezerTimeRanges, sizeRanges} from '../../components/Spotify/utils';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {ArtistDisplay} from '../../components/Spotify/ArtistDisplay';
import {AlbumDisplay} from '../../components/Spotify/AlbumDisplay';

export default function Deezer() {
  const newToken = new URLSearchParams(window.location.search).get('jwt');
  if (newToken) {
    localStorage.setItem('deezerJwt', newToken);
  }
  const [jwt, setJwt] = React.useState(localStorage.getItem('deezerJwt'));
  const theme = useMantineTheme();
  const [currentPage, setCurrentPage] = React.useState<string>(localStorage.getItem('deezerPage') || 'Artists');
  const [timeRange, setTimeRange] = React.useState<string>('30d');
  const [size, setSize] = React.useState<string>('200');

  if (!jwt)
    return (
      <Flex style={{display: jwt ? 'block' : 'hidden'}} align={'center'} justify={'space-around'}>
        <Button fz={'xl'} size={'xl'}
                component={'a'}
                href={API_URL + '/deezer/login'}
                rightIcon={<img width={100} src={DeezerWhite} alt="Spotify logo"/>}>
          Login in with
        </Button>
      </Flex>
    );

  return (
    <Flex justify={'space-evenly'} align={'center'} m={theme.fn.smallerThan('md') ? 0 : 50} direction={'row'}
          wrap={'wrap'} w={'100%'}>
      <Center>
        <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
          <Flex align={'center'}>
            <Text size={35} mr={'1ch'}>Top</Text>
            <MenuChoice currentPage={currentPage} setCurrentPage={setCurrentPage}
                        pages={['Artists', 'Tracks', 'Albums']}/>
          </Flex>
          <div style={{width: '100%'}}>
            <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={deezerTimeRanges} size={'md'}/>
          </div>
          <Center>
            <Flex wrap={'wrap'} align={'stretch'} mx={theme.fn.smallerThan('md') ? 0 : 20} justify={'center'}>
              <Data size={size}
                    timeRange={timeRange}
                    token={jwt || ''}
                    setJwt={setJwt}
                    type={currentPage}
              />
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
  type: string,
}

interface DeezerArtist {
  id: number,
  name: string,
  link: string,
  tracklist: string,
  type: string,
}

interface DeezerAlbum {
  id: number,
  title: string,
  cover_xl: string,
  url: string,
}

interface DeezerTrack {
  id: number,
  title: string,
  link: string,
  duration: number,
  artist: DeezerArtist,
  album: DeezerAlbum
}

function ArtistPlaceHolder({size}: { size: string }) {
  return (<>{[...Array(10)].map((_, index) => <ArtistDisplay loading key={index} width={parseInt(size)}/>)}</>);
}

function AlbumnPlaceHolder({size}: { size: string }) {
  return (<>{[...Array(10)].map((_, index) => <AlbumDisplay loading key={index} width={parseInt(size)}/>)}</>);
}

function Data({size, timeRange, token, setJwt, type}: Props) {
  const queryClient = useQueryClient();

  const {isLoading, data} = useQuery({
    queryKey: ['deezer', timeRange],
    queryFn: () => fetch(API_URL + '/deezer/history/' + timeRange, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => r.json()),
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (isLoading) {
    if (type === 'Artists')
      return (<ArtistPlaceHolder size={size}/>);
    else if (type === 'Tracks' || type === 'Albums')
      return (<AlbumnPlaceHolder size={size}/>);
    else
      return <></>;
  }

  if (data.message) {
    if (data.statusCode === 401) {
      localStorage.removeItem('deezerJwt');
      setJwt(null);
    }

    return (
      <Flex w={'85vw'} m={'xl'} direction={'column'} align={'center'}>
        <Text fz={'3em'} color={'red'}>{data.message}</Text>
        <Button onClick={() => {
          queryClient.invalidateQueries({queryKey: ['deezer', timeRange]});
        }}>Refresh</Button>
      </Flex>
    );
  }

  console.log(data);

  if (type === 'Artists') {
    let artists: { artist: DeezerArtist, count: number }[] = [];
    for (const trackData of data) {
      let artist = artists.find((artist) => artist.artist.id === trackData.artist.id);
      if (artist)
        artist.count++;
      else
        artists.push({artist: trackData.artist, count: 1});
    }
    artists.sort((a, b) => b.count - a.count);
    return (
      <>
        {artists.map(({artist}, index: any) => (
          <ArtistDisplay name={artist.name}
                         url={artist.link}
                         index={index}
                         width={parseInt(size)}
                         key={artist.name + index}
          />
        ))}
      </>
    );
  } else if (type === 'Tracks') {
    let tracks: { track: DeezerTrack, count: number }[] = [];
    for (const trackData of data) {
      let track = tracks.find((track) => track.track.id === trackData.id);
      if (track)
        track.count++;
      else
        tracks.push({track: trackData, count: 1});
    }
    tracks.sort((a, b) => b.count - a.count);
    return (
      <>
        {tracks.map(({track, count}, index: any) => (
          <AlbumDisplay name={track.title}
                        url={track.link}
                        index={count}
                        width={parseInt(size)}
                        key={track.title + index}
                        albumImg={track.album.cover_xl}
                        albumUrl={track.album.url}
                        artists={[{name: track.artist.name, url: track.artist.link}]}
          />
        ))}
      </>
    );
  } else if (type === 'Albums') {
    let albums: { album: DeezerTrack, count: number }[] = [];
    for (const trackData of data) {
      let track = albums.find((album) => album.album.album.id === trackData.album.id);
      if (track)
        track.count++;
      else
        albums.push({album: trackData, count: 1});
    }
    albums.sort((a, b) => b.count - a.count);
    return (
      <>
        {albums.map(({album, count}, index: any) => (
          <AlbumDisplay name={album.title}
                        url={album.link}
                        index={count}
                        width={parseInt(size)}
                        key={album.title + index}
                        albumImg={album.album.cover_xl}
                        albumUrl={album.album.url}
                        artists={[{name: album.artist.name, url: album.artist.link}]}
          />
        ))}
      </>
    );
  }

  return (<>How did you get there ?</>);
}
