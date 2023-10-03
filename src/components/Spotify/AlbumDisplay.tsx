import {Anchor, Container, Flex, Image, Indicator, Skeleton, Text, useMantineTheme} from '@mantine/core';

export interface AlbumInterface {
  name?: string;
  artists?: { name: string, url: string }[];
  albumImg?: string;
  albumUrl?: string;
  url?: string;
  duration?: number;
  index?: number;
  width?: number;
  loading?: boolean;
}

export function AlbumDisplay(props: AlbumInterface) {
  const theme = useMantineTheme();

  return (
    <Flex direction={'column'} m={'md'} mx={theme.fn.smallerThan('md') ? 10 : 'md'} align={'flex-end'}
          w={props.width || 200}>
      <Skeleton visible={props.loading || false}>
        <Indicator label={props.loading ? undefined : props.index}
                   position={'top-start'}
                   size={props.loading ? 0 : 25}
                   withBorder>
          {/*<Indicator
          label={props.duration ? (Math.floor(props.duration / 60000) + ':' + Math.floor((props.duration / 1000) % 60)) : ''}
          position={'bottom-end'}
          radius={'sm'}
          size={'xs'}
        >*/}
          <Anchor href={props.albumUrl}>
            <Image
              src={props.albumImg}
              withPlaceholder
              alt={props.name}
              w={props.width || 200} h={props.width || 200} radius={5}
            />
          </Anchor>
          {/*</Indicator>*/}
        </Indicator>
        <Container maw={props.width || 200} m={0} p={0}>
          <Anchor href={props.url}>
            <Text mt={5} mr={0} m={0} p={0} size={'md'} w={'100%'}
                  truncate={'end'} align={'right'}
                  title={props.name}
                  color={'white'}
            >
              {props.name}
            </Text>
          </Anchor>
          <Text m={0} mr={5} p={0} size={'sm'}
                truncate={'end'} align={'right'}
                title={props.artists?.map((artist) => artist.name).join(', ') || 'Loading...'}
          >
            {props.artists?.map((artist, index) => {
              return <>
                <Anchor
                  href={artist.url}
                  color={'gray'}
                >
                  {artist.name}
                </Anchor>
                {(index === props.artists?.length ? -1 : 0) ? '' : ', '}
              </>;
            }) || 'Loading...'
            }
          </Text>
        </Container>
      </Skeleton>
    </Flex>
  );
}
