import axios from "axios";
import { config } from "@/lib/config";

export const fetchUserList = async (pageNumber = 1) => {
  return await axios.get(`${config.baseUrl}/users?page=${pageNumber}`);
};
