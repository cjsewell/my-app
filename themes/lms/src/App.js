import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import BusinessRole from './Components/BusinesssRole.js';
import Home from './Components/Home.js';

function App() {
  return (
    <Router>
      <div>

        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/'} className="nav-link"> Home </Link></li>
            <li><Link to={'/business'} className="nav-link"> Business Roles </Link></li>
          </ul>
        </nav>

        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/business' component={BusinessRole} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
