import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL
export const getAllRunIds = async() => {
  let url = `${BASE_URL}/runs`;
  let result = await axios.get(url)
  .then(function(response){
    const {runs} = response.data;
    console.log(runs);
    return runs;
  })
  .catch(function(error){
      console.log("Error :",error);
  });
  return result;
}

  export const getLastReport = async(id) => {
    let url=`${BASE_URL}/scores/${id}`;
    let result = await axios.get(url)
    .then(function(response){
      return response.data.score;
    })
    .catch(function(error){
        console.log("Error :",error);
    });
    return result;
  }

  export const getRunById = async(id) => {
    let url=`${BASE_URL}/runs/${id}`;
    let result = await axios.get(url)
    .then(function(response){
      return response.data.data;
    })
    .catch(function(error){
        console.log("Error :",error);
    });
    return result;
  }

  export const getAllProjects = async() => {
    let url=`${BASE_URL}/projects`;
    let result = await axios.get(url)
    .then(function(response){
      return response.data.projects;
    })
    .catch(function(error){
        console.log("Error :",error);
    });
    return result;
  }




