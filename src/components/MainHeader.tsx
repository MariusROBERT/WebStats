import {Burger, Button, createStyles, Flex, Header, rem, Tooltip, Transition} from "@mantine/core";
import {IconBrandSpotify, IconBrandYoutube, IconHome2} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

const HEADER_HEIGHT = rem(100);

const useStyle = createStyles((theme) => ({
  mobile: {
    [theme.fn.largerThan("md")]: {
      display: "none"
    }
  },

  computer: {
    [theme.fn.smallerThan("md")]: {
      display: "none"
    }
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
    [theme.fn.largerThan("md")]: {
      display: "none"
    }
  }
}));

export default function MainHeader(props: any) {
  const menus = [
    {title: "Home", path: "/", icon: <IconHome2 size={25}/>, working: true},
    {title: "Youtube", path: "/youtube", icon: <IconBrandYoutube size={25}/>, working: true},
    {title: "Spotify", path: "/spotify", icon: <IconBrandSpotify size={25}/>, working: true},
  ]
  const [opened, {toggle, close}] = useDisclosure(false);
  const {classes} = useStyle();

  const computerButtons = menus.map((menu) => (
      <Tooltip
          label="Coming soon"
          position="bottom"
          withArrow
          disabled={menu.working}
      >
        <Button
            leftIcon={menu.icon}
            component={"a"}
            href={menu.working ? menu.path : "#"}
            size={"md"}
            key={menu.title}
            variant={menu.working ? (props.currentPage === menu.title ? "filled" : "outline") : "light"}
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
          key={menu.title + " tooltip"}
      >
        <Button
            leftIcon={menu.icon}
            component={"a"}
            href={menu.working ? menu.path : "#"}
            size={"md"}
            key={menu.title}
            variant={menu.working ? (props.currentPage === menu.title ? "filled" : "outline") : "light"}
            onClick={close}
        >
          {menu.title}
        </Button>
      </Tooltip>
  ));

  const currentPageButton = () => {
    const currentPage = menus.find((menu) => menu.title === props.currentPage);
    if (currentPage) {
      return (
          <Button
              leftIcon={currentPage.icon}
              component={"a"}
              href={currentPage.working ? currentPage.path : "#"}
              size={"md"}
              key={currentPage.title}
              variant={"filled"}
          >
            {currentPage.title}
          </Button>
      )
    } else {
      return (
          <Button
              component={"a"}
              href={"#"}
              size={"md"}
              key={"error"}
              variant={"filled"}
          >
            Unknown page
          </Button>
      )

    }
  };

  return (
      <Header height={HEADER_HEIGHT} mb={"xl"} style={{position: "sticky"}}>
        <Flex
            mih={HEADER_HEIGHT}
            justify={"space-between"}
            align={"center"}
            gap={"xl"}
            mx={"xl"}
            className={classes.mobile}
        >
          {opened ? <Button disabled={true} size={"md"}>WebStats</Button> : currentPageButton()}
          <Burger opened={opened} onClick={toggle}/>
        </Flex>
        <Flex
            mih={HEADER_HEIGHT}
            justify={"center"}
            align={"center"}
            gap={"xl"}
            className={classes.computer}
        >
          {computerButtons}
        </Flex>
        <Transition mounted={opened} duration={200} transition="pop-top-right">
          {(styles) => (
              <Flex
                  justify={"center"}
                  gap={"xl"}
                  px={"xl"}
                  direction={"column"}
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