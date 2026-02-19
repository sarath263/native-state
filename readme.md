# Native Global State for React

[![Node.js Package](https://github.com/sarath263/native-state/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sarath263/native-state/actions/workflows/npm-publish.yml)

A lightweight, efficient global state management library for React, using only built-in React hooks. Requires React version 18.2.0 or higher. Compatible with React Native.

## Features

- **Efficient Rendering**: Components re-render only when the selected state slice changes.
- **No External Dependencies**: Uses only React's built-in hooks.
- **Lightweight**: Just 605 bytes in size.
- **Simple API**: No reducers, actions, or boilerplate code needed.
- **Drop-in Replacement**: Perfect alternative to Redux and MobX.

## Installation

```bash
npm install native-state-react
```

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

## Examples

See the `example` folder for a complete React project implementation.
