import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/auth", // Replace with your backend URL
  withCredentials: true, // If using cookies for auth
});

export default axiosInstance;



