import React, { useState } from "react";

const Task = () => {
  const [lightState, setLightState] = useState({
    red: { active: false, time: 10 },
    yellow: { active: false, time: 5 },
    green: { active: false, time: 15 },
  });
  const getActiveLight = () => {
    console.log(lightState);
    let f = Object.values(lightState);
    console.log(f, "value of f is ");
    const keys = Object.keys(lightState);
    const currentIndex = keys.indexOf(f);
    if (currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % keys.length; // Circular logic

      return { f, nextIndex };
    }
  };



  const [timer, setTimer] = useState(0);
  const setLightStyle = (type) => {
    return lightState[type].active ? { backgroundColor: `${type}` } : null;
  };

  const activateLights = () => {
    let intervalID = setInterval(() => {
      if (timer === 0) {
        setLightState(() => ({
          red: { active: false, time: 10 },
          yellow: { active: false, time: 5 },
          green: { active: true, time: 15 },
        }));

        console.log(lightState, "loght state");
        //         // if (timer === getActiveLight().f.time) {
        //         //   // setLightState((prev)=>())
        //         // }
      }

      setTimer((t) => t + 1);
    }, 1000); // Executes every 1000 ms (1 second)
  };
  return (
    <div className="flex  h-[500px] items-center gap-5 justify-center border flex-col">
      <div className="">timer {timer}</div>

      <div className="flex gap-4 ">
        <div
          style={setLightStyle("green")}
          className="p-1 border border-slate-900 w-4 h-4 rounded-full "
        ></div>
        <div
          style={setLightStyle("yellow")}
          className="p-1 border  border-slate-900 w-4 h-4 rounded-full "
        ></div>
        <div
          style={setLightStyle("red")}
          className="p-1 border  border-slate-900 w-4 h-4 rounded-full "
        ></div>
      </div>
      {/* <Map /> */}
      <div className="border flex gap-4 ">
        <span className="flex  items-center gap-2 justify-center">
          <label htmlFor="green" className="text-green-500">
            green
          </label>
          <input type="checkbox" name="" id="" />
        </span>
        <span className="flex items-center gap-2 justify-center">
          <label htmlFor="green" className="text-yellow-500">
            yellow
          </label>
          <input type="checkbox" name="" id="" />
        </span>
        <span className="flex items-center gap-2 justify-center">
          <label htmlFor="green" className="text-red-500">
            red
          </label>
          <input type="checkbox" name="" id="" />
        </span>
        <span>
          time: <input type="number" name="" id="" />
        </span>
      </div>
      <button onClick={activateLights}>activetae</button>
    </div>
  );
};

export default Task;
