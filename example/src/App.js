import logo from './logo.svg';
import './App.css';
import { useSelector } from 'native-state-react';
import { useEffect } from 'react';
import Another from './Another';

function App() {
  const [name,setState] = useSelector(s=>s.name);
  useEffect(()=>{
    setTimeout(() => {
      setState({name:"George"});
    }, 3000);

    setInterval(() => {
      setState({school:{time:new Date().toISOString(),class:"V"}});
    }, 3000);
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi <code>{name || "NA"}</code> .
        </p>
        <Another/>
      </header>
    </div>
  );
}

export default App;
