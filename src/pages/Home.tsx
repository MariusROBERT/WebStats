import React from "react";
import {Center, Paper, Text} from "@mantine/core";

export default function Home(props: {
  onData: (str: string) => void;
  onPrimaryColor: (str: string) => void;
}) {

  props.onData("Home");
  props.onPrimaryColor("blue");
  return (
      <Center>
        <Paper p={"sm"}>
          <Center>
            <h1>Welcome</h1>
          </Center>
          <Text>
            Welcome to Webstats, a website that allows you to see your statistics from various websites.
            <br/>
            There's currently only one website available and one planned, but more will be added in the future.
            <br/>
            To get started, click on the wanted website button in the header and follow the instructions.
            <br/>
            The whole code is open-source on <a href={"https://github.com/MariusROBERT/WebStats"}>Github</a>.
            Feel free to contribute!
            <br/><br/>
            Hosted by <a href={"https://vercel.com"}>Vercel</a>.
          </Text>
        </Paper>
      </Center>
  )
}