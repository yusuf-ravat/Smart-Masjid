  //axiosinstance.js
  import axios from "axios";

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Ensure this matches your backend URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  export default axiosInstance;