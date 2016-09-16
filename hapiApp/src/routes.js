import React from 'react';
import { Router, Route } from 'react-router';
//import Header from './components/Header';
import SSRCachingTemplateType from "./components/SSRCachingTemplateType";
import SSRCachingSimpleType from "./components/SSRCachingSimpleType";

/**
 * The React Routes for both the server and the client.
 */
module.exports = (
	<Router>
			<Route>
					<Route path="/ssrcachingtemplatetype" component={SSRCachingTemplateType} />
					<Route path="/ssrcachingsimpletype" component={SSRCachingSimpleType} />
		</Route>
	</Router>
);
