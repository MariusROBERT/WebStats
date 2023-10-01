import {Button, Flex} from '@mantine/core';
import React from 'react';
import SpotifyLogo from '../../assets/Spotify_Logo_RGB_White.png';
import {IconMicrophone2, IconMusic} from '@tabler/icons-react';

export default function Spotify() {
  const newToken = new URLSearchParams(window.location.search).get('jwt');
  if (newToken) {
    localStorage.setItem('spotifyJwt', newToken);
  }
  const jwt = localStorage.getItem('spotifyJwt');

  if (!jwt)
    return (
      <Flex style={{display: jwt ? 'block' : 'hidden'}} align={'center'} justify={'space-around'}>
        <Button fz={'xl'} size={'xl'}
                component={'a'}
                href={'http://localhost:3002/spotify/login'}
                rightIcon={<img width={100} src={SpotifyLogo} alt="Spotify logo"/>}>
          Login in with
        </Button>
      </Flex>
    );

  const options: { icon: JSX.Element, link: string }[] = [
    {
      icon: <><IconMusic size={100}/>Top Tracks</>,
      link: '/spotify/tracks'
    },
    {
      icon: <><IconMicrophone2 size={100}/>Top Artists</>,
      link: '/spotify/artists'
    },
  ];

  return (
    <Flex justify={'space-evenly'} align={'center'} m={50} direction={'row'} wrap={'wrap'}>
      {options.map((option) => (

        <Button style={{height: 300, width: 300}} m={50} variant={'light'} size={'lg'} component={'a'}
                href={option.link}>
          <Flex direction={'column'} align={'center'}>
            {option.icon}
          </Flex>
        </Button>
      ))}
    </Flex>
  );
}