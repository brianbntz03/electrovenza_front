import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Components/Header";
import Aside from "./Components/Aside";
import Content from "./Components/Content";
import Footer from "./Components/Footer";

export default function App() {

  return(
    <div>
      <Header/>
      <Router>  
        <Content/>
        <Aside/>
      </Router>
      <Footer/>
    </div>
  )
}