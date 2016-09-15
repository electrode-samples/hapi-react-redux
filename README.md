# hapi-react-redux

## <a name="hapijs-server"></a>Hapijs Server
- Let's use the [hapi-universal-redux](https://github.com/luandro/hapi-universal-redux) repo to scaffold our app. 
- Create a hapi app using the following commands: 

```bash
git clone https://github.com/luandro/hapi-universal-redux.git hapiApp
cd hapiApp
npm install
```

- Run using the following:

```bash
NODE_ENV=development npm run build
NODE_ENV=development npm start
```

---

## Electrode React SSR Caching

[electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching) module supports profiling React Server Side Rendering time and component caching to help you speed up SSR.

It supports 2 types of caching:

* Simple - Component Props become the cache key. This is useful for cases like Header and Footer where the number of variations of props data is minimal which will make sure the cache size stays small.
* Template - Components Props are first tokenized and then the generated template html is cached. The idea is akin to generating logic-less handlebars template from your React components and then use string replace to process the template with different props. This is useful for cases like displaying Product information in a Carousel where you have millions of products in the repository.

To demonstrate functionality,

* Added component `hapiApp/src/components/SSRCachingSimpleType.jsx` to demostrate Simple strategy. 

```js
import React from "react";
import { connect } from "react-redux";

class SSRCachingSimpleTypeWrapper extends React.Component {
  render() {
    const count = this.props.count;

    var elements = [];

    for(var i = 0; i < count; i++) {
      elements.push(<SSRCachingSimpleType navEntry={"NavEntry" + i}/>);
    }

    return (
      <div>
        {elements}
      </div>
    );
  }
}

class SSRCachingSimpleType extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.navEntry}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  count: state.count
})

export default connect(
  mapStateToProps
)(SSRCachingSimpleTypeWrapper);
```

* Added component `hapiApp/src/components/SSRCachingTemplateType.jsx` to demostrate Template strategy. 

```js
import React from "react";
import { connect } from "react-redux";

class SSRCachingTemplateTypeWrapper extends React.Component {
  render() {
    const count = this.props.count;
    var elements = [];

    for(var i = 0; i < count; i++) {
      elements.push(<SSRCachingTemplateType name={"name"+i} title={"title"+i} rating={"rating"+i}/>);
    }

    return (
      <div>
        { elements }
      </div>
    );
  }
}

class SSRCachingTemplateType extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.name} and {this.props.title} and {this.props.rating}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  count: state.count
})

export default connect(
  mapStateToProps
)(SSRCachingTemplateTypeWrapper);
```

* Add the following to `src/server.js`:

```
const SSRCaching = require("electrode-react-ssr-caching");

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

* Add the following to `src/routes.js`: 

```javascript
import SSRCachingTemplateType from "./components/SSRCachingTemplateType";
import SSRCachingSimpleType from "./components/SSRCachingSimpleType";

<Route path="/">
  
  <Route path="/ssrcachingtemplatetype" component={SSRCachingTemplateType} />
  <Route path="/ssrcachingsimpletype" component={SSRCachingSimpleType} />

</Route>
```

* To read more, go to [electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)

---

## <a name="redux-router-engine"></a>Electrode Redux Router Engine ##
- [Redux Router Engine](https://github.com/electrode-io/electrode-redux-router-engine) handles async data for React Server Side Rendering using [react-router], Redux, and the [Redux Server Rendering] pattern.

### Install

```
npm install --save electrode-redux-router-engine
```

### Usage

