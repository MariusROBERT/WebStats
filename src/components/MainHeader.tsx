import {
  ActionIcon,
  Burger,
  Button,
  createStyles,
  Flex,
  Header,
  rem,
  Tooltip,
  Transition,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconBrandDeezer,
  IconBrandSpotify,
  IconBrandYoutube,
  IconHome2,
  IconMoonStars,
  IconSun
} from '@tabler/icons-react';
import {useDisclosure} from '@mantine/hooks';
import {useLocation} from 'react-router-dom';
import React from 'react';

const HEADER_HEIGHT = rem(100);

const useStyle = createStyles((theme) => ({
  mobile: {
    [theme.fn.largerThan('md')]: {
      display: 'none'
    }
  },

  computer: {
    [theme.fn.smallerThan('md')]: {
      display: 'none'
    }
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
    [theme.fn.largerThan('md')]: {
      display: 'none'
    }
  },

  header: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
  }
}));

interface Props {
  onPrimaryColor: (color: string) => void;
}

export default function MainHeader(props: Props) {
  const menus = [
    {title: 'Home', path: '/', icon: <IconHome2 size={25}/>, working: true},
    {title: 'Youtube', path: '/youtube', icon: <IconBrandYoutube size={25}/>, working: true},
    {title: 'Spotify', path: '/spotify', icon: <IconBrandSpotify size={25}/>, working: true},
    {title: 'Deezer', path: '/deezer', icon: <IconBrandDeezer size={25}/>, working: true},
  ];
  const [opened, {toggle, close}] = useDisclosure(false);
  const [currentPage, setCurrentPage] = React.useState('Home');
  const {classes} = useStyle();
  const {colorScheme, toggleColorScheme} = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const location = useLocation();
  React.useEffect(() => {
    if (location.pathname.includes('youtube')) {
      props.onPrimaryColor('red');
      setCurrentPage('Youtube');
    } else if (location.pathname.includes('spotify')) {
      props.onPrimaryColor('green');
      setCurrentPage('Spotify');
    }else if (location.pathname.includes('deezer')) {
      props.onPrimaryColor('blue');
      setCurrentPage('Deezer');
    } else {
      props.onPrimaryColor('blue');
      setCurrentPage('Home');
    }
  }, [location.pathname, props]);

  const computerButtons = menus.map((menu) => (
    <Tooltip
      label="Coming soon"
      position="bottom"
      withArrow
      disabled={menu.working}
      key={menu.title}
    >
      <Button
        leftIcon={menu.icon}
        component={'a'}
        href={menu.working ? menu.path : '#'}
        size={'md'}
        variant={menu.working ? (currentPage === menu.title ? 'filled' : 'outline') : 'light'}
      >
        {menu.title}
      </Button>
    </Tooltip>

  ));

  const mobileButtons = menus.map((menu) => (
    <Tooltip
      label="Coming soon"
      position="bottom"
      withArrow
      disabled={menu.working}
      key={menu.title + ' tooltip'}
    >
      <Button
        leftIcon={menu.icon}
        component={'a'}
        href={menu.working ? menu.path : '#'}
        size={'md'}
        key={menu.title}
        variant={menu.working ? (currentPage === menu.title ? 'filled' : 'outline') : 'light'}
        onClick={close}
      >
        {menu.title}
      </Button>
    </Tooltip>
  ));

  const currentPageButton = () => {
    const here = menus.find((menu) => menu.title === currentPage);
    if (here) {
      return (
        <Button
          leftIcon={here.icon}
          component={'a'}
          href={here.working ? here.path : '#'}
          size={'md'}
          key={here.title}
          variant={'filled'}
        >
          {here.title}
        </Button>
      );
    } else {
      return (
        <Button
          component={'a'}
          href={'#'}
          size={'md'}
          key={'error'}
          variant={'filled'}
        >
          Unknown page
        </Button>
      );

    }
  };

  return (
    <Header height={HEADER_HEIGHT} mb={'xl'} style={{position: 'sticky'}} className={classes.header}>
      <Flex
        mih={HEADER_HEIGHT}
        justify={'space-between'}
        align={'center'}
        gap={'xl'}
        mx={'xl'}
        className={classes.mobile}
      >
        {opened ? (
          <>
            <Button disabled={true} size={'md'}>WebStats</Button>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
              pos={'fixed'}
              right={75}
              size={'md'}
            >
              {dark ? <IconSun/> : <IconMoonStars/>}
            </ActionIcon>
          </>
        ) : currentPageButton()}
        <Burger opened={opened} onClick={toggle}/>
      </Flex>
      <Flex
        mih={HEADER_HEIGHT}
        justify={'center'}
        align={'center'}
        gap={'xl'}
        className={classes.computer}
      >
        {computerButtons}
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
          pos={'fixed'}
          right={20}
          size={'md'}
        >
          {dark ? <IconSun/> : <IconMoonStars/>}
        </ActionIcon>
      </Flex>
      <Transition mounted={opened} duration={200} transition="pop-top-right">
        {(styles) => (
          <Flex
            justify={'center'}
            gap={'xl'}
            px={'xl'}
            direction={'column'}
            className={classes.dropdown}
            style={styles}
          >
            {mobileButtons}
          </Flex>
        )}
      </Transition>
    </Header>
  );
}