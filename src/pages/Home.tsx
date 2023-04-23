import React from "react";
import MainHeader from "../components/MainHeader";
import {MantineProvider} from "@mantine/core";

export default function Home() {
  return (
      <MantineProvider
          theme={{
            colorScheme: "dark",
            primaryColor: "blue"
          }}
      >
        <div className="App" style={{height:"100vh"}}>
          <MainHeader currentPage={"Home"}/>
        </div>
      </MantineProvider>
  )
}