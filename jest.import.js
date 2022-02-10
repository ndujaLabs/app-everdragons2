import React from "react";
import ReactDOM from "react-dom";
import ReactRouterDOM from "react-router-dom";
// import ReactBootstrap from "react-bootstrap";

global.React = React;
global.ReactDOM = ReactDOM;
global.ReactRouterDOM = ReactRouterDOM;
// global.ReactBootstrap = ReactBootstrap;

global.externalLibrary = {
  logError: (err) => {
    console.error(err);
  },
};
