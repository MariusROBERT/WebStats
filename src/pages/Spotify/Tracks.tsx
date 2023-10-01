import React, {useEffect} from 'react';
import {clearToken} from './utils';
import {Center, Flex, Notification, SegmentedControl, Text, Transition} from '@mantine/core';
import {AlbumDisplay} from '../../components/Spotify/AlbumDisplay';
import {IconX} from '@tabler/icons-react';
import {sizeRanges, timeRanges, TotalTracksInterface} from '../../components/Spotify/utils';
import {MenuChoice} from '../../components/Spotify/MenuChoice';

export function Tracks() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('short_term');
  const [tracks, setTracks] = React.useState<TotalTracksInterface>(
    JSON.parse(sessionStorage.getItem('tracks') ||
      JSON.stringify({short_term: [], medium_term: [], long_term: []}))
  );

  const [size, setSize] = React.useState<string>('200');
  const [error, setError] = React.useState<string>();

  if (!token) {
    clearToken();
  }

  useEffect(() => {
    if (timeRange) {
      getTopTracks().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  useEffect(() => {
    if (tracks['short_term'].length > 0 || tracks['medium_term'].length > 0 || tracks['long_term'].length > 0)
      sessionStorage.setItem('tracks', JSON.stringify(tracks));
  }, [tracks]);

  async function getTopTracks() {
    // @ts-ignore-next-line
    if (tracks[timeRange].length > 0 || !token)
      return;
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
      setError(response.message);
      return;
    }

    setTracks((prevState) => {
      return {
        ...prevState,
        [timeRange || 'short_term']:
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

  return (
    <Center>
      <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
        <Flex align={'center'}>
          <Text size={35} mr={'1ch'}>Top</Text>
          <MenuChoice currentPage={'Tracks'}/>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} mr={20} ml={30} justify={'center'}>
            {/*@ts-ignore*/}
            {tracks[timeRange] && tracks[timeRange].map((track, index) => (
              <AlbumDisplay
                index={index + 1}
                name={track.name}
                artists={track.artists}
                albumImg={track.album?.images[1].url}
                albumUrl={track.album?.url}
                url={track.url}
                duration={track.duration_ms}
                width={parseInt(size)}
                key={track.name + index}
              />
            ))
            }
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
      <Transition mounted={!!error} transition={'slide-left'}>
        {(style) =>
          <Notification
            pos={'fixed'}
            top={110}
            right={10}
            withBorder
            withCloseButton={false}
            icon={<IconX/>}
            color={'red'}
            style={style}
          >
            {error}
          </Notification>
        }
      </Transition>
    </Center>
  );
}