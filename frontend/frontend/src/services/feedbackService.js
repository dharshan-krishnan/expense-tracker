import api from "./api";

export const submitFeedback = (feedback) => api.post("/api/feedback", feedback);
export const getUserFeedback = () => api.get("/api/feedback");
