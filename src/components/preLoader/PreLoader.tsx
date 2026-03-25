import React from "react";
import "./preLoader.css";

const Preloader = () => {
  return (
    <div className="h-[100vh] w-full flex justify-center items-center">
      <div className="preloader-orbit-loading">
        <div className="cssload-inner cssload-one"></div>
        <div className="cssload-inner cssload-two"></div>
        <div className="cssload-inner cssload-three"></div>
      </div>
    </div>
  );
};

export default Preloader;
