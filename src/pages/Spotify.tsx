import React from "react";

export default function Spotify(props: {
  onData: (str: string) => void;
  onPrimaryColor: (str: string) => void;
}) {
  props.onData("Spotify");
  props.onPrimaryColor("green");

  return (
      <div className="App" style={{height: "100vh"}}>
      </div>
  )
}