import Navbar from 'react-bootstrap/navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Home from '../pages/Home.js';
import Faqs from '../pages/Faqs.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function NavigationBar() {
  return (
    <Router>
      <Navbar collapseOnSelect sticky="top" expand="lg" bg="white" variant="light">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={'/faqs'}>¿Cómo funciona?</Nav.Link>
              <Nav.Link as={Link} to={'/auctions'}> Subastas actuales </Nav.Link>
              <Nav.Link as={Link} to={'/signup'}> Sign up </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Switch>
            <Route path="/faqs">
              <Faqs/>
            </Route>
            <Route path="/auctions">
              // TODO: Add auctions page
            </Route>
            <Route path="/signup">
              // TODO: Add signup page
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
      </Container>
    </Router>
  );
}

export default NavigationBar;
