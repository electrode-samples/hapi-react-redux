# hapi-react-redux

This repo is a sample Hapijs app with the following Electrode modules:
  - [Electrode React SSR Caching](https://github.com/electrode-io/electrode-react-ssr-caching) 
  - [Electrode Redux Router Engine](https://github.com/electrode-io/electrode-redux-router-engine)
  - [Electrode Above the Fold Server Rendering](https://github.com/electrode-io/above-the-fold-only-server-render)

## Install

```bash
git clone https://github.com/docs-code-examples-electrode-io/hapi-react-redux.git
npm install 
```

## Run
- Start the hapi app in `development` environment:

```bash
NODE_ENV=development npm run build
NODE_ENV=development npm run start
```

- Start the hapi app in `production` environment:

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm run start
```

## Instructions
- You can build the app from scratch by following the instructions below:
  - [Hapijs Server](#hapijs-server)
  - [Electrode React SSR Caching](#ssr-caching)
  - [Electrode Redux Router Engine](#redux-router-engine)
  - [Above the Fold Server Rendering](#above-the-fold)

---

## <a name="hapijs-server"></a>Hapijs Server
- Let's use the [hapi-universal-redux](https://github.com/luandro/hapi-universal-redux) repo to scaffold our app. 
- Create a hapi app using the following commands: 

```bash
git clone https://github.com/luandro/hapi-universal-redux.git hapiApp
cd hapiApp
npm install
```

- Run using the following:

- Start the hapi app in `development` environment:

```bash
NODE_ENV=development npm run build
NODE_ENV=development npm start
```

- Start the hapi app in `production` environment:

```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```
---

## <a name="ssr-caching"></a>Electrode React SSR Caching

[electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching) module supports profiling React Server Side Rendering time and component caching to help you speed up SSR.

It supports 2 types of caching:

* Simple - Component Props become the cache key. This is useful for cases like Header and Footer where the number of variations of props data is minimal which will make sure the cache size stays small.
* Template - Components Props are first tokenized and then the generated template html is cached. The idea is akin to generating logic-less handlebars template from your React components and then use string replace to process the template with different props. This is useful for cases like displaying Product information in a Carousel where you have millions of products in the repository.

### Install
```bash
$ npm install --save electrode-react-ssr-caching
```

### Wiring

####GOTCHA:

- SSR caching of components only works in PRODUCTION mode, since the props(which are read only) are mutated for caching purposes and mutating of props is not allowed in development mode by react.

- Make sure the `electrode-react-ssr-caching` module is imported first followed by the imports of react and react-dom module. SSR caching will not work if the ordering is changed since caching module has to have a chance to patch react's code first. Also if you are importing `electrode-react-ssr-caching`, `react`  and `react-dom` in the same file , make sure you are using all `require` or all `import`. Found that SSR caching was NOT working if, `electrode-react-ssr-caching` is `require`d first and then `react` and `react-dom` is imported.

---

To demonstrate functionality, we have added:

* `src/components/SSRCachingSimpleType.js` for Simple strategy. 
* `src/components/SSRCachingTemplateType.jsx` for Template strategy. 
* To enable caching using `electrode-react-ssr-caching`, we need to do the below configuration in `src/server.js`.

```js

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
```

* To read more, go to [electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)

---

## <a name="redux-router-engine"></a>Electrode Redux Router Engine ##
* [Redux Router Engine](https://github.com/electrode-io/electrode-redux-router-engine) handles async data for React Server Side Rendering using [react-router], Redux, and the [Redux Server Rendering] pattern.

### Install

```
npm install --save electrode-redux-router-engine
```

### Usage
* Setting up the redux store and redux router engine in `src/server.js`: 

```js
import { createStore } from "redux";
import ReduxRouterEngine from 'electrode-redux-router-engine';

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
```

* `engine.render` gives a `Promise` whose eventual value contains the rendered `HTML` for the matched component. It is done in `src/server.js`.

```js
engine.render(req)
    .then( (result) => {
      // send full HTML with result back using res
    });
```

---

## <a name="above-the-fold"></a>Above the Fold Server Rendering
[Above the Fold Server Rendering](https://github.com/electrode-io/above-the-fold-only-server-render) is a React component for optionally skipping server side rendering of components outside above-the-fold (or outside of the viewport). This component helps render your components on the server that are above the fold and the remaining components on the client.

[Above-the-fold-only-server-render](https://github.com/electrode-io/above-the-fold-only-server-render) helps increase performance both by decreasing the load on renderToString and sending the end user a smaller amount of markup.

By default, the [above-the-fold-only-server-render](https://github.com/electrode-io/above-the-fold-only-server-render) component is an exercise in simplicity; it does nothing and only returns the child component.

### Install
- Add the `above-the-fold-only-server-render` component:

```bash
npm install above-the-fold-only-server-render --save
```

### Usage
* Add the component `src/components/above-the-fold.js`: 

```jsx
import React from "react";
import {AboveTheFoldOnlyServerRender} from "above-the-fold-only-server-render";

export default class AboveFold extends React.Component {

  render() {
    return (
      <AboveTheFoldOnlyServerRender skip={true}>
        <div className="renderMessage" style={{color: "blue"}}>
          <h3>Above-the-fold-only-server-render: Increase Your Performance</h3>
          <p>This will skip server rendering if the 'AboveTheFoldOnlyServerRender'
            lines are present, or uncommented out.</p>
          <p>This will be rendered on the server and visible if the 'AboveTheFoldOnlyServerRender'
            lines are commented out.</p>
          <p>Try manually toggling this component to see it in action</p>
          <p>
            <a href="https://github.com/electrode-io/above-the-fold-only-server-render"
              target="_blank">Read more about this module and see our live demo
            </a>
          </p>
        </div>
      </AboveTheFoldOnlyServerRender>
    );
  }
}
```

* Add the component to the route `src/routes.js`:

```jsx
import AboveFold from "./components/above-the-fold";

<Route component={Header}>
  <Route path="/above-the-fold" component={AboveFold} />
</Route>
``` 

* Following the instructions on how to manipulate the skip prop by directly commenting and uncommenting the `above-the-fold-only-server-render` [component](https://github.com/electrode-io/above-the-fold-only-server-render).

---
