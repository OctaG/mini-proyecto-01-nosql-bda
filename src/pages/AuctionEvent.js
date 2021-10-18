import { useLocation } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Bidder from '../components/Bidder.js'
import { makeStyles } from '@mui/styles';
import firebase from '../utils/firebase.js'

const useStyles = makeStyles({
  form:{
    marginTop: 20,
    marginBottom: 20,
    display: 'block',
  },
  field:{
    marginBottom: 15,
  }
});


function AuctionEvent(){
  const location = useLocation();
  const classes = useStyles();
  const [highestBid, setHighestBid] = useState(0);
  const event = location.state.event;
  const item = location.state.item;
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bidList, setBidList] = useState([]);
  const [slicer, setSlicer] = useState(0);

  const writePriceToDB= () =>{
    const dbRefToProducts = firebase.database().ref('Items/' + event.eventItemAuctioned);
    const newPrice = {
      highestBid
    };
    dbRefToProducts.update(newPrice);
  }

  const writeBidToDB= () =>{
    const dbRefToProducts = firebase.database().ref('Items/' + event.eventItemAuctioned +'/itemBids');
    const bidder = firebase.auth().currentUser.uid;
    const bid = highestBid;
    const newBid = {
      bidder,
      bid
    };
    dbRefToProducts.push(newBid);
  }

  const writeOwnerToDB= () =>{
    const dbRefToProducts = firebase.database().ref('Items/' + event.eventItemAuctioned);
    const itemOwner = firebase.auth().currentUser.uid;
    const newOwner = {
      itemOwner
    };
    dbRefToProducts.update(newOwner);
  }

  const readCurrentPrice = () =>{
    const priceRef = firebase.database().ref('Items/'  + event.eventItemAuctioned + '/highestBid');
    priceRef.on('value', (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setCurrentPrice(data);
    });
  }

  const readBids = () =>{
    const dbRefToItemBids = firebase.database().ref('Items/'  + event.eventItemAuctioned + '/itemBids');

    dbRefToItemBids.on('value', (snapshot) =>{
      const bids = snapshot.val();
      const bidList = [];
      for(let id in bids){
        bidList.push(bids[id]);
      }
      console.log(bidList);
      setBidList(bidList);
    });
  }

  useEffect(() => {
   readCurrentPrice();
   readBids();
 }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    if(highestBid){
      writePriceToDB();
      writeBidToDB();
      writeOwnerToDB();
    }
  }

  return(
    <Box>
      <h1>Precio actual: ${currentPrice ? currentPrice : item.itemInitialPrice}</h1>
      <Box className={classes.form}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit}>
          <Box className={classes.field}>
            <TextField
              label='Precio'
              variant='standard'
              fullWidth
              required
              onChange={(e) => setHighestBid(e.target.value)}
            />
          </Box>
          <Button type='submit' variant="contained">Submit</Button>
        </form>
      </Box>
        {bidList ?
           bidList.map((bid, index) => <Bidder bid={bid} index={index}/>
          )
          : ""
        }
      <Box>
      </Box>
    </Box>
  );
}

export default AuctionEvent;
