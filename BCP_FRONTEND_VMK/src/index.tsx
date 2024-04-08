/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import "./index.css";
import App from './App';
import { routes } from "./routes";

const root = document.getElementById('root');

if (root === null) {
	throw new Error('No root element found');
}
render(() => (
	<Router root={App}>
		{routes}
	</Router>
), root);
