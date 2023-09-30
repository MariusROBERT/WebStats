import React from 'react';
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

export function Tracks() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('0');
  const [tracks, setTracks] = React.useState<TrackInterface[]>([]);

  if (!token) {
    clearToken();
  }

  const timeRanges = [
    {label: '4 weeks', value: '0'},
    {label: '6 month', value: '1'},
    {label: 'lifetime', value: '2'}];

  async function getTopTracks() {
    const response = (await fetch(`http://localhost:3002/spotify/tracks/${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => r.json()));
    if (response.error) {
      console.warn(response.error);
      return;
    }
    setTracks(response['items'].map((track: any) => {
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
    }));
    console.log(tracks);
  }

  return (
    <Center>
      <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
        <Flex align={'center'}>
          <h1>Top Tracks</h1>
          <ActionIcon m={'md'} onClick={getTopTracks}>
            <IconRefresh size={'xl'}/>
          </ActionIcon>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} w={'95%'} style={{border: 'solid 0px red'}}>
            {tracks && tracks.map((track, index) => (
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