
import NoteLensHomepage from "./components/NoteLensHomepage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Profile from "./components/Profile";
function App() {
  return (
      
     <Router>
      <Routes>
        <Route path="/" element={<NoteLensHomepage/>} />
         <Route path="/login" element={<Login/>} />
           <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
