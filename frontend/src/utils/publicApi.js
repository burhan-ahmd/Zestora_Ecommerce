import axios from "axios";
import { jwtDecode } from "jwt-decode";

const publicApi = axios.create({
  baseURL: "http://localhost:4000/api",
});

export default publicApi;
