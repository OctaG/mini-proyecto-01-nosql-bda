import React, {useEffect, useState} from "react";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Item from '../components/Item.js'

import firebase from '../utils/firebase.js';

function UserItems(){

  const [itemsData, setItemsData] = useState([]);

  useEffect(()=>{
    const itemList = [];
    const dbRefToEvents = firebase.database().ref("Items");

    dbRefToEvents.on('value', (snapshot) =>{
      const items = snapshot.val();
      for(let id in items){
        console.log(items[id].itemOwner);
        if(items[id].itemOwner == firebase.auth().currentUser.uid){
          itemList.push(items[id])
        }
      }
      console.log(items);
      setItemsData(itemList);
    });
  }, []);

  return (
    <Box sx={{ marginTop: 5}}>
      <Box>
        <Typography sx={{fontWeight: "bold"}} align='center' gutterBottom variant="h1" >
          Mis artículos
        </Typography>
      </Box>
      <Box>
        {itemsData
          ? itemsData.map((itemData, index) => <Item item={itemData} index={index}/>)
          : ""
        }
      </Box>
    </Box>
  )
}

export default UserItems;
