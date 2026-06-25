
<div align="center">
  <h1>
    <br/>
    <br/>
    🌍 ⚛️ 🤖
    <br />
    native-state-react
    <br />
    <br />
    <br />
    <br />
  </h1>
  <sup>
    <br />
    <a href="https://www.npmjs.com/package/native-state-react">
       <img src="https://img.shields.io/npm/v/native-state-react.svg" alt="npm package" />
    </a>
    <a href="https://github.com/sarath263/native-state/actions/workflows/npm-publish.yml">
      <img src="https://github.com/sarath263/native-state/actions/workflows/npm-publish.yml/badge.svg" alt="build" />
    </a>
    <a href="https://www.npmjs.com/package/native-state-react">
      <img src="https://img.shields.io/npm/dm/native-state-react.svg" alt="npm downloads" />
    </a>
    <br />
    <br />
    A lightweight, efficient global state management library for <a href="https://react.dev/">React</a>.
    <br />
    <em>Uses only built-in React hooks. Compatible with React Native.</em>
    <br />
    <br />
  </sup>
  <br />
  <br />
  <pre>npm i <a href="https://www.npmjs.com/package/native-state-react">native-state-react</a></pre>
  <br />

</div>

## Features 

- **Efficient Rendering**: Components re-render only when the selected state slice changes.
- **No External Dependencies**: Uses only React's built-in hooks.
- **Lightweight**: Total of 115 lines code (entire library).
- **Simple API**: Use global state like `useState` in React. Neither reducers, actions, or boilerplate code.
- **Drop-in Replacement**: Perfect alternative to Redux and MobX.

## Quick Start

1. Wrap your app with the `<Root>` component at the top level, optionally providing the initial state.

2. Use `useNativeState` or `useNativeSelector` in your components to read and update global state.

### If you are using version 2.0.x or lower  [See documentation below](#footer)

### Basic Example

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from 'native-state-react';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Root />
    <App />
  </React.StrictMode>
);
```

> [!NOTE]
> Wrap your `<App />` inside `<Root>` (or render `<Root />` as a top-level sibling component) to initialize your global state.
<br/>
Then, in your component:

```jsx
import { useNativeState } from 'native-state-react';

function App() {
  const [name, setName] = useNativeState('s.name','First name');

  const updateName = () => {
    setName("George");
  };

  return (
    <div>
      <p>Name: {name}</p>
      <button onClick={updateName}>Update Name</button>
    </div>
  );
}
```
#### See running [Demo Here](https://stackblitz.com/edit/native-state-react?file=src%2FApp.jsx) 
## API

### `<Root>`

The root component that initializes the global state store.

- `initial`: (optional) Object - The initial state. Defaults to an empty object `{}`.
- `children`: (optional) React Nodes - Children to render inside `<Root>`.
<br/>

### `useNativeState(pathString, initialVal)`

Hook to read and write a specific slice of the global state using string path notation.

- `pathString`: **String** - The path to select in the global state, starting with `'state'` or `'s'` (e.g. `'s.name'`, `'state.school.class'`, `'s.todos[0].title'`, `'state.school.class.student[21]'`).
- `initialVal`: (**optional**) Any - The value to initialize in the `pathString`. Note that if `pathString` is already initialized or has value set, it will NOT be updated/initilized again, you may cal set method to update the value.


Returns: `[value, setValue]`

- `value`: The current value at the specified path.
- `setValue`: Function to update the value of this specific path.
<br/>

> [!WARNING]
> if `pathString` is `s.todos[0].title` , `s.todos[0]` must exist in the global state so that it can retrieve/set `title`
<br/>

### `useNativeSelector(selectorFunction)`

A highly optimized read-only hook that subscribes to state slices. Components using this hook will re-render **only** when the selected slice changes. Internally utilizes React's modern `useSyncExternalStore` for tear-free rendering.

- `selectorFunction`: Function - A function that accepts the state and returns the selected slice (e.g. `s => s.name`).

Returns: `value`

- `value`: The read-only value of the selected state slice.

<br/>


## Advanced Example

### At App level initialization

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from 'native-state-react';

const initialState = {
  name: "Mary",
  school: { class: "V" }
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Root initial={initialState}>
      <App />
    </Root>
  </React.StrictMode>
);

```

Using both `useNativeState` for writing state slices and `useNativeSelector` for highly optimized read-only selections:

```jsx
import { useNativeState, useNativeSelector } from 'native-state-react';
import { useEffect } from 'react';

function ClassComponent() {
  // Syncs and updates the specific path 's.school' with an optional on-mount default
  const [school, setSchool] = useNativeState('s.school', { class: "V" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSchool({ class: "1A" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [setSchool]);

  // Read-only selector; component only re-renders if 'name' changes
  const name = useNativeSelector(s => s.name);

  return (
    <div>
      <p>Student Name: {name}</p>
      <p>Class: {school?.class}</p>
    </div>
  );
}
```
<br/>
<br/>

> [!IMPORTANT]
> **Thanks for reading this much.  I am glad that you are using this. If you like this, please do ⭐ this repository.**

## Examples

See the `example` folder for a complete React project implementation demonstrating live updates, time stamps, and cross-component syncing.

---

## Documentation for versions &lt;= 2.0.x
<div id="footer">
<details >
  <summary><b>📖 Legacy Versions &lt;= 2.0.x </b></summary>
  <br />

  If you are using legacy versions of `native-state-react` (versions `2.0.x` or below), please refer to the documentation below:

  ## Quick Start

  1. Wrap your app with the `<Root>` component at the top level, providing the initial state.

  2. Use `useSelector` in components to access and update global state.

  ### Basic Example

  ```jsx
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import { Root } from 'native-state-react';

  const initialState = {
    name: "Mary",
    school: { class: "V" }
  };

  const container = document.getElementById('root');
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Root initial={initialState} />
      <App />
    </React.StrictMode>
  );
  ```

  In your component:

  ```jsx
  import { useSelector } from 'native-state-react';

  function App() {
    const [name, setState] = useSelector(s => s.name);

    const updateName = () => {
      setState({ name: "George" });
    };

    return (
      <div>
        <p>Name: {name}</p>
        <button onClick={updateName}>Update Name</button>
      </div>
    );
  }
  ```

  ## API

  ### `<Root>`

  The root component that provides the global state context.

  - `initial`: (optional) Object - The initial state. Defaults to an empty object `{}`.

  ### `useSelector(selector)`

  Hook to select a slice of the global state.

  - `selector`: Function - A function that takes the state and returns the desired slice.

  Returns: `[value, setState]`

  - `value`: The current value of the selected slice. `undefined` if the slice doesn't exist.
  - `setState`: Function to update the global state by merging the provided object.

  **Note**: `setState` merges the provided object into the global state. It can update any part of the state, not just the selected slice.

  ## Advanced Example

  ```jsx
  import { useSelector } from 'native-state-react';
  import { useEffect } from 'react';

  function ClassComponent() {
    const [schoolClass, setState] = useSelector(s => s.school?.class);

    useEffect(() => {
      const timer = setTimeout(() => {
        setState({ school: { class: "1A" } });
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return <div>Class: {schoolClass}</div>;
  }
  ```

  This updates the `school.class` after 3 seconds, and the component will re-render.

</details>
</div>

## BENCHMARK TEST RUN 
Code used to run benchmark will be added to benchmarks folder soon. 

<img width="1109" height="748" alt="image" src="https://github.com/user-attachments/assets/25c7e85a-94dd-4736-930f-b184112f2d84" />


