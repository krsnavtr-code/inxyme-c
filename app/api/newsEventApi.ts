import api from "../utils/api";

export interface NewsOrEvent {
  _id?: string;
  id?: string;
  type: "masterclass" | "placement" | "press" | "announcement" | "archive" | string;
  category: "upcoming" | "news" | "placement" | "past" | string;
  title: string;
  description: string;
  fullContent?: string;
  date: string;
  time?: string;
  location?: string;
  mode?: "Live Interactive Webinar" | "Virtual Drive" | "Official Notice" | "On-Demand Recording" | string;
  organizerName?: string;
  organizerDivision?: string;
  organizedBy?: {
    name: string;
    division: string;
  };
  publisher?: string;
  image?: string;
  tag: string;
  featured?: boolean;
  registrationOpen?: boolean;
  externalLink?: string;
  status?: string;
  displayOrder?: number;
}

export const getNewsEvents = async (params: Record<string, any> = {}) => {
  const response = await api.get("/news-events", { params });
  return response.data;
};
