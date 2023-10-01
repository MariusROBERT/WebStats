import React, {useEffect} from 'react';
import {clearToken} from './utils';
import {ActionIcon, Center, Flex, Notification, SegmentedControl, Transition, Text} from '@mantine/core';
import {AlbumDisplay} from '../../components/Spotify/AlbumDisplay';
import {IconRefresh, IconX} from '@tabler/icons-react';
import {sizeRanges, timeRanges, TotalTracksInterface} from '../../components/Spotify/utils';
import {MenuChoice} from '../../components/Spotify/MenuChoice';

export function Tracks() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('short_term');
  const [tracks, setTracks] = React.useState<TotalTracksInterface>({short_term: [], medium_term: [], long_term: []});
  const [size, setSize] = React.useState<string>('200');
  const [error, setError] = React.useState<string>('');

  if (!token) {
    clearToken();
  }

  useEffect(() => {
    getTopTracks().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  async function getTopTracks(force: boolean = false) {
    // @ts-ignore-next-line
    if (!force && tracks[timeRange].length > 0)
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
          <Text size={35} mr={'1ch'}>Top</Text>
          <MenuChoice currentPage={'Tracks'}/>
          <ActionIcon m={'md'} onClick={() => getTopTracks(true)}>
            <IconRefresh size={'xl'}/>
          </ActionIcon>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} mr={20} ml={30} justify={'center'} >
            {/*@ts-ignore TS7053*/}
            {tracks[timeRange] && tracks[timeRange].map((track, index) => (
              <AlbumDisplay
                index={index + 1}
                name={track.name}
                artists={track.artists}
                albumImg={track.album.images[1].url}
                albumUrl={track.album.url}
                url={track.url}
                duration={track.duration_ms}
                width={parseInt(size)}
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