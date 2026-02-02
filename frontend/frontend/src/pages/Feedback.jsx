import { useState } from "react";
import { submitFeedback } from "../services/feedbackService";
import "./Feedback.css";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("general");
  const [comments, setComments] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitFeedback({
        rating,
        category,
        comments: comments.trim(),
        name: name.trim(),
        contactNumber: contactNumber.trim()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError(err.response?.data?.error || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setCategory("general");
    setComments("");
    setName("");
    setContactNumber("");
    setSubmitted(false);
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <h2>We value your feedback</h2>
        <p className="feedback-subtitle">
          Help us improve your expense tracker experience.
        </p>

        {submitted ? (
          <div className="feedback-thankyou">
            <h3>Thank you! ☕</h3>
            <p>Your feedback has been saved and will help us improve.</p>
            <button onClick={resetForm}>Submit another response</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            {error && (
              <div className="feedback-error">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div className="form-group">
              <label>How satisfied are you overall?</label>
              <div className="feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= rating ? "star active" : "star"}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>What are you reviewing?</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">Overall experience</option>
                <option value="design">Design & theme</option>
                <option value="usability">Ease of use</option>
                <option value="features">Features</option>
              </select>
            </div>

            <div className="form-group">
              <label>Share your thoughts</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                placeholder="What do you like? What could be better?"
                required
              />
            </div>

            <button
              type="submit"
              className="feedback-submit"
              disabled={rating === 0 || comments.trim() === "" || name.trim() === "" || contactNumber.trim() === "" || loading}
            >
              {loading ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

