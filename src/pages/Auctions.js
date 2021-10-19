import React, {useEffect, useState} from "react";

import { flexbox } from '@mui/system';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

import Auction from '../components/Auction.js';

import firebase from '../utils/firebase.js';

function Auctions(){

  const [eventsData, setEventsData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [queryUpcoming, setQueryUpcoming] = useState(false);
  const [queryPast, setQueryPast] = useState(false);
  const [queryLive, setQueryLive] = useState(false);

  useEffect(()=>{
    showAllAuctions();
  }, []);

  const showAllAuctions = () => {
    const itemList = [];
    const dbRefToEvents = firebase.database().ref("Events");
    dbRefToEvents.on('value', (snapshot) =>{
      const eventList = [];
      const events = snapshot.val();
      for(let id in events){
        eventList.push(events[id])
      }
      setEventsData(eventList);
    });
  }

  const showUpcomingAuctions = (e) => {
    const dbRefToEvents = firebase.database().ref("Events");
    setQueryUpcoming(e.target.checked);
    if(e.target.checked && (!queryPast || !queryLive)){
      dbRefToEvents.on('value', (snapshot) =>{
        const eventList = [];
        const events = snapshot.val();
        for(let id in events){
          if(new Date() < new Date(events[id].eventDateAndTime)){
            eventList.push(events[id])
          }
        }
        setEventsData(eventList);
      });
    }else{
      showAllAuctions();
    }
  }

  const showPastAuctions = (e) => {
    const dbRefToEvents = firebase.database().ref("Events");
    setQueryPast(e.target.checked);
    if(e.target.checked && (!queryUpcoming || !queryLive)){
      dbRefToEvents.on('value', (snapshot) =>{
        const eventList = [];
        const events = snapshot.val();
        for(let id in events){
          if(new Date() > new Date(events[id].eventDateAndTime) &&
             new Date() > new Date(new Date(events[id].eventDateAndTime).getTime() + events[id].eventDuration * 60000)){
            eventList.push(events[id])
          }
        }
        setEventsData(eventList);
      });
    }else{
      showAllAuctions();
    }
  }

  const showLiveAuctions = (e) => {
    const dbRefToEvents = firebase.database().ref("Events");
    setQueryLive(e.target.checked);
    if(e.target.checked && (!queryUpcoming || !queryPast)){
      dbRefToEvents.on('value', (snapshot) =>{
        const eventList = [];
        const events = snapshot.val();
        for(let id in events){
          if(new Date() > new Date(events[id].eventDateAndTime) &&
             new Date() < new Date(new Date(events[id].eventDateAndTime).getTime() + events[id].eventDuration * 60000)){
            eventList.push(events[id])
          }
        }
        setEventsData(eventList);
      });
    }else{
      showAllAuctions();
    }
  }

  return(
    <Box sx={{ marginTop: 5}}>
      <Box>
        <Box>
          <Typography sx={{fontWeight: "bold"}} align='center' gutterBottom variant="h1" >
            Subastas
          </Typography>
        </Box>
        <Box sx={{ marginTop: 5, marginBottom:5, marginLeft:"25%"}}>
          <Typography variant="h6" >
            Filtros de búsqueda
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox onChange={e => showUpcomingAuctions(e)}/>
              }
              label="Mostrar próximas subastas"
            />
            <FormControlLabel
              control={
                <Checkbox onChange={e => showPastAuctions(e)}/>
              }
              label="Mostrar subastas pasadas"
            />
            <FormControlLabel
              control={
                <Checkbox onChange={e => showLiveAuctions(e)}/>
              }
              label="Mostrar subastas en vivo"
            />
          </FormGroup>
        </Box>
      </Box>
      <Box  sx={{display: "row", justifyContent:"flex-end", alignItems:"center"}}>
        {eventsData
          ? eventsData.map((eventData, index) => <Auction event={eventData} index={index}/>)
          : ""
        }
      </Box>
    </Box>
  );
}

export default Auctions;
