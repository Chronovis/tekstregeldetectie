import React from "react";
import ReactDom from "react-dom";

import store from "./store";
import routes from "./routes";

document.addEventListener("DOMContentLoaded", () => {
	const container = document.getElementById("container");

	store.subscribe(() =>
		ReactDom.render(routes, container)
	);

	ReactDom.render(routes, container);
});
