# Native Global state for React [![Node.js Package](https://github.com/sarath263/native-state/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/sarath263/native-state/actions/workflows/npm-publish.yml)
A native global state implementation with react. At least React version `18.2.0` is required.

Lightweight and most efficient implementation for react global state,just using in built react hooks. Compatible with React Native too. 

>  Component renders only if the slice taken(in example `s.name`) changes.
> 
>  No external dependencies used.
> 
>  Very lightweight (605 bytes in size)
> 
>  Simple usage( **no reducers, no actions and no boilerplate code required** )
>
>  Perfect replacement for Redux and Mobx

#
 
### Install
#### npm i native-state-react
#
### Usage

1. First, `import` and Add `<Root initial={{/* Initial state */}}/>` as a component in the top level. 

2. Then, `import` and use `useSelector` to get the desired global state slice.

   `const [name,setState] = useSelector(s=>s.name);`

3. Note:
   - **If `name` not found in global state, it will return `undefined`.**
   - **Eventhough `name` coming from global state, Note that, setState can still update the global state values, not just the name.**
4. Update the name like this.. 

   `setState({name:"Will"});`

5. Add/update another state property by

   `setState({school:{class:"VII"}});`

#

#### See `example` folder for react project example implementation.

### Full implementation

Add `<Root>` in your top component tree (`index.js`), 

    import React from 'react';
    import ReactDOM from 'react-dom';
    //Add import 
    import { Root } from 'native-state-react'; 
    
	let store={ 
	    name:"Mary",
	    school:{class:"V"}
    };
    ReactDOM.render(
     <React.StrictMode>
	  <Root initial={store} /> // 'initial' prop is optional(default will be empty object).
	  <App/>
     </React.StrictMode>,
    document.getElementById('root'),
    )

In your component

    import { useSelector } from 'native-state-react';
    function App() {
	    const [name,setState] = useSelector(s=>s.name);
	    return <div>{name}</div>
    }
    
Update name in the state like this

    setState({name:"George"});

it just replaces the given name in the existing state, other state values will stay unchanged. The `school` object in global state will stay unchanged.

Example with state update.

    import { useSelector } from 'native-state-react';
    function Class() {
	    const [name,setState] = useSelector(s=>s.name);
	    useEffect(()=>{
		    setTimeout(() => {
			    setSt({name:"George"});
		    }, 3000);
		 },[]);
	    
	    return <div>{name}</div>
    }
With Above code, you can see the name gets updated in UI after 3 seconds.
