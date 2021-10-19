import React, {useState} from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {Link} from "react-router-dom";

import firebase from "../utils/firebase.js";

export default function SignInForm(){

  const theme = createTheme({
    palette: {
      primary: {main: "#1575eb"},
      secondary: {main: "#2a7fe8"},
    },
  });

  const [emailFieldError, setEmailFieldError] = useState(false);
  const [firebaseErrorMessage, setFirebaseErrorMessage] = useState("");

  const checkEmailFieldForError = (value) =>{
    const input = value;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!input.match(emailRegex)){
      setEmailFieldError(true);
    }else{
      setEmailFieldError(false);
    }
  }

  const signIn = (email, password) =>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
      if(errorCode === "auth/user-not-found"){
        setFirebaseErrorMessage("No existe cuenta con el correo ingresado");
      }else if(errorCode === "auth/wrong-password"){
        setFirebaseErrorMessage("La contraseña ingresada es incorrecta");
      }
      else{
        setFirebaseErrorMessage("Ocurrio algo inesperado. Intentelo nuevamente");
      }
    });
  }
  const handleSubmit = (e) => {
    const data = new FormData(e.currentTarget);
    e.preventDefault();
    if(!emailFieldError){
      signIn(data.get('email'), data.get('password'));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{width:80, height:80, m:3, bgcolor: 'primary.main'}}>
            <LoginIcon fontSize="large"/>
          </Avatar>
          <Typography component="h1" variant="h2">
            Acceda a su cuenta
          </Typography>
          <Typography component="h2" variant="h6" sx={{marginTop:2, justifyContent:'center'}}>
            {firebaseErrorMessage}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              variant="standard"
              onChange = {(e) => checkEmailFieldForError(e.target.value)}
              error={emailFieldError}
              helperText={emailFieldError ?
                "Debe ingresar una dirección de correo válida"
                :
                ""
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signup">
                  ¿Aún no tiene una cuenta? Cree una
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
