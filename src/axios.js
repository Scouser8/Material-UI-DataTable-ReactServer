import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:7999",
});

export default instance;
