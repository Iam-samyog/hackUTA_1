
import NoteLensHomepage from "./components/NoteLensHomepage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
function App() {
  return (
      
     <Router>
      <Routes>
        <Route path="/" element={<NoteLensHomepage/>} />
         <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
