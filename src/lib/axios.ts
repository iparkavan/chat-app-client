// import { useAuth } from "@/store/auth-store"
import  Axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_NODE_BACKEND_URL

const axios = Axios.create({ baseURL: API_BASE_URL})

// const axiosPrivate = Axios.create({ baseURL: API_BASE_URL})

// axiosPrivate.interceptors.request.use(
//   async (config) => {
//     const { accessToken } = useAuthslice.getState();

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosPrivate.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (isAxiosError(error)) {
//       if (error.response?.status === 403) {
//         Cookies.remove(ACCESS_TOKEN)
//       }
//     }
//   }
// )


export {
  axios,
}