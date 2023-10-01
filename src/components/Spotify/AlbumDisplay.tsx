import {Anchor, Container, Flex, Image, Indicator, Text} from '@mantine/core';

export interface AlbumInterface {
  name: string;
  artists: { name: string, url: string }[];
  albumImg: string;
  albumUrl: string;
  url: string;
  duration?: number;
  index?: number;
  width?: number;
}

export function AlbumDisplay(props: AlbumInterface) {
  return (
    <Flex direction={'column'} m={'md'} align={'flex-end'} maw={props.width || 150}>
      <Indicator label={props.index} position={'top-start'} size={25} withBorder>
        {/*<Indicator
          label={props.duration ? (Math.floor(props.duration / 60000) + ':' + Math.floor((props.duration / 1000) % 60)) : ''}
          position={'bottom-end'}
          radius={'sm'}
          size={'xs'}
        >*/}
        <Anchor href={props.albumUrl}>
          <Image
            src={props.albumImg}
            alt={props.name}
            w={props.width || 150} h={props.width || 150} radius={5}
          />
        </Anchor>
        {/*</Indicator>*/}
      </Indicator>
      <Container maw={props.width || 150} m={0} p={0}>
        <Anchor href={props.url}>
          <Text mt={5} mr={0} m={0} p={0} size={'md'}
                truncate={'end'} align={'right'}
                title={props.name}
                color={'white'}
          >
            {props.name}
          </Text>
        </Anchor>
        <Text m={0} mr={5} p={0} size={'sm'}
              truncate={'end'} align={'right'}
              title={props.artists.map((artist) => artist.name).join(', ')}
        >
          {props.artists.map((artist, index) => {
            return <>
              <Anchor
                href={artist.url}
              color={'gray'}
              >
                {artist.name}
              </Anchor>
              {(index === props.artists.length - 1) ? '' : ', '}
            </>;
          })
          }
        </Text>
      </Container>
    </Flex>
  );
}