import React, {useEffect, useState} from "react";

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import firebase from '../utils/firebase.js';

import {useHistory} from "react-router-dom";

function Auction({event, allowDelete}) {

  const [expanded, setExpanded] = useState(false);
  const [buttonText, setButtonText] = useState("Ver más información");
  const [item, setItem] = useState();
  const [creator, setCreator] = useState();
  const [deleted, setDeleted] = useState(false);

  const history = useHistory();

  useEffect(()=>{
    const dbRefToItems = firebase.database().ref("Items/" + event.eventItemAuctioned);
    const dbRefToUsers = firebase.database().ref("Users/" + event.eventCreator);
    dbRefToItems.on('value', (snapshot) =>{
       const item = snapshot.val();
       setItem(item);
    });
    dbRefToUsers.on('value', (snapshot) =>{
       const creator = snapshot.val();
       setCreator(creator);
       console.log(creator);
    });
  }, [event]);

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
    })(({ theme, expand }) => ({
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
  }));

  const handleExpandClick = () => {
    if(!expanded){
      setButtonText("Ver menos información");
    }else{
      setButtonText("Ver más información");
    }
    setExpanded(!expanded);
  };

  const goToAuction = () => {
    const user = firebase.auth().currentUser
    user ? console.log("Yes") : console.log("No");;
    const auctionStartDateAndTime = new Date(event.eventDateAndTime);
    const auctionEndDateAndTime = new Date(auctionStartDateAndTime.getTime() + event.eventDuration * 60000);
    console.log(auctionStartDateAndTime);
    console.log(auctionEndDateAndTime);
    if(!user){
      history.push({
       pathname: '/signin',
      });
    }else if(new Date() < auctionStartDateAndTime){
      alert("No es posible acceder a una subasta que aún no comienza.")
    }else if (new Date() > auctionEndDateAndTime ){
      alert("No es posible acceder a una subasta que ha finalizado.")
    }else{
      history.push({
       pathname: '/auction-event',
       state: { item: item, event: event }
      });
    }
  }

  const deleteAuction = () => {
    const dbRefToItems = firebase.database().ref("Items/" + event.eventItemAuctioned);
    const dbRefToEvent = firebase.database().ref("Events/" + item.auctionEvent);
    if(new Date() < new Date(event.eventDateAndTime)){
      setDeleted(true);
      dbRefToItems.remove();
      dbRefToEvent.remove();
    }else {
      alert("No es posible eliminar un evento que ha finalizado.")
    }
  }

 return(
   <div>
     {!deleted ?
       <Card sx={{ maxWidth: "50%", marginBottom: 5, marginLeft:"25%", marginRight:"25%", borderRadius:1}}>
         <CardHeader
           title=
           <Typography sx={{fontWeight: "bold"}} gutterBottom align='center' variant="h5">
             {item ? item.itemName : ""}
           </Typography>
           subheader=
           <Typography sx={{fontWeight: "lighter"}} gutterBottom align='center' variant="h6">
              {event.eventDateAndTime}
           </Typography>
         />
         <CardContent>
           <Typography sx={{fontWeight: "lighter"}} align='left'>
              {creator && item ?
                creator.firstName + " " + creator.lastName + " subasta: '" +
                item.itemName + "' con un precio inicial de $" +  item.itemInitialPrice +
                ". El evento de subasta ocurrirá el " + event.eventDateAndTime +
                ". "
                :
                ""
              }
           </Typography>
         </CardContent>
         <CardActions sx={{ justifyContent: 'flex-end' }}>
           <ExpandMore
             expand={expanded}
             onClick={handleExpandClick}
             aria-expanded={expanded}
             aria-label="show more"
           >
             <Button variant="outlined">{buttonText}</Button>
           </ExpandMore>
           {allowDelete ?
             <Button
               variant="contained"
               onClick={() =>
                 deleteAuction()
              }
               >
               Delete
             </Button>
             :
             <Button
               variant="contained"
               onClick={() =>
                 goToAuction()
              }
               >
               Ingresar
             </Button>
           }
         </CardActions>
         <Collapse in={expanded} timeout="auto" unmountOnExit>
           <CardContent>
             <Typography sx={{fontWeight: "bolder"}} gutterBottom align='center' paragraph>
              Detalles de la subasta
             </Typography>
             {creator && item ?
               <Box>
                 <Typography sx={{fontWeight: 500, marginBottom: 0.5}} align='center' paragraph>
                   Vendedor
                 </Typography>
                  <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom align='center' paragraph >
                    {creator.firstName + " " + creator.lastName}
                  </Typography>
                  <Typography sx={{fontWeight: 500, marginBottom: 0.5}} align='center' paragraph>
                      Artículo en subasta
                  </Typography>
                  <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom align='center' paragraph>
                    {item.itemName}
                  </Typography>
                  <Typography sx={{fontWeight: 500, marginBottom: 0.5}} align='center' paragraph>
                    Descripción del artículo
                  </Typography>
                  <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom align='center' paragraph >
                    {item.itemDescription}
                  </Typography>
                  <Typography sx={{fontWeight: 500, marginBottom: 0.5}} align='center' paragraph>
                    Valor estimado del artículo
                  </Typography>
                  <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom align='center' paragraph >
                    ${item.itemEstimatedValue}
                  </Typography>
                  <Typography sx={{fontWeight: 500, marginBottom: 0.5}} align='center' paragraph>
                    Precio inicial de subasta
                  </Typography>
                  <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom align='center' paragraph >
                    ${item.itemInitialPrice}
                  </Typography>
                  <Typography sx={{fontWeight: 500, marginBottom: 0.5}} align='center' paragraph>
                    Duración de la subasta
                  </Typography>
                  <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom align='center' paragraph >
                    {event.eventDuration} minutos
                  </Typography>
                </Box>
                :
                  ""
             }
             <Typography paragraph>
             </Typography>
           </CardContent>
         </Collapse>
       </Card>
       :
       null
     }
    </div>
  );
}

export default Auction;
