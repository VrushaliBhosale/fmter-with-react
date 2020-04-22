import React from 'react';
import axios from 'axios';
const url="https://cart-api-ts.herokuapp.com/scores";
 const getAllRuns = async() => {
  await axios.get(url)
      .then(async function(response){
        const {message} = response.data;
        console.log("data :",message);
      })
      .catch(function(error){
          console.log("Error :",error);
      });
}

export default getAllRuns