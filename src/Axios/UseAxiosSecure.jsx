import { useContext, useEffect } from "react";
import { AuthContext } from "../Security/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const AxiosSecure = axios.create({
  baseURL: "hhttps://digital-networking-server.vercel.app",
});

const UseAxiosSecure = () => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = AxiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Clean up the interceptor when the component unmounts
    return () => {
      AxiosSecure.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const errorInterceptor = AxiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Clean up the error interceptor when the component unmounts
    return () => {
      AxiosSecure.interceptors.response.eject(errorInterceptor);
    };
  }, [logOut, navigate]);

  return AxiosSecure;
};

export default UseAxiosSecure;