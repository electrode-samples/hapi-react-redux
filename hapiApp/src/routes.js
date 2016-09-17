import React from 'react';
import { Router, Route } from 'react-router';
import SSRCachingTemplateType from "./components/SSRCachingTemplateType";
import SSRCachingSimpleType from "./components/SSRCachingSimpleType";
import AboveFold from "./components/above-the-fold";
import Home from "./components/home";

module.exports = (
	<Router>
		<Route>
			<Route path="/" component={Home} />
			<Route path="/above-the-fold" component={AboveFold} />
			<Route path="/ssrcachingtemplatetype" component={SSRCachingTemplateType} />
			<Route path="/ssrcachingsimpletype" component={SSRCachingSimpleType} />
		</Route>
	</Router>
);
