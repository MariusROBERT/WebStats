import React, {useEffect} from 'react';
import {clearToken} from './utils';
import {ActionIcon, Center, Flex, SegmentedControl} from '@mantine/core';
import {AlbumDisplay} from '../../components/Spotify/AlbumDisplay';
import {IconRefresh} from '@tabler/icons-react';

interface TrackInterface {
  album: {
    url: string,
    images: {
      height: number,
      url: string,
      width: number
    }[],
  },
  artists: {
    url: string,
    name: string,
  }[],
  name: string,
  duration_ms: number,
  url: string,
}

interface TotalTracksInterface {
  short_term: TrackInterface[],
  medium_term: TrackInterface[],
  long_term: TrackInterface[],
}

export function Tracks() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('short_term');
  const [tracks, setTracks] = React.useState<TotalTracksInterface>({short_term: [], medium_term: [], long_term: []});

  if (!token) {
    clearToken();
  }

  const timeRanges = [
    {label: '4 weeks', value: 'short_term'},
    {label: '6 month', value: 'medium_term'},
    {label: 'lifetime', value: 'long_term'}];

  useEffect(() => {
    getTopTracks().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  async function getTopTracks(force: boolean = false) {
    // @ts-ignore-next-line
    if (!force && tracks[timeRange].length > 0)
      return

    const response = (await fetch(`http://localhost:3002/spotify/tracks/${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => r.json()));

    if (response.message) {
      console.warn(response);
      if (response.message === 'Unauthorized') {
        clearToken();
      }
      return;
    }

    setTracks((prevState) => {
      return {
        ...prevState,
        [timeRange]:
          response['items'].map((track: any) => {
            return {
              album: {
                url: track.album.external_urls.spotify,
                images: track.album.images,
              },
              artists: track.artists.map((artist: any) => {
                return {
                  url: artist.external_urls.spotify,
                  name: artist.name,
                };
              }),
              name: track.name,
              duration_ms: track.duration_ms,
              url: track.external_urls.spotify,
            };
          })
      };
    });
  }

  // @ts-ignore
  return (
    <Center>
      <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
        <Flex align={'center'}>
          <h1>Top Tracks</h1>
          <ActionIcon m={'md'} onClick={() => getTopTracks(true)}>
            <IconRefresh size={'xl'}/>
          </ActionIcon>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} w={'95%'} style={{border: 'solid 0px red'}}>
            {/*@ts-ignore TS7053*/}
            {tracks[timeRange] && tracks[timeRange].map((track, index) => (
              <AlbumDisplay
                index={index + 1}
                name={track.name}
                artists={track.artists}
                albumImg={track.album.images[0].url}
                albumUrl={track.album.url}
                url={track.url}
                duration={track.duration_ms}
              />
            ))
            }
          </Flex>
        </Center>
      </Flex>
    </Center>
  );
}