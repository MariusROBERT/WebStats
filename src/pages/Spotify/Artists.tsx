import React from 'react';
import {clearToken} from './utils';
import {Center, Flex, SegmentedControl, Text} from '@mantine/core';
import {sizeRanges, timeRanges} from '../../components/Spotify/utils';
import {ArtistDisplay} from '../../components/Spotify/ArtistDisplay';
import {MenuChoice} from '../../components/Spotify/MenuChoice';
import {useQuery} from '@tanstack/react-query';

function ArtistsData({size, timeRange, token}: { size: string, timeRange: string, token: string }) {
  const {isLoading, error, data} = useQuery({
    queryKey: ['artists', timeRange],
    queryFn: () => fetch(`http://localhost:3002/spotify/artists/${timeRange}`, {
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
      [...Array(10)].map((_, index) => (
          <ArtistDisplay loading/>
        )
      )
    );
  }

  if (error) {
    console.warn(error);
    return 'An error has occurred: ';
  }

  return (
    data['items'].map((artist: any, index: any) => (
      <ArtistDisplay name={artist.name}
                     img={artist.images[1].url}
                     url={artist.external_urls.spotify}
                     index={index}
                     width={parseInt(size)}
                     key={artist.name + index}
      />
    ))
  );
}

export function Artists() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('short_term');

  const [size, setSize] = React.useState<string>('200');

  if (!token) {
    clearToken();
  }

  return (
    <Center>
      <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
        <Flex align={'center'}>
          <Text size={35} mr={'1ch'}>Top</Text>
          <MenuChoice currentPage={'Artists'}/>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} mx={20} justify={'center'}>
            <ArtistsData size={size} timeRange={timeRange} token={token || ''}/>
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
  );
}