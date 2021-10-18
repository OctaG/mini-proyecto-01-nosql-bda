import React, {useEffect, useState} from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

function Auction({event}) {

  const [expanded, setExpanded] = useState(false);
  const [item, setItem] = useState();
  const [creator, setCreator] = useState();

  const history = useHistory();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const goToAuction = () => {
    const auctionStartDateAndTime = new Date(event.eventDateAndTime);
    const auctionEndDateAndTime = new Date(auctionStartDateAndTime.getTime() + event.eventDuration * 60000);
    console.log(auctionStartDateAndTime);
    console.log(auctionEndDateAndTime);
    if(new Date() < auctionStartDateAndTime || new Date() > auctionEndDateAndTime ){
      console.log("Aun no puede acceder");
    }else{
      history.push({
       pathname: '/auction-event',
       state: { item: item, event: event }
      });
    }
  }

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
  }, []);
 return (
   <Card sx={{ maxWidth: 345 }}>
     <CardHeader
       title={item ? item.itemName : ""}
       subheader={event.eventDateAndTime}
     />
     <CardMedia
       component="img"
       height="194"
       image="/static/images/cards/paella.jpg"
       alt="Paella dish"
     />
     <CardContent>
       <Typography variant="body2" color="text.secondary">
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
     <CardActions>
       <Button
         variant="contained"
         onClick={() =>
           goToAuction()
        }
         >
         Ingresar
       </Button>
       <ExpandMore
         expand={expanded}
         onClick={handleExpandClick}
         aria-expanded={expanded}
         aria-label="show more"
       >
        <ExpandMoreIcon />
       </ExpandMore>
     </CardActions>
     <Collapse in={expanded} timeout="auto" unmountOnExit>
       <CardContent>
         <Typography variant="h5">Detalles de la subasta: </Typography>
         { creator && item ?
             <div>
                <Typography paragraph>
                  Vendedor
                  {": " + creator.firstName + " " + creator.lastName}
                </Typography>
                <Typography paragraph>
                  Artículo
                  {": " + item.itemName}
                </Typography>
                <Typography paragraph>
                  Descripción
                  {": " + item.itemDescription}
                </Typography>
                <Typography paragraph>
                  Valor estimado del artículo
                  {": $" + item.itemEstimatedValue}
                </Typography>
                <Typography paragraph>
                  Oferta inicial
                  {": $" + item.itemInitialPrice}
                </Typography>
                <Typography paragraph>
                  Duración de la subasta
                  {": " + event.eventDuration + " minutos"}
                </Typography>
                <Typography paragraph>
                  Incrementos de la oferta
                  {": $" + event.eventBidInterval}
                </Typography>
             </div>
            :
              ""

         }
         <Typography paragraph>
         </Typography>
       </CardContent>
     </Collapse>
   </Card>
  );
}

export default Auction;
