<h1 align="center">
  @deriv/dashboard
</h1>

**In this docuemnt**

-   [Other documents](#other-documents)
-   [Pre-installation](#Pre-installation)
-   [Editor helpers](#editor-helpers)
-   [Quick start](#Quick-start)
-   [Differences](#Differences)
    -   [JavaScript](#JavaScript)
    -   [TypeScript](#TypeScript)
-   [Types](#Types)
-   [Types vs Interfaces](#types-vs-interfaces)
-   [Type and Interface prefix](#type-and-interface-prefix)
-   [Gotchas](#gotchas)

## Other documents

-   [General](docs/README.md) - Contains general philosophy and overview of this package
-   [Modules docs](docs/Modules/README.md) - Contains implementation guides (i.e., adding types, use observer, etc.)

## Pre-installation

-   node
-   npm

## Editor helpers

-   Prettier setup in your editor https://prettier.io/
-   Stylelint setup in your editor https://stylelint.io/
-   Eslint setup in your editor https://eslint.org/

## Quick start

1.  **Install your dependencies:**

    ```sh
    npm run bootstrap
    ```

2.  **To build publish file:**

    ```sh
    npm run build:publish dashboard
    ```

3.  **Libary usage:**

    ```JS
        import React from 'react'
        import Dashboard from '@deriv/dashboard';

        const Component = ({client, ServerTIme, ui, WS, config}) => {
            return <Dashboard client={client} server_time={ServerTime} ui={ui} ws={WS} config={config} />;
        }


        Component.propTypes = {
            client: PropTypes.shape({
                is_logged_in: PropTypes.bool.isRequired,
                loginid: PropTypes.string.isRequired,
            }).isRequired,
            config: {
                asset_path: PropTypes.string.isRequired,
                has_router: PropTypes.bool.isRequired,
                routes: PropTypes.shape({
                    home: PropTypes.string.isRequired,
                    about_us: PropTypes.string.isRequired,
                    explore: PropTypes.string.isRequired,
                    resources: PropTypes.string.isRequired,
                }).isRequired,
            },
            ui: PropTypes.shape({
                height_offset: PropTypes.string,
                is_dark_mode_on: PropTypes.bool.isRequired,
                language: PropTypes.string.isRequired,
                components: PropTypes.shape({
                    Page404: any,
                }).isRequired,
            }).isRequired,

    };

    ```

4.  **File Structure**

```
src
    ├── assets/
    │   ├── images/
    ├── components/
    │   ├── ...
    ├── constants/
    │   ├── ...
    ├── stores/
    │   ├── ...
    ├── types/
    │   ├── ...
    ├── index.js

index.js // publish file
webpack.config.js
package.json
```

---

## Differences

Defining components in TypeScript is not very different from doing so in JavaScript, but the first thing you'll notice is that we now no longer have any PropTypes and there are a bunch of new keywords added. Take the example below on how to define a component:

### JavaScript

```JS
const App ({ counter, name }) => {
    return (
        <div>{ name } clicked { counter } times.</div>
    )
}

App.propTypes = {
    counter: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
}
```

### TypeScript

```TS
const App: React.FC<TAppProps> ({ counter, name }) => {
    return (
        <div>{ name } clicked { counter } times.</div>
    )
}

type TAppProps = {
    counter: number;
    name: string;
}
```

As you can see, TypeScript is a lot more explicit and we have to state the type of variable that `App` is (`React.FC` with its contents being in the shape of `TAppProps`). You can compare it to PropTypes, but it's a lot stricter and will throw compilation errors if the shapes don't match.

---

## Types

In most cases types will be defined within the same component, however, when a type should be shared across multiple files, you may put it in the `src/types` folder. In this folder we have 3 named folders:

-   `params.types.ts`: Contains shared types for function parameters
-   `props.types.ts`: Contains shared types for component props
-   `stores.types.ts`: Contains types for the app's stores

In general, try to append any new types to these files before creating a new `*.types.ts` file here.

---

## Types vs Interfaces

With the latest typescript version, functionalities and capabilities of both types and interfaces become more similar. Hence for dashboard project, here are the cases when to use types or interfaces

Do use types to typecheck react proptypes object

```tsx

const About: React.FC<TAbout> = ({ title, description }) => {
    ...
};

type TAbout = {
  title: string;
  description: number;
};
```

Do use types to typecheck a function. Aside from the similar ability, it possesses with the interface, you can use types to type-check the argument and the return type of a function.

```ts
type TStatusShape = {
  countries: string[], // an array of strings
  status: string
};

type TWebsiteStatus = (
  website_status: TStatusShape
) => Person;

const isEu: TWebsiteStatus = (website_status) => {
    ...
    return is_eu;
};
```

--TODO add cases when to use interfaces--

```ts
// noop
```

## Type and Interface prefix

The name shape of type/interface prefixed with `T` for type and `I` for Interface that is used for react props. The idea is to differentiate the component name and the type name, as for the other used for type, it might not necessarily need to be prefixed.

```ts
type MarketType = {
    icon: string;
    title: string;
};

type TInstruments = {
    title: string;
    active_symbols: MarketType[];
};
```

---

## Gotchas

In @deriv/dashboard we no longer use a `connect` function to inject props into our components, instead, we use hooks for everything (`useStores`). In addition, if you're rendering observables you will have to wrap your component in an `observer` call imported from `mobx-react-lite` to ensure the stores and UI are synchronised (i.e. it will re-render when an observable change).

A couple of things to remember:

Wrap at the export level, not at the component definition level:

### Do

```TS
const MyComponent: React.FC = () => {
    const { my_store } = useStores();
    return <div>{ my_store.my_observable_value }</div>
}

export default observer(MyComponent);
```

### Do not

```TS
const MyComponent: React.FC = observer(() => {
    const { my_store } = useStores();
    return <div>{ my_store.my_observable_value }</div>
});

export default MyComponent;
```

Also, make sure to keep the `observer` wrapper as close to the component as possible. For example, if you're using `withRouter` wrapper from `react-router-dom`:

### Do

```TS
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const MyComponent: React.FC = () => {
    const { my_store } = useStores();
    return <div>{ my_store.my_observable_value }</div>
};

export default withRouter(observer(MyComponent));
```

### Do not

```TS
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const MyComponent: React.FC = () => {
    const { my_store } = useStores();
    return <div>{ my_store.my_observable_value }</div>
};

export default observer(withRouter(MyComponent));
```
