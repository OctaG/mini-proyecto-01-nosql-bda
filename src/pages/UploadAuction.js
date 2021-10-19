import React, {useState, useEffect} from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ItemForm from '../components/ItemForm';
import EventForm from '../components/EventForm';
import Review from '../components/Review';

import firebase from "../utils/firebase.js";

export default function UploadAuction(){

  const theme = createTheme();

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Detalles del artículo', 'Detalles del evento', 'Revisión'];

  const [data, setData] = useState({
    itemName: '',
    itemDescription: '',
    itemInitialPrice: 0,
    itemEstimatedValue: 0,
    eventDateAndTime: new Date(),
    eventDuration: 5,
  });

  const [nameFieldError, setNameFieldError] = useState(false);
  const [descriptionFieldError, setDescriptionFieldError] = useState(false);
  const [initialPriceFieldError, setInitialPriceFieldError] = useState(false);
  const [estimatedValueFieldError, setEstimatedValueFieldError] = useState(false);

  useEffect(()=>{
    if(data.itemName == ''){
      setNameFieldError(true);
    }else{
      setNameFieldError(false);
    }
    if(data.itemDescription == ''){
      setDescriptionFieldError(true);
    }else{
      setDescriptionFieldError(false);
    }
    if(data.itemInitialPrice == '' || data.itemInitialPrice < 0){
      setInitialPriceFieldError(true);
    }else{
      setInitialPriceFieldError(false);
    }
    if(data.itemEstimatedValue == '' || data.itemEstimatedValue < 0){
      setEstimatedValueFieldError(true);
    }else{
      setEstimatedValueFieldError(false);
    }
  }, [data]);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <ItemForm data={data} update={updateData}/>;
      case 1:
        return <EventForm data={data} update={updateData}/>;
      case 2:
        return <Review data={data}/>;
      default:
        throw new Error('Unknown step');
    }
  }

  function updateData(type, newData){
    console.log(type);
    setData((data) => {
      console.log(newData);
      console.log(data);
      return {...data,[type]: newData}
    });
  }

  const createAuctionEventInDB = async (eventDateAndTime, eventDuration, key) =>{
    const dbRefToEvents = firebase.database().ref('Events');
    const eventCreator = firebase.auth().currentUser.uid;
    const newRef = dbRefToEvents.push();
    const eventItemAuctioned = key;
    eventDateAndTime = eventDateAndTime.toString();
    const auctionEvent = {
      eventCreator,
      eventDateAndTime,
      eventDuration,
      eventItemAuctioned,
    };
    dbRefToEvents.child(newRef.key).set(auctionEvent);
    return [newRef.key, eventItemAuctioned];
  }

  const createAuctionItemInDB = async (itemName, itemDescription, itemInitialPrice, itemEstimatedValue) =>{
    const dbRefToItems = firebase.database().ref('Items');
    const highestBid = itemInitialPrice;
    const newItemRef = dbRefToItems.push();
    const itemOwner = firebase.auth().currentUser.uid;
    const auctionItem = {
      itemOwner,
      itemName,
      itemDescription,
      itemInitialPrice,
      itemEstimatedValue,
      highestBid,
    };
    dbRefToItems.child(newItemRef.key).set(auctionItem);
    return newItemRef.key;
  }

  const insertAuctionInItem = async (key) =>{
    const dbRefToItems = firebase.database().ref('Items/');
    const auctionEvent = key[0];
    const auction = {
      auctionEvent
    };
    dbRefToItems.child(key[1]).update(auction);
  }

  const handleNext = () => {
    console.log(nameFieldError);
    console.log(descriptionFieldError);
    console.log(initialPriceFieldError);
    console.log(estimatedValueFieldError);
    if(activeStep !== steps.length -1){
      setActiveStep(activeStep + 1);
    }
    if(activeStep === 2){
      if(
        !nameFieldError && !descriptionFieldError && !initialPriceFieldError
        && !estimatedValueFieldError
      ){
        createAuctionItemInDB(
          data.itemName,
          data.itemDescription,
          data.itemInitialPrice,
          data.itemEstimatedValue
        ).then((key) => {
          createAuctionEventInDB(
            data.eventDateAndTime,
            data.eventDuration,
            key
          ).then((key) =>{
            insertAuctionInItem(key);
          }).then(() => {
            setActiveStep(activeStep + 1);
          });
        })
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return(
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4, marginTop:5 }}>
        <Box>
          <Typography sx={{fontWeight: "bold"}} align='center' variant="h1" >
            Mi subasta
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
         <Typography sx={{fontWeight: "lighter"}} gutterBottom align='center' variant="h4">
            Crear una subasta
         </Typography>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Gracias por subastar un artículo con nosotros.
                </Typography>
                <Typography variant="subtitle1">
                  {'Su evento de subasta para ' + data.itemName +
                  ' ha sido creado de forma exitosa. La subasta ocurrirá el '
                  + data.eventDateAndTime + '.'
                  }
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
