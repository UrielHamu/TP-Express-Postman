/* Módulo  OMDBWrapper*/

import axios from "axios";


const APIKEY = "9638f283";

const OMDBSearchByPage = async (searchText, page = 1) => {

  let returnObject = {
      respuesta     : false,
      cantidadTotal : 0,
      datos         : []
    };

    const requestString = `http://www.omdbapi.com/?apikey=9638f283&page=${page}&s=${searchText}`;
    const response = await axios.get(requestString);
    returnObject.respuesta=response.data.Response;
    returnObject.cantidadTotal = response.data.totalResults;
    returnObject.datos=response.data.Search;
    return returnObject;
};


const OMDBSearchComplete = async (searchText) => {
  let returnObject = {
      respuesta     : false,
      cantidadTotal : 0,
      datos         : []
    };
    let pagina=1;
    let requestString;
    let response;
    do{
        requestString = `http://www.omdbapi.com/?apikey=9638f283&page=${pagina}&s=${searchText}`;
        response = await axios.get(requestString);
        returnObject.respuesta=response.data.Response=="True";
        returnObject.cantidadTotal = response.data.totalResults;
        if(returnObject.respuesta){
        returnObject.datos.push(...response.data.Search);
        }
        pagina++;
    }while(returnObject.respuesta)
        returnObject.respuesta="True";
  return returnObject;
};

const OMDBGetByImdbID = async (imdbID) => {
  let returnObject = {
      respuesta     : false,
      cantidadTotal : 0,
      datos         : {}
    };

    const requestString = `http://www.omdbapi.com/?apikey=9638f283&i=${imdbID}`;
    const response = await axios.get(requestString);
    returnObject.respuesta=response.data.Response=="True";
    returnObject.datos=response.data;
    returnObject.cantidadTotal=1;
  return returnObject;
};

export {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID};
