import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [state, setState] = useState(0);
  const getState = () => {
    console.log(state, "state from getState");
  };

  const updateState = () => {
    setInterval(() => {
      setState((prev) => {
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
 console.log(state,"state from use effect")
  }, [state]);
  return (
    <div className=" w-screen h-screen  ">
      <p>{state}</p>
      <button onClick={updateState}>update state</button>
    </div>
  );
}

export default App;
