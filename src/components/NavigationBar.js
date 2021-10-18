import React, {useState} from 'react';

import Navbar from 'react-bootstrap/navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Button from '@mui/material/Button';

import Home from '../pages/Home.js';
import Faqs from '../pages/Faqs.js';
import Auctions from '../pages/Auctions.js';
import AuctionEvent from '../pages/AuctionEvent.js';
import SignUp from '../pages/SignUp.js';
import SignIn from '../pages/SignIn.js';
import UploadAuction from '../pages/UploadAuction.js'

import firebase from "../utils/firebase.js";

import {
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
      history.push("/");
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
    <>
      <Navbar collapseOnSelect sticky="top" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to={'/'}>Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={'/faqs'}>¿Cómo funciona?</Nav.Link>
              {
                isSignedIn ?
                  <>
                    <Nav.Link as={Link} to={'/current-auctions'}>Subastas actuales</Nav.Link>
                    <Nav.Link as={Link} to={'/create-auctions'}>Crear subasta</Nav.Link>
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
                    <Nav.Link as={Link} to={'/signin'}>Iniciar sesión</Nav.Link>
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
            <Route path="/current-auctions">
              <Auctions/>
            </Route>
            <Route path="/auction-event">
              <AuctionEvent/>
            </Route>
            <Route path="/create-auctions">
              <UploadAuction/>
            </Route>
            <Route path="/signup">
              <SignUp/>
            </Route>
            <Route path="/signin">
              <SignIn/>
            </Route>
            <Route path="/">
              <Home/>
            </Route>
          </Switch>
      </Container>
    </>
  );
}

export default NavigationBar;
