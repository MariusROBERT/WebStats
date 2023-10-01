import {Select} from '@mantine/core';
import React, {useEffect} from 'react';

interface Props {
  currentPage: string;
}

export function MenuChoice(props: Props) {
  const [currentPage, setCurrentPage] = React.useState<string | null>(props.currentPage);

  const pages = ['Artists', 'Tracks'];
  pages.splice(0, 0, pages.splice(pages.findIndex((page) => page === currentPage), 1)[0]);

  useEffect(() => {
    if (currentPage && !window.location.pathname.includes(currentPage.toLowerCase()))
      window.location.href = '/spotify/' + currentPage.toLowerCase();
  }, [currentPage]);

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
      data={pages}
      value={currentPage}
      onChange={setCurrentPage}
    />
  );
}