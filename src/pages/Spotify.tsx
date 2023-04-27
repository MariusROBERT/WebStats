import React from "react";
import MainHeader from "../components/MainHeader";

export default function Spotify(props: {
  onData: (str: string) => void;
}) {
  props.onData("Spotify");
  return (
        <div className="App" style={{height:"100vh"}}>
          <MainHeader currentPage={"Spotify"}/>
        </div>
  )
}