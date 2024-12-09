import axios from "axios";

const AxiosPublic = axios.create({
  baseURL: 'https://hishab-2025.vercel.app',

});
const UseAxiosPublic = () => {
  return AxiosPublic;
};

export default UseAxiosPublic;


