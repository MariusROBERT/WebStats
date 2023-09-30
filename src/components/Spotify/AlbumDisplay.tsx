import {Anchor, Container, Flex, Image, Indicator, Text} from '@mantine/core';

export interface AlbumInterface {
  name: string;
  artists: { name: string, url: string }[];
  albumImg: string;
  albumUrl: string;
  url: string;
  duration?: number;
  index?: number;
}

export function AlbumDisplay(props: AlbumInterface) {
  return (
    <Flex direction={'column'} m={'md'} align={'flex-end'} maw={150} mah={250}>
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
            w={150} h={150} radius={5}
          />
        </Anchor>
        {/*</Indicator>*/}
      </Indicator>
      <Container maw={150} mah={250} m={0} p={0}>
        <Anchor href={props.url}>
          <Text mt={5} mr={0} m={0} p={0} size={'md'}
                truncate={'end'} align={'right'}
                title={props.name}
          >
            {props.name}
          </Text>
        </Anchor>
        <Text m={0} mr={5} p={0} size={'sm'}
              truncate={'end'} align={'right'}>
          {props.artists.map((artist, index) => {
            return <>
              {(index && index === props.artists.length - 1) ? ', ' : ''}
              <Anchor
                href={artist.url}
              >
                {artist.name}
              </Anchor>
            </>;
          })
          }
        </Text>
      </Container>
    </Flex>
  );
}