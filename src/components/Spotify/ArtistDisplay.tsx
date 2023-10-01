import {Anchor, Card, Container, Divider, Image, Text} from '@mantine/core';
import React from 'react';

export interface ArtistInterface {
  name: string;
  url: string;
  img: string;
  index?: number;
  width?: number;
}

export function ArtistDisplay(props: ArtistInterface) {
  const size = props.width || 200;

  return (
    <Card shadow={'xl'} radius={'md'} withBorder m={'md'} w={size + 2} pb={2} my={'xs'}>
      <Card.Section>
        <Anchor href={props.url}>
          <Image radius={'sm'} src={props.img} width={size} height={size} fit={'cover'}/>
        </Anchor>
      </Card.Section>
      <Divider my={5}/>
      <Container maw={size} m={0} p={0}>
        <Anchor href={props.url}>
          <Text m={0} p={0} size={size >= 200 ? 'xl' : 'xs'}
                truncate={'end'} align={'right'}
                title={props.name}
                color={'white'}

          >
            {props.name}
          </Text>
        </Anchor>
      </Container>
    </Card>
  );
}