import './App.css';
import { useSelector } from 'native-state-react';
import { useEffect } from 'react';

function Another() {
  const [school,setState] = useSelector(s=>s.school);
  useEffect(()=>{

    setTimeout(() => {
        setState({school:{class:"X"}});
    }, 6000);
  },[])
  return (
    <div className="App">
        <p>
          Level: <code>{school?.class || "NA"}</code> 
        </p>
        <a
          className="App-link"
        >
          {school?.time || "NA"} is the current time.
        </a>
    </div>
  );
}

export default Another;
