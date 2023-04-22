import React from "react";
import MainHeader from "../components/MainHeader";
import {MantineProvider} from "@mantine/core";

export default function Youtube() {
  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: "red"
          }}
      >
        <div className="App" style={{height:"100vh"}}>
          <MainHeader/>
        </div>
      </MantineProvider>
  )
}