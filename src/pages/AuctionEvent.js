import React, {useState, useEffect} from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Bidder from '../components/Bidder.js'
import { makeStyles } from '@mui/styles';
import firebase from '../utils/firebase.js'
import Typography from '@mui/material/Typography';
import Countdown from 'react-countdown';

import { useLocation } from "react-router-dom";


function AuctionEvent(){

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

  const location = useLocation();

  const event = location.state.event;
  const item = location.state.item;

  const classes = useStyles();

  const [userBid, setUserBid] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentOwner, setCurrentOwner] = useState("");
  const [bidList, setBidList] = useState([]);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionWinner, setAuctionWinner] = useState("false");

  const auctionStartDateAndTime = new Date(event.eventDateAndTime);
  const auctionEndDateAndTime = new Date(auctionStartDateAndTime.getTime() + event.eventDuration * 60000);

  useEffect(() => {
   readCurrentPrice();
   readBids();
   readCurrentOwner();
  }, []);

  const writePriceToDB= () =>{
    const dbRefToProducts = firebase.database().ref('Items/' + event.eventItemAuctioned);
    const highestBid = userBid;
    const newPrice = {
      highestBid
    };
    dbRefToProducts.update(newPrice);
  }

  const writeBidToDB= () =>{
    const dbRefToProducts = firebase.database().ref('Items/' + event.eventItemAuctioned +'/itemBids');
    const bidder = firebase.auth().currentUser.uid;
    const bid = userBid;
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

  const readCurrentPrice = async () =>{
    const priceRef = firebase.database().ref('Items/'  + event.eventItemAuctioned + '/highestBid');
    priceRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setCurrentPrice(data);
    });
  }

  const readUsers = async () =>{
    const userRef = firebase.database().ref('Users/' + currentOwner);
    userRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setAuctionWinner(data);
    });
  }

  const readCurrentOwner = async () =>{
    const ownerRef = firebase.database().ref('Items/'  + event.eventItemAuctioned + '/itemOwner');
    ownerRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setCurrentOwner(data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    readCurrentPrice()
    .then(()=>{
      if(userBid > currentPrice && !isNaN(userBid)){
        writePriceToDB();
        writeBidToDB();
        writeOwnerToDB();
      }
    });
  }

  const endAuction = () =>{
    readUsers();
    setAuctionEnded(true);
  }

  return(
    <Box sx={{ marginTop: 10}}>
      <Box>
        <Typography sx={{fontWeight: "bold"}} align='center' variant="h3" >
          {item.itemName}
        </Typography>
        <Typography sx={{fontWeight: "100", marginBottom:10}} align='center' gutterBottom variant="h5">
          {item.itemDescription}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{fontWeight: "lighter"}} align='center' gutterBottom variant="h4">
          Precio {!auctionEnded ? "actual" : "final"}: ${currentPrice ? currentPrice : item.itemInitialPrice}
        </Typography>
      </Box>
      <Box sx={{marginTop:10, marginBottom: 5}}>
        <Typography sx={{fontWeight: "600"}} align='center' gutterBottom variant="h4">
          Tiempo restante
        </Typography>
        <Typography variant="h2" align='center'>
           <Countdown
            date={Date.now() + (event.eventDuration * 60000 - (Date.now() - auctionStartDateAndTime))}
            onComplete = {() =>
              endAuction()
            }
           />
        </Typography>
      </Box>
      {!auctionEnded && firebase.auth().currentUser.uid != event.eventCreator?
        <Box className={classes.form}>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <Box className={classes.field}>
              <TextField
                label='Nueva oferta'
                variant='standard'
                fullWidth
                required
                onChange={(e) => setUserBid(e.target.value)}
              />
            </Box>
            <Button sx={{marginBottom: 3}} type='submit' variant="contained">Ofertar</Button>
          </form>
        </Box>
        :
        null
      }
      {auctionEnded ?
        (
        <Box>
          <Typography sx={{fontWeight: "600"}} align='center' variant="h6">
             La subasta ha terminado. ¡Gracias por participar!
          </Typography>
          <Typography sx={{marginBottom:5, fontWeight: "lighter"}} align='center' variant="h6">
             El ganador es {auctionWinner ? auctionWinner.firstName + " " + auctionWinner.lastName : ""}
          </Typography>
        </Box>
        )
        :
        null
      }
      <Box>
        {bidList ?
           bidList.map((bid, index) => <Bidder bid={bid} index={index}/>
          )
          : ""
        }
      </Box>
    </Box>
  );
}

export default AuctionEvent;
