import React from "react";

export default function Home(props: {
  onData: (str: string) => void;
}) {

  props.onData("Home");
  return (
      <div className="App" style={{height: "100vh"}}>
      </div>
  )
}