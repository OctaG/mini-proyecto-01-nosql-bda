import React, {useState, useEffect} from 'react';
import firebase from '../utils/firebase.js';

function Bidder({bid}) {

  console.log(bid.bidder);
  console.log(bid.bid);

  const [user, setUser] = useState();

  const readUserFromDB = () => {
    const dbRefToUser = firebase.database().ref('Users/'  + bid.bidder);
    dbRefToUser.on('value', (snapshot) =>{
      const user = snapshot.val();
      console.log(user);
      console.log(user.firstName);
      console.log(user.lastName);
      setUser(user);
    });
  }

  useEffect(() => {
   readUserFromDB();
  }, []);

  return(
    <div>
      {user ?
        user.firstName + " " + user.lastName + " ofertó " + bid.bid
        :
        ""
      }
    </div>
  );
}

export default Bidder;
