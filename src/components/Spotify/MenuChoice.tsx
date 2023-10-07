import {Select} from '@mantine/core';
import React, {useEffect} from 'react';

interface Props {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pages: string[];
}

export function MenuChoice(props: Props) {
  const [currentPage, setCurrentPage] = React.useState<string | null>(props.currentPage);

  props.pages.splice(0, 0, props.pages.splice(props.pages.findIndex((page) => page === currentPage), 1)[0]);

  useEffect(() => {
    props.setCurrentPage(currentPage || '');
  }, [currentPage, props]);

  return (
    <Select
      styles={(theme) => ({
        dropdown: {
          transform: `translateY(-55px)`,
        },
        item: {
          padding: `0 ${theme.fontSizes.xs}`,
        }
      })}
      variant={'unstyled'}
      size={'35px'}
      w={200}
      data={props.pages}
      value={currentPage}
      onChange={setCurrentPage}
    />
  );
}