# Native state for React
A native global state implementation with react. At least React version `18.2.0` is required.

>  No external dependencies used.
> 
>  Very lightweight (605 bytes in size)
> 
>  Simple usage( **no reducers, no actions and no boilerplate code required** )

#

First, `import` and Add `<Root>` provider in the top level. 

then, `import` and use `useSelector` to get the desired global state slice and update function like this.

`const [name,setState] = useSelector(s=>s.name);`

if `name` not found in global state, it will return `undefined`.

And you can update the name like this.. 

`setState({name:"Will"});`

Add/update another state property by

`setState({school:{class:"VII"}});`

#

### Full implementation

Add `<Root>` provider in your top component tree (`index.js`), 

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
		<Root initial={store}> // 'initial' prop is optional(default will be empty object).
		  <App/>
		</Root>
	 </React.StrictMode>,
	 document.getElementById('root'),
    )

In `App.js`

    import { useSelector } from 'native-state-react';
    function App() {
	    const [name,setState] = useSelector(s=>s.name);
	    return <div>{name}</div>
    }
    
Update name in the state like this

    setState({name:"George"});

it just replaces the given name in the existing state, other state values will stay unchanged. the `school` object will stay unchanged.

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
