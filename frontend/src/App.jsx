import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Results from "./pages/Results";
import JobMatches from "./pages/jobMatches";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/results" element={<Results />} />
        <Route path="/job-matches" element={<JobMatches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;