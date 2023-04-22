import {Button, Flex, Header} from "@mantine/core";
import {IconBrandSpotify, IconBrandYoutube, IconHome2} from "@tabler/icons-react";

// interface MainHeaderProps {
//   menus: { title: string, path: string, icon: string }[];
// }
// export default function MainHeader({menus}: MainHeaderProps) {
export default function MainHeader() {
  const menus = [
    {title: "Home", path: "/", icon: <IconHome2 size={15}/>},
    {title: "Spotify", path: "/spotify", icon: <IconBrandSpotify size={15} />},
    {title: "Youtube", path: "/youtube", icon: <IconBrandYoutube size={15} />},
  ]

  const buttons = menus.map((menu) => (
      <Button
          leftIcon={menu.icon}
          component={"a"}
          href={menu.path}>
        {menu.title}
      </Button>
  ));

  return (
      <Header height={60}>
        <Flex
            mih={60}
            justify={"center"}
            align={"center"}
            gap={"md"}
        >
          {buttons}
        </Flex>
      </Header>
  );
}