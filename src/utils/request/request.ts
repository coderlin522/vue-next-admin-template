import axios from "axios";
import type { AxiosRequestConfig, AxiosInstance, Canceler } from "axios";
import { IData } from "@/types/axios";
import Cooike from 'js-cookie'
import router from "@/router";
import { Local, Session } from "../storage";
import Cookies from "js-cookie";
const cancelToken = axios.CancelToken;
interface XrequestConfig extends AxiosRequestConfig {
  repeatRequest?: boolean;
  isFormData?: boolean;
}
function objectToFormData(obj: Record<string, any>) {
  const formData = new FormData();
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key]);
  });
  return formData;
}
class Xrequest {
  instance: AxiosInstance;
  cancel?: Canceler;

  constructor(config: any) {
    this.instance = axios.create(config);
    this.instance.interceptors.request.use(
      (config: XrequestConfig) => {
        this.cancel && this.cancel();
        const token = Cooike.get("token");
        if (token) {
          config.headers!.Authorization = `Bearer ${token}`;
        }
        if (config.repeatRequest) {
          config.cancelToken = new cancelToken(c => {
            this.cancel = c;
          });
        }
        if (config.isFormData) {
          config.data = objectToFormData(config.data);
        }
        return config;
      },
      err => {
        console.log("发送请求错误：", err);
        return err;
      },
    );
    this.instance.interceptors.response.use(
      res => {
        if (res.data.code === 401) {
          Session.clear();
          Local.clear();
          Reflect.ownKeys(Cookies.get()).forEach((key) => {
            Cookies.remove(key);
          });
          router.push("/login")
          return;
        } else if (res.data.code !== 200) {
          ElMessage.error(res.data.msg);
        }
        return res.data;
      },
      err => {
        console.log(err);
        // 对响应错误做点什么
        if (err.message.indexOf("timeout") != -1) {
          // 危险通知
          console.error("网络超时");
          ElMessage.error("网络超时")
        } else if (err.message == "Network Error") {
          console.error("网络连接错误");
          ElMessage.error("网络连接错误")
        } else {
          ElMessage.error(err.response.data.error)
        }
        return Promise.reject(err);
      },
    );
  }
  request<T = any>(config: XrequestConfig) {
    return this.instance.request<any, IData<T>>(config);
  }
}

export default Xrequest;
