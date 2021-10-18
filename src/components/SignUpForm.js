import React, {useState} from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {Link} from "react-router-dom";

import firebase from "../utils/firebase.js";

export default function SignUpForm(){

  const theme = createTheme({
    palette: {
      primary: {main: "#1575eb"},
      secondary: {main: "#2a7fe8"},
    },
  });

  const [firstNameFieldError, setFirstNameFieldError] = useState(false);
  const [lastNameFieldError, setLastNameFieldError] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState(false);
  const [passwordFieldError, setPasswordFieldError] = useState(false);
  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState("");

  const checkFirstNameFieldForError = (value) =>{
    const input = value;
    if(!input.match(/^[a-zA-Z\s]*$/)){
      setFirstNameFieldError(true);
    }else{
      setFirstNameFieldError(false);
    }
  }

  const checkLastNameFieldForError = (value) =>{
    const input = value;
    if(!input.match(/^[a-zA-Z\s]*$/)){
      setLastNameFieldError(true);
    }else{
      setLastNameFieldError(false);
    }
  }

  const checkEmailFieldForError = (value) =>{
    const input = value;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!input.match(emailRegex)){
      setEmailFieldError(true);
    }else{
      setEmailFieldError(false);
    }
  }

  const checkPasswordFieldForError = (value) =>{
    const input = value;
    if(!input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)){
      setPasswordFieldError(true);
    }else{
      setPasswordFieldError(false);
    }
  }

  const createUserWithEmailAndPassword = (email ,password, firstName, lastName) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      createUserProfileInDB(
        user.uid,
        firstName,
        lastName,
        email
      );
    })
    .catch((error) => {
      const errorCode = error.code;
      if(errorCode === "auth/email-already-in-use"){
        setFirebaseErrorMessage("Ya existe una cuenta con esta dirección de correo");
      }else{
        setFirebaseErrorMessage("Ocurrio algo inesperado. Intentelo nuevamente");
      }
    });
  }

  const createUserProfileInDB = (uuid, firstName, lastName, email) =>{
    const dbRefToProducts = firebase.database().ref('Users');
    const user = {
      firstName,
      lastName,
      email,
    };
    dbRefToProducts.child(uuid).set(user);
  }

  const handleSubmit = (e) => {
    const data = new FormData(e.currentTarget);
    e.preventDefault();
    if(!firstNameFieldError && !lastNameFieldError && !emailFieldError && !passwordFieldError){
      createUserWithEmailAndPassword(
        data.get('email'),
        data.get('password'),
        data.get('firstName'),
        data.get('lastName')
      );
    }
  };

  return(
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{width:80, height:80, m:3, bgcolor: '#1575eb' }}>
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h2">
            Crear una cuenta
          </Typography>
          <Typography component="h2" variant="h6" sx={{marginTop:4, justifyContent:'center'}}>
            {firebaseErrorMessage}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                  variant="standard"
                  onChange = {(e) => checkFirstNameFieldForError(e.target.value)}
                  error={firstNameFieldError}
                  helperText={firstNameFieldError ?
                    "Nombre solo puede contener letras y no debe estar vacio"
                    :
                    ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                  variant="standard"
                  onChange = {(e) => checkLastNameFieldForError(e.target.value)}
                  error={lastNameFieldError}
                  helperText={lastNameFieldError ?
                    "Apellido solo puede contener letras y no debe estar vacio"
                    :
                    ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  variant="standard"
                  onChange = {(e) => checkEmailFieldForError(e.target.value)}
                  error={emailFieldError}
                  helperText={emailFieldError ?
                    "Debe ingresar una dirección de correo válida"
                    :
                    ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="standard"
                  onChange = {(e) => checkPasswordFieldForError(e.target.value)}
                  error={passwordFieldError}
                  helperText={
                    "La contraseña debe contener mínimo 8 caracteres y por lo menos una mayuscula, una minúscula, un número y un caracter especial"
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2}}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signin"> ¿Ya tiene una cuenta? Inicie sesión </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
