import axios from "axios";

const AxiosPublic = axios.create({
  baseURL: 'https://hishab-2025-pi.vercel.app',

});
const UseAxiosPublic = () => {
  return AxiosPublic;
};

export default UseAxiosPublic;


