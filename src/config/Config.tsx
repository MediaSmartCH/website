import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PreLoader from "components/preLoader/PreLoader";
const Homepage = lazy(() => import("../pages/Homepage"));

const Config = () => {
  return (
    <Router>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default Config;
