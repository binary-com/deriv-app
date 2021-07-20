# JavaScript Guidelines

**In this document**

-   [General Guidelines](#general-guidelines)
-   [Style Guide](#style-guide)
    -   [Naming Conventions](#naming-conventions)
    -   [Commenting](#commenting)
-   [Import Rules](#import-rules)
-   [JSX Rules](#jsx-rules)

## General Guidelines

In order to improve the clarity, quality and development time it is worth considering the following principles whenever possible:

-   [DRY (Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don't_repeat_yourself)
-   [KISS (Keep It Simple, Stupid)](https://en.wikipedia.org/wiki/KISS_principle)
-   [SoC (Separation of Concerns)](https://en.wikipedia.org/wiki/Separation_of_concerns)
-   [Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
-   [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter)

---

## Style Guide

-   [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/README.md) is partially being followed in our code base.

-   Code formatting is handled entirely by Prettier. Run `npm run prettify` from the root of the project to format all code. Code is also automatically formatted [pre-commit](https://www.atlassian.com/git/tutorials/git-hooks).

-   Check below for the rules that are not caught by ESLint but should be followed.

### Naming Conventions

<a id="naming-conventions-variables"></a>
**[Variables:](#naming-conventions-variables)** Variables should be lowercase words separated by `_`.

```JavaScript
const field_name = '...';
```

<a id="naming-conventions-constant-contents"></a>
**[Constant(Static) contents:](#naming-conventions-constant-contents)** Constant(Static) contents(numbers or strings) should be `UPPER_SNAKE_CASE`. UPPER CASE and separated by `_`.

```JavaScript
const MY_STATIC_CONTENT = '...';
```

<a id="naming-conventions-functions"></a>
**[Functions:](#naming-conventions-functions)** Functions should be camelCase. This is to easily distinguish between variables and functions.

```JavaScript
const myFunction = () => { ... };
```

<a id="naming-conventions-modules"></a>
**[Modules:](#naming-conventions-modules)** Module names and classes should be PascalCase.

```JavaScript
const MyModule = (() => { ... })();
```

<a id="naming-conventions-javascript-elements"></a>
**[JavaScript elements:](#naming-conventions-javascript-elements)** JavaScript elements start with `el_` for a similar effect.

```JavaScript
const el_test = document.getElementById('test');
```

<a id="naming-conventions-boolean"></a>
**[Boolean:](#naming-conventions-boolean)** Those variables which store a boolean value, should start with `is_`, `has_`, ...

```JavaScript
const is_updated = true;
const has_crypto = false;
```

---

### Commenting

<a id="commenting-explanations"></a>
**[Explanations:](#commenting-explanations)** Feel free to add comments to explain any code that is confusing.

<a id="commenting-todo"></a>
**[To do:](#commenting-todo)** Use `TODO: [search-key] - {explanation}` comments anywhere that needs consideration or attention in the future. Please use a unique key per issue that a TODO addresses so that we can find all TODOs of similar nature by searching for the key.

<a id="commenting-api-requests"></a>
**[API requests:](#commenting-api-requests)** Comments should be added to highlight logic that is hardcoded in the front-end and should move to API:

-   For changes that can be done in API V3, use the comment

    ```JavaScript
    // API_V3: [description of what needs to be moved to API]
    ```

-   For changes that should be done in API V4, use the comment

    ```JavaScript
    // API_V4: [description of what needs to be moved to API]
    ```

---

## Import Rules

<a id="import-rules-require"></a>
**[Require:](#import-rules-require)** Prefer `import` in import statements.

<a id="import-rules-alphabetical-ordering"></a>
**[Alphabetical ordering:](#import-rules-alphabetical-ordering)** The order is important; it should be sorted alphabetically according to path:

-   `moment` comes first as it's not a relative path.
-   `s` is before `u` so `./storage` comes before `./utility`.
-   Both `applyToAllElements` and `createElement` are from the same file, but `a` is before `c`
-   Unassigned `require` goes to the end

Imports are grouped by: 3rd-party first, then local absolute imports, then local relative

<a id="import-rules-combining-require"></a>
**[Combining require:](#import-rules-combining-require)** When there are many functions being imported from the same file, consider combining it into one import line.

```JavaScript
import React from 'react';

...

class ABC extends React.Component { ... }
...
React.useCallback(...);
React.useEffect(...);
...
```

## JSX Rules

-   Use destructuring to capture parameters if needed.
-   Use `{condition && <el/> ...</el>}` syntax to conditionally render an element.
-   Use `<el attr={value || undefined}` to conditionally render an attribute, React omits attributes with null or undefined values.
-   Use `localize('...')` or `<Localize i18n_default_text='...'` for translations.
-   Use `website_name` constant instead of `Deriv`.
-   Do NOT use `<Element attributeName={true} />`; just use `<Element attributeName />`.
-   Always name your components before default exporting them, for example:

```JavaScript
import React from 'react';

const Loading = ({theme}) => (
    <div className={`barspinner ${ theme || 'dark'}`}>
        { Array.from(new Array(5)).map((x, inx) => (
            <div key={inx} className={`rect${inx + 1}`}></div>
        ))}
    </div>
);

export default Loading;
```

-   There are cases where you do not want your strings to be escaped (i.g. when you place `<a/>` tags inside a `<Table />`). To bypass HTML escape, you can use the `interpolation.escapeValue` boolean property of the localize `options` param (under normal circumstances do NOT use this.):

```JavaScript
localize('{{opening_tag}}Deriv App{{closing_tag}}', {
    opening_tag  : '<a href="https://app.deriv.com" rel="noopener noreferrer" target="_blank" class="link">',
    closing_tag  : '</a>',
    interpolation: { escapeValue: false },
}),
```
