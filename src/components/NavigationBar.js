import React, {useState} from 'react';

import Navbar from 'react-bootstrap/navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Button from '@mui/material/Button';

import Home from '../pages/Home.js';
import Faqs from '../pages/Faqs.js';
import SignUp from '../pages/SignUp.js';

import firebase from "../utils/firebase.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";

function NavigationBar() {

  const [isSignedIn, setIsSignedIn] = useState(false);
  const history = useHistory();

  firebase.auth().onAuthStateChanged((user) => {
    if(user) {
      // User is signed in
      setIsSignedIn(true);
      history.push("/");
    } else {
      // User is signed out
      setIsSignedIn(false);
    }
  });

  const logOut = () =>{
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
    });
  }



  return (
    <Container>
      <Navbar collapseOnSelect sticky="top" expand="lg" bg="white" variant="light">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={'/faqs'}>¿Cómo funciona?</Nav.Link>
              {
                isSignedIn ?
                  <>
                    <Nav.Link as={Link} to={'/auctions'}>Subastas actuales </Nav.Link>
                    <NavDropdown title="Mi perfil" id="collasible-nav-dropdown">
                      <NavDropdown.Item as={Link} to={'/my-profile'}>Mi cuenta</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to={'/my-auctions'}>Mis subastas</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        <Button
                        variant="contained"
                        onClick={() => logOut()}
                        >
                          Log out
                        </Button>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                  :
                  <>
                    <Nav.Link as={Link} to={'/signup'}>Sign Up</Nav.Link>
                  </>
              }
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

            </Route>
            <Route path="/signup">
              <SignUp/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
      </Container>
    </Container>
  );
}

export default NavigationBar;
