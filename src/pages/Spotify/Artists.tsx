import React, {useEffect} from 'react';
import {clearToken} from './utils';
import {ActionIcon, Center, Flex, Notification, SegmentedControl, Transition, Text} from '@mantine/core';
import {IconRefresh, IconX} from '@tabler/icons-react';
import {sizeRanges, timeRanges, TotalArtistInterface} from '../../components/Spotify/utils';
import {ArtistDisplay} from '../../components/Spotify/ArtistDisplay';
import {MenuChoice} from '../../components/Spotify/MenuChoice';

export function Artists() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('short_term');
  const [artists, setArtists] = React.useState<TotalArtistInterface>({short_term: [], medium_term: [], long_term: []});
  const [size, setSize] = React.useState<string>('200');
  const [error, setError] = React.useState<string>('');

  if (!token) {
    clearToken();
  }

  useEffect(() => {
    getTopArtists().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  async function getTopArtists(force: boolean = false) {
    // @ts-ignore-next-line
    if (!force && artists[timeRange].length > 0)
      return;

    const response = (await fetch(`http://localhost:3002/spotify/artists/${timeRange}`, {
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

    console.log(response['items']);

    setArtists((prevState) => {
      return {
        ...prevState,
        [timeRange]:
          response['items'].map((artist: any) => {
            return {
              name: artist.name,
              images: artist.images,
              url: artist.external_urls.spotify,
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
          <MenuChoice currentPage={'Artists'}/>
          <ActionIcon m={'md'} onClick={() => getTopArtists(true)}>
            <IconRefresh size={'xl'}/>
          </ActionIcon>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} mx={20} justify={'center'}>
            {/*@ts-ignore TS7053*/}
            {artists[timeRange] && artists[timeRange].map((artist, index) => (
              <ArtistDisplay name={artist.name} img={artist.images[1].url} url={artist.url} index={index}
                             width={parseInt(size)}/>
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