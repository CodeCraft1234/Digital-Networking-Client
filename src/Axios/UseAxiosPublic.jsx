import axios from "axios";

const AxiosPublic = axios.create({
  // baseURL: 'https://digital-networking-server.vercel.app',
  baseURL: 'https://digital-networking-server.vercel.app/',

});
const UseAxiosPublic = () => {
  return AxiosPublic;
};

export default UseAxiosPublic;


