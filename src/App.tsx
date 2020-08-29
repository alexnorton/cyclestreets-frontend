import React from "react";

import Pane from "./components/Pane";
import Map from "./containers/Map";

const App: React.FunctionComponent = () => {
  return (
    <>
      <Pane />
      <Map />
    </>
  );
};

export default App;
