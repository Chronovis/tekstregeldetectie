import React from "react";
import {Router, Route, browserHistory} from "react-router";

import store from "./store";
import App from "./components/app";
import actionHandlers from "./actions";

let createElement = function(Component, props) {
  window.PROPS = {
    ...props, ...store.getState(), ...actionHandlers
  };
  return React.createElement(Component, {
    ...props, ...store.getState(), ...actionHandlers
  });
};

export default (
  <Router
    createElement={createElement}
    history={browserHistory}>
    <Route
      component={App}
      name="app"
      path="/">
    </Route>
  </Router>
);
