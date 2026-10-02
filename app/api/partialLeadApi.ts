import api from "../utils/api";

/**
 * Silently send partial lead data to the backend.
 * Returns a promise that always resolves (never throws) so it can be
 * called in the background without affecting the user experience.
 */
export const savePartialLead = async (
  data: Record<string, any>,
): Promise<{ success: boolean; data?: any }> => {
  try {
    const response = await api.post("/partial-leads", data);
    return response.data;
  } catch {
    // Silently fail — partial lead capture should never block the user
    return { success: false };
  }
};

/**
 * Mark a partial lead as "converted" (called after final form submit).
 */
export const convertPartialLead = async (
  data: { sessionFingerprint?: string; email?: string },
): Promise<{ success: boolean }> => {
  try {
    const response = await api.patch("/partial-leads/convert", data);
    return response.data;
  } catch {
    return { success: false };
  }
};
