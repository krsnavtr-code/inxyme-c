import api from "../utils/api";

export interface SuccessStoryItem {
  _id?: string;
  id?: number | string;
  name: string;
  role: string;
  company?: string;
  course: string;
  category: string;
  image?: string;
  hike?: string;
  content: string;
  rating: number;
  featured?: boolean;
  batchYear?: number;
  cardIdNumber?: string;
  status?: string;
  displayOrder?: number;
}

export const getSuccessStories = async (params: Record<string, any> = {}) => {
  const response = await api.get("/success-stories", { params });
  return response.data;
};
