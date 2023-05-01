import React from "react";

export default function Home(props: {
  onData: (str: string) => void;
  onPrimaryColor: (str: string) => void;
}) {

  props.onData("Home");
  props.onPrimaryColor("blue");
  return (
      <div className="App" style={{height: "100vh"}}>
      </div>
  )
}