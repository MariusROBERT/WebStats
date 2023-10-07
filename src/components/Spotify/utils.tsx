import {Center} from '@mantine/core';
import {IconPhoto} from '@tabler/icons-react';
import React from 'react';

export const spotifyTimeRanges = [
  {label: '4 weeks', value: 'short_term'},
  {label: '6 month', value: 'medium_term'},
  {label: 'Lifetime', value: 'long_term'}];

export const deezerTimeRanges = [
  {label: '30 days', value: '30d'},
  {label: '6 months', value: '6month'},
  {label: '1 year', value: '1year'},
  {label: 'Month start', value: 'monthstart'},
  {label: 'Year start', value: 'yearstart'},
];

export const sizeRanges = [
  {label: <Center><IconPhoto size={15}/></Center>, value: '100'},
  {label: <Center><IconPhoto size={20}/></Center>, value: '200'},
  {label: <Center><IconPhoto size={30}/></Center>, value: '300'},
];

export interface ArtistInterface {
  name: string,
  images: {
    height: number,
    url: string,
    width: number
  }[],
  url: string,
}

export interface TotalArtistInterface {
  short_term: ArtistInterface[],
  medium_term: ArtistInterface[],
  long_term: ArtistInterface[],
}

export interface TrackInterface {
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

export interface TotalTracksInterface {
  short_term: TrackInterface[],
  medium_term: TrackInterface[],
  long_term: TrackInterface[],
}