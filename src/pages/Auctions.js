import React, {useEffect, useState} from "react";
import firebase from '../utils/firebase.js';
import { flexbox } from '@mui/system';
import Auction from '../components/Auction.js';

import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

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
      console.log(events);
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

  useEffect(()=>{
    showAllAuctions();
  }, []);

  return(
    <div>
      <div>
        <Typography variant="h3">Subastas</Typography>
        <FormGroup>
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
      </div>
      <div>
        {eventsData
          ? eventsData.map((eventData, index) => <Auction event={eventData} index={index}/>)
          : ""
        }
      </div>
    </div>
  );
}

export default Auctions;
