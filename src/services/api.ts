import axios from "axios";

const api = axios.create({

  baseURL: "http://localhost:5151/api"

});

export default api;