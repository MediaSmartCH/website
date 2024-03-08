import React from "react";
import "./App.css";
import Config from "config/Config";
import { useAppSelector } from "services/hooks/hooks";

function App() {
  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div className={`${themeReducer === "light" ? "App" : "AppDark"} `}>
      <Config />
    </div>
  );
}

export default App;
