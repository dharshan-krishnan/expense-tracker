import api from "./api";

export const submitFeedback = (feedback) => api.post("/feedback", feedback);
export const getUserFeedback = () => api.get("/feedback");
