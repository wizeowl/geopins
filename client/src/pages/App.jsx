import React from "react";
import Header from '../components/Header';
import Map from '../components/Map';
import withRoot from "../withRoot";

const App = () => {
  return <div>
    <Header/>
    <Map/>
  </div>;
};

export default withRoot(App);
