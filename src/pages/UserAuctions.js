import React, {useEffect, useState} from "react";
import Auction from '../components/Auction.js';
import Typography from '@mui/material/Typography';

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
    <div>
      <div>
        <Typography variant="h3">Mis subastas</Typography>
      </div>
      <div>
        {eventsData
          ? eventsData.map((eventData, index) => <Auction event={eventData} index={index} allowDelete/>)
          : ""
        }
      </div>
    </div>
  );
}

export default UserAuctions;
