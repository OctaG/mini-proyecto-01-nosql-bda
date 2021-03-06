import React, {useEffect, useState} from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import firebase from '../utils/firebase.js';

import {useHistory} from "react-router-dom";

function Auction({item}) {
  console.log(item);
  return (
     <Card sx={{ maxWidth: "40%", marginBottom: 5, marginLeft:"30%", marginRight:"30%", borderRadius:1}}>
       <CardContent>
         <Typography gutterBottom variant="h5" component="div">
           {item.itemName}
         </Typography>
         <Typography variant="body2" color="text.secondary">
            {item.itemDescription}
         </Typography>
         <Typography variant="body2" color="text.secondary">
            ${item.itemCurrentBid ? item.itemCurrentBid : item.itemInitialPrice}
         </Typography>
       </CardContent>
     </Card>
  );
}

export default Auction;
