import axios from "axios";

const URL_SERVER = process.env.REACT_APP_PUBLIC_BACKEND_URL;


export const callAPI = async (endpoint, method , body , params) =>{
  console.log("Backend URL:", URL_SERVER);

    return await axios({
        method: method,
        url: `${URL_SERVER}${endpoint}`,
        headers : {"Content-Type": "application/json"},
        data: body,
        params
      })
      
}