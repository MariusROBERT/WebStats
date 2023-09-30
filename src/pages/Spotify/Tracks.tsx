import React from 'react';
import {clearToken} from './utils';
import {ActionIcon, Center, Flex, SegmentedControl} from '@mantine/core';
import {AlbumDisplay, AlbumInterface} from '../../components/Spotify/AlbumDisplay';
import {IconRefresh} from '@tabler/icons-react';


export function Tracks() {
  const token = localStorage.getItem('spotifyJwt');
  const [timeRange, setTimeRange] = React.useState<string>('0');
  const [albums, setAlbums] = React.useState<AlbumInterface[]>(
    Array.from({length: 50}, () => (
      {name: 'album', artists: [{name: 'artist', url: '/'}], albumImg: 'https://via.placeholder.com/150', id: 'id', albumUrl: '#'}
    ))
  );


  if (!token) {
    clearToken();
  }

  const timeRanges = [
    {label: '4 weeks', value: '0'},
    {label: '6 month', value: '1'},
    {label: 'lifetime', value: '2'}];

  function getTopTracks() {
    setAlbums(
      [{
        name: 'Mac and Devin Go To High School (Music From and Inspired By The Movie)',
        artists: [{name: 'Various Artists', url: 'https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of'}],
        albumImg: 'https://i.scdn.co/image/ab67616d00001e02c303b2aec2d884a775045391',
        albumUrl: 'https://api.spotify.com/v1/albums/0lRlbYQMtETkabg9fNSqAl',
        trackUri: 'spotify:album:0lRlbYQMtETkabg9fNSqAl',
        id: '0lRlbYQMtETkabg9fNSqAl'
      }]
    );
    /*fetch(`http://localhost:3002/spotify/tracks/${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {
      console.log(response);
    });*/
  }

  return (
    <Center>
      <Flex align={'center'} justify={'space-evenly'} direction={'column'} w={'95%'}>
        <Flex align={'center'}>
          <h1>Top Albums</h1>
          <ActionIcon m={'md'} onClick={getTopTracks}>
            <IconRefresh size={'xl'}/>
          </ActionIcon>
        </Flex>
        <div style={{width: '100%'}}>
          <SegmentedControl fullWidth value={timeRange} onChange={setTimeRange} data={timeRanges} size={'md'}/>
        </div>
        <Center>
          <Flex wrap={'wrap'} align={'stretch'} w={'95%'} style={{border: 'solid 0px red'}}>
            {albums && albums.map((album, index) => (
              <AlbumDisplay
                index={index + 1}
                name={album.name}
                id={album.id}
                artists={album.artists}
                albumImg={album.albumImg}
                albumUrl={album.albumUrl}
              />
            ))
            }
          </Flex>
        </Center>
      </Flex>
    </Center>
  );
}