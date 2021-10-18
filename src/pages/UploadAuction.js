import * as React from 'react';
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

const steps = ['Detalles del artículo', 'Detalles del evento', 'Revisión'];
const theme = createTheme();

export default function UploadAuction() {

  const [data, setData] = React.useState({
    itemName: '',
    itemDescription: '',
    itemInitialPrice: 0,
    itemEstimatedValue: 0,
    eventDateAndTime: new Date(),
    eventDuration: 5,
    eventBidInterval: 0,
  });

  const [activeStep, setActiveStep] = React.useState(0);

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

  const createAuctionEventInDB = async (eventDateAndTime, eventDuration, eventBidInterval, key) =>{
    const dbRefToEvents = firebase.database().ref('Events');
    const eventCreator = firebase.auth().currentUser.uid;
    const newRef = dbRefToEvents.push();
    const eventItemAuctioned = key;
    eventDateAndTime = eventDateAndTime.toString();
    const auctionEvent = {
      eventCreator,
      eventDateAndTime,
      eventDuration,
      eventBidInterval,
      eventItemAuctioned,
    };
    dbRefToEvents.child(newRef.key).set(auctionEvent);
    return [newRef.key, eventItemAuctioned];
  }

  const createAuctionItemInDB = async (itemName, itemDescription, itemInitialPrice, itemEstimatedValue) =>{
    const dbRefToItems = firebase.database().ref('Items');
    const itemCurrentBid = itemInitialPrice;
    const newItemRef = dbRefToItems.push();
    const itemOwner = firebase.auth().currentUser.uid;
    const auctionItem = {
      itemOwner,
      itemName,
      itemDescription,
      itemInitialPrice,
      itemEstimatedValue,
      itemCurrentBid,
    };
    dbRefToItems.child(newItemRef.key).set(auctionItem);
    return newItemRef.key;
  }

  const insertAuctionInItem = (key) =>{
    const dbRefToItems = firebase.database().ref('Items/');
    const auctionEvent = key[0];
    const auction = {
      auctionEvent
    };
    dbRefToItems.child(key[1]).update(auction);
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    if(activeStep === 2){
      createAuctionItemInDB(
        data.itemName,
        data.itemDescription,
        data.itemInitialPrice,
        data.itemEstimatedValue
      ).then((key) => {
        createAuctionEventInDB(
          data.eventDateAndTime,
          data.eventDuration,
          data.eventBidInterval,
          key
        ).then((key) =>{
          insertAuctionInItem(key);
        })
      });
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Crear subasta
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
                  Thank you for your order.
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
