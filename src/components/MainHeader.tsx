import {Button, Flex, Header, Tooltip} from "@mantine/core";
import {IconBrandSpotify, IconBrandYoutube, IconHome2} from "@tabler/icons-react";

export default function MainHeader(props: any) {
  const menus = [
    {title: "Home", path: "/", icon: <IconHome2 size={15}/>, working: true},
    {title: "Spotify", path: "/spotify", icon: <IconBrandSpotify size={15}/>, working: false},
    {title: "Youtube", path: "/youtube", icon: <IconBrandYoutube size={15}/>, working: true},
  ]

  const buttons = menus.map((menu) => (
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

  const height = 100;

  return (
      <Header height={height} mb={"xl"}>
        <Flex
            mih={height}
            justify={"center"}
            align={"center"}
            gap={"xl"}
        >
          {buttons}
        </Flex>
      </Header>
  );
}