import React, {useEffect, useState} from "react";
import firebase from '../utils/firebase.js';
import { flexbox } from '@mui/system';
import Auction from '../components/Auction.js';
import Typography from '@mui/material/Typography';

function Auctions(){
  const [eventsData, setEventsData] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(()=>{
    const eventList = [];
    const itemList = [];
    const dbRefToEvents = firebase.database().ref("Events");

    dbRefToEvents.on('value', (snapshot) =>{
      const events = snapshot.val();
      for(let id in events){
        eventList.push(events[id])
      }
      console.log(events);
      setEventsData(eventList);
    });
  }, []);

  return(
    <div>
      <div>
        <Typography variant="h3">Subastas</Typography>
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
