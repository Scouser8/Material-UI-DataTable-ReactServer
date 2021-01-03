import axios from "axios";

const instance = axios.create({
  baseURL: "https://polar-wildwood-69674.herokuapp.com/",
});

export default instance;
