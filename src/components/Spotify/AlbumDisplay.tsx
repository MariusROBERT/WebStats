import {Container, Flex, Image, Indicator, Text} from '@mantine/core';

export interface AlbumInterface {
  name: string;
  artists: { name: string, url: string }[];
  albumImg: string;
  albumUrl: string;
  trackUri?: string;
  id: string;
  index?: number;
}

export function AlbumDisplay(props: AlbumInterface) {
  return (
    <Flex id={props.id} direction={'column'} m={'md'} align={'flex-end'} maw={150} mah={250}>
      <Indicator label={props.index} position={'top-start'} size={25} withBorder>
        <a href={props.albumUrl}>
          <Image
            src={props.albumImg}
            alt={props.name}
            w={150} h={150} radius={5}
          />
        </a>
      </Indicator>
      <Container maw={150} mah={250} m={0} p={0}>
        <Text mt={5} mr={0} m={0} p={0} size={'md'}
              truncate={'end'} align={'right'}
              title={props.name}
        >
          {props.name}
        </Text>
        <Text m={0} mr={5} p={0} size={'sm'}
              truncate={'end'} align={'right'}>
          {props.artists.map((artist, index) => {
            return (index ?  ', ' : '') + artist.name;
          })
          }
        </Text>
      </Container>
    </Flex>
  );
}