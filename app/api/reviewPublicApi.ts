import api from "../utils/api";

export interface StudentReview {
  _id: string;
  studentName: string;
  studentPhoto?: string;
  rating: number;
  tags?: string[];
  reviewType: "text" | "video";
  videoUrl?: string;
  videoDuration?: number;
  reviewText?: string;
  courseName?: string;
  courseSlug?: string;
  status: string;
  verified?: boolean;
  createdAt: string;
}

export interface PublicReviewsResponse {
  success: boolean;
  count: number;
  data: StudentReview[];
}

export const getPublicStudentReviews = async (
  params: Record<string, any> = {}
): Promise<PublicReviewsResponse> => {
  try {
    const response = await api.get("/reviews/public", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching public student reviews:", error);
    throw error;
  }
};
