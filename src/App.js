import NavigationBar from './components/NavigationBar.js';
import './App.css';

import {BrowserRouter as Router} from "react-router-dom";

function App() {
  return (
    <Router>
      <NavigationBar/>
    </Router>
  );
}

export default App;
