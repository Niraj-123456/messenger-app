import axios from "axios";
import { config } from "@/lib/config";

export const fetchUserList = async (pageNumber: number) => {
  return await axios.get(`${config.baseUrl}/users?page=${pageNumber}`);
};
