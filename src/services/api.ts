import axios from "axios";

const api = axios.create({

  // baseURL: "http://localhost:5151/api"
  //baseURL: "http://localhost:8085/api" // IIS
  baseURL: "http://www.niyatphysio-api.shop/api"

});

export default api;