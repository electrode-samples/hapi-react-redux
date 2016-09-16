import babelPolyfill from "babel-polyfill";
import { Server } from "hapi";
import h2o2 from "h2o2";
import inert from "inert";
import SSRCaching from "electrode-react-ssr-caching";
import React from "react";
import ReactDOM from "react-dom/server";
import { RouterContext, match } from "react-router";
import configureStore from "./store.js";
import { Provider } from 'react-redux';
import routesContainer from "./routes";
import url from "url";
import { createStore } from "redux";
import ReduxRouterEngine from 'electrode-redux-router-engine';

let routes = routesContainer;

const cacheConfig = {
  components: {
    SSRCachingTemplateType: {
      strategy: "template",
      enable: true
    },
    SSRCachingSimpleType: {
      strategy: "simple",
      enable: true
    }
  }
};

SSRCaching.enableCaching();
SSRCaching.setCachingConfig(cacheConfig);

/**
 * Create Redux store, and get intitial state.
 */
const store = configureStore({count: 100});
const initialState = store.getState();

function createReduxStore(request) {
  let initialState = {count : 100};
  let rootReducer = (s, a) => s;

  return Promise.all([
      Promise.resolve({})
    ]).then(() => {
      return store;
  });
}

const engine = new ReduxRouterEngine({ routes, createReduxStore});

/**
 * Start Hapi server
 */
var envset = {
  production: process.env.NODE_ENV === 'production'
};

const hostname = envset.production ? (process.env.HOSTNAME || process['env'].HOSTNAME) : "localhost";
var port = envset.production ? (process.env.PORT || process['env'].PORT) : 8000
const server = new Server();

server.connection({host: hostname, port: port});

server.register(
	[
		h2o2,
		inert,
		// WebpackPlugin
	],
	(err) => {
	if (err) {
		throw err;
	}

	server.start(() => {
		console.info("==> ✅  Server is listening");
		console.info("==> 🌎  Go to " + server.info.uri.toLowerCase());
	});
});

/**
 * Attempt to serve static requests from the public folder.
 */
server.route({
	method:  "GET",
	path:    "/{params*}",
	handler: {
		file: (request) => "static" + request.path
	}
});

/**
 * Endpoint that proxies all GitHub API requests to https://api.github.com.
 */
server.route({
	method: "GET",
	path: "/api/github/{path*}",
	handler: {
		proxy: {
			passThrough: true,
			mapUri (request, callback) {
				callback(null, url.format({
					protocol: "https",
					host:     "api.github.com",
					pathname: request.params.path,
					query:    request.query
				}));
			},
			onResponse (err, res, request, reply, settings, ttl) {
				reply(res);
			}
		}
	}
});

server.ext("onPreResponse", (request, reply) => {
	if (typeof request.response.statusCode !== "undefined") {
    return reply.continue();
  }

	engine.render(request).then( (result) => { 
		const webserver = __PRODUCTION__ ? "" : `//${hostname}:8080`;
		let output = (
			`<!doctype html>
			<html lang="en-us">
				<head>
					<meta charset="utf-8">
					<title>Hapi Universal Redux</title>
					<link rel="shortcut icon" href="/favicon.ico">
				</head>
				<body>
					<div id="react-root">${result.html}</div>
					<script>
						window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
						window.__UA__ = ${JSON.stringify(request.headers['user-agent'])}
					</script>
					<script src=${webserver}/dist/client.js></script>
					<script>if (window.webappStart) webappStart(); </script>
				</body>
			</html>`
			);

		reply(output);
	});
});

if (__DEV__) {
	if (module.hot) {
		console.log("[HMR] Waiting for server-side updates");

		module.hot.accept("./routes", () => {
			routes = require("./routes");
		});

		module.hot.addStatusHandler((status) => {
			if (status === "abort") {
				setTimeout(() => process.exit(0), 0);
			}
		});
	}
}
