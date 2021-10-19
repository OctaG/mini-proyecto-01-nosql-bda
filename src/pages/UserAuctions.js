import React, {useEffect, useState} from "react";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Auction from '../components/Auction.js';

import firebase from '../utils/firebase.js';

function UserAuctions() {
  const [eventsData, setEventsData] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(()=>{
    const eventList = [];
    const itemList = [];
    const dbRefToEvents = firebase.database().ref("Events");

    dbRefToEvents.on('value', (snapshot) =>{
      const events = snapshot.val();
      for(let id in events){
        if(events[id].eventCreator == firebase.auth().currentUser.uid){
          eventList.push(events[id])
        }
      }
      console.log(events);
      setEventsData(eventList);
    });
  }, []);

  return(
    <Box sx={{ marginTop: 5}}>
      <Box>
        <Typography sx={{fontWeight: "bold"}} align='center' gutterBottom variant="h1" >
          Mis subastas
        </Typography>
      </Box>
      <Box>
        {eventsData
          ? eventsData.map((eventData, index) => <Auction event={eventData} index={index} allowDelete/>)
          : ""
        }
      </Box>
    </Box>
  );
}

export default UserAuctions;
