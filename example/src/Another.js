import './App.css';
import { useNativeState } from 'native-state-react';
import { useEffect } from 'react';

function Another() {
  const [school, setSchool] = useNativeState('s.school');
  useEffect(() => {

    setTimeout(() => {
      setSchool({ class: "X" });
    }, 6000);
  }, [setSchool])
  return (
    <div className="App">
      <p>
        Level: <code>{school?.class || "NA"}</code>
      </p>
      <span
        className="App-link"
      >
        {school?.time || "NA"} is the current time.
      </span>
    </div>
  );
}

export default Another;
