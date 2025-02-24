import {BrowserRouter as Router, Route, Routes} from react-router-dom;
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  <Router>
    <h1>FlashLearn</h1>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
}
