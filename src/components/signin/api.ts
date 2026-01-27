import { API } from "@/lib/const/api"
import {UserExits} from "./type"
import backendRoute from "@/lib/const/backend_route";
import { Response } from "@/lib/const/response";

const checkUser = async(user:UserExits, token?: string):  Promise<Response> => {
  try {
    const api = await API(token);
    const res = await api.post(backendRoute.user.checkUserInDB,{
      email: user.email,
      username: user.username
    });

    return res.data;
  } catch (error: any) {
    return {
      SUCCESS: false,
      ERROR: error.toString(),
      STATUS: 500,
      DATA: null
    }
  }
}

export {checkUser}