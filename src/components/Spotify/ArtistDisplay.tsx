import {
  Anchor,
  Badge,
  Card,
  Container,
  Divider,
  Flex,
  Image,
  ScrollArea,
  Skeleton,
  Text,
  useMantineTheme
} from '@mantine/core';
import React from 'react';

export interface ArtistInterface {
  name?: string;
  url?: string;
  img?: string;
  index?: number;
  width?: number;
  loading?: boolean;
  genres?: string[];
}

export function ArtistDisplay(props: ArtistInterface) {
  const size = props.width || 200;
  const theme = useMantineTheme();

  return (
    <Card shadow={'xl'} radius={'md'} withBorder m={'md'} mx={theme.fn.smallerThan('md') ? 9 : 'md'} w={size + 2}
          pb={2} my={'xs'}>
      <Card.Section>
        <Skeleton visible={props.loading || false}>
          <Anchor href={props.url}>
            <Image radius={'sm'} src={props.img} withPlaceholder width={size} height={size} fit={'cover'}/>
          </Anchor>
        </Skeleton>
      </Card.Section>
      <ScrollArea h={'xl'} type={'never'}>
        <Flex direction={'row'} pt={5}>
          {
            props.genres?.map((genre) => (
              <Badge size={'xs'} mr={5}>{genre}</Badge>
            ))
          }
        </Flex>
      </ScrollArea>
      <Divider my={5}/>
      <Container maw={size} m={0} p={0}>
        <Skeleton visible={props.loading || false}>
          <Anchor href={props.url}>
            <Text m={0} p={0} size={size >= 200 ? 'xl' : 'xs'}
                  truncate={'end'} align={'right'}
                  title={props.name || 'Loading...'}
                  color={theme.colorScheme === 'dark' ? 'white' : 'black'}
            >
              {props.name || 'Loading...'}
            </Text>
          </Anchor>
        </Skeleton>
      </Container>
    </Card>
  );
}