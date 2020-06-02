import React from "react";
import "../Jumbotron/AboutJumbotron.css";

const AboutJumbotron = ({ children }) => (

    <div className="jumbotron jumbotron-fluid about-jumbotron">
        <div className="about-container">
            <h1 className="about-title">How it works</h1>
            <h1 className="about-title">&#9207;</h1>
        </div>
    </div>

);

export default AboutJumbotron;
