import React, {useEffect, useState} from "react";

import Typography from '@mui/material/Typography';

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
    <div>
      <div>
        <Typography variant="h3">Mis artículos</Typography>
      </div>
      <div>
        {itemsData
          ? itemsData.map((itemData, index) => <Item item={itemData} index={index}/>)
          : ""
        }
      </div>
    </div>
  )
}

export default UserItems;
