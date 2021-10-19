import React, {useState, useEffect} from 'react';

import Typography from '@mui/material/Typography';

import firebase from '../utils/firebase.js';

function Bidder({bid}) {

  const [user, setUser] = useState();

  useEffect(() => {
   readUserFromDB();
  }, []);

  const readUserFromDB = () => {
    const dbRefToUser = firebase.database().ref('Users/'  + bid.bidder);
    dbRefToUser.on('value', (snapshot) =>{
      const user = snapshot.val();
      setUser(user);
    });
  }

  return(
    <Typography sx={{fontWeight: "lighter", marginBottom:0.5}} align='center' paragraph>
      {user ?
        user.firstName + " " + user.lastName + " ofertó $" + bid.bid
        :
        ""
      }
    </Typography>
  );
}

export default Bidder;
