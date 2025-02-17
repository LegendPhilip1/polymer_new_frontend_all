import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  console.log("From this")
  return http.request<Result>("get", baseUrlApi("getAsyncRoutes"));
};
