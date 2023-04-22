import React from "react";
import MainHeader from "../components/MainHeader";
import {Center, MantineProvider, Text} from "@mantine/core";
import {Dropzone} from "@mantine/dropzone";
import {IconPhoto} from "@tabler/icons-react";
import {useMantineTheme} from "@mantine/core";

export default function Youtube() {
  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: "red"
          }}
      >
        <div className="App" style={{height: "100vh", backgroundColor: useMantineTheme().colors.dark[4]}}>
          <MainHeader/>
          <Center>
            <Dropzone
                onDrop={(file) => console.log(file)}
                style={{width: 600}}
                radius={"lg"}
            >
              <Dropzone.Idle>
                <IconPhoto size="3.2rem" stroke={1.5} color={useMantineTheme().colors.dark[1]}/>
              </Dropzone.Idle>
              <div>
                <Text mt={"sm"} size="xl" fw={500} inline color={useMantineTheme().colors.dark[1]}>
                  Drag your history.json file here or click to select it
                </Text>
              </div>
            </Dropzone>
          </Center>
        </div>
      </MantineProvider>
  )
}