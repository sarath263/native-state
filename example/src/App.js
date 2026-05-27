import logo from './logo.svg';
import './App.css';
import { useNativeState } from 'native-state-react';
import { useEffect } from 'react';
import Another from './Another';

function App() {
  const [name, setName] = useNativeState('s.name');
  const [school, setSchool] = useNativeState('s.school');
  useEffect(() => {
    setTimeout(() => {
      setName("George");
    }, 3000);

    setInterval(() => {
      setSchool({ time: new Date().toISOString(), class: "V" });
    }, 5000);
  }, [setName, setSchool]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi <code>{name || "NA"}</code> .
        </p>
        <Another />
      </header>
    </div>
  );
}

export default App;
