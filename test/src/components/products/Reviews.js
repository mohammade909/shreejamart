import React, { useState } from "react";
import { Star, ThumbsUp, User, Clock, Edit, Trash } from "lucide-react";
import { createReview, deleteReview } from "../../redux/reviewSlice";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ConfirmPopup from '../ConfirmPopup'
const Reviews = ({ reviews, entityId, auth, entityType }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  // Calculate average rating
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  // Render star ratings
  const RenderStars = ({ rating, size = 20 }) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={size}
        fill={index < Math.floor(rating) ? "#FFD700" : "none"}
        color="#FFD700"
        className="inline-block"
      />
    ));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    dispatch(
      createReview({
        entity_type: entityType,
        entity_id: entityId,
        user_id: auth.user_id,
        rating,
        review_text: reviewText,
        pros,
        cons,
      })
    );
    toast.success("Review submitted successfully");
  };

  const handleDeleteReview =(id)=>{
    setIsOpen(true)
    setSelectedReviewId(id)
  }
  return (
    <div className="max-w-4xl mx-auto p-6 mt-5 bg-white border rounded-md">
      {/* Overall Rating Summary */}
      <ConfirmPopup isOpen={isOpen} onClose={setIsOpen} actionFunction={deleteReview} id={selectedReviewId} message="Confrim Delete!"/>
      <div className="flex items-center mb-6 border-b pb-4">
        <div className="mr-6">
          <h2 className="text-4xl font-bold text-gray-800">{averageRating}</h2>
          <div className="flex">
            <RenderStars rating={parseFloat(averageRating)} size={24} />
          </div>
          <p className="text-gray-500 mt-2">{reviews.length} Reviews</p>
        </div>
      </div>

      {/* Review Submission Form */}
      {auth ? (
        <form
          onSubmit={handleSubmitReview}
          className="mb-6 bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

          <div className="mb-4">
            <label className="block mb-2">Your Rating</label>
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={30}
                  onClick={() => setRating(index + 1)}
                  fill={index < rating ? "#FFD700" : "none"}
                  color="#FFD700"
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Pros</label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="What did you like?"
              />
            </div>
            <div>
              <label className="block mb-2">Cons</label>
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="What could be improved?"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2">Review Details</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Share your detailed experience"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/70 transition"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-sm text-secondary">Please log in to add review</p>
      )}

      {/* Reviews List */}
      <div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
        </div>
        {reviews?.map((review) => (
          <div
            key={review.review_id}
            className="border-b p-4 hover:border hover:bg-gray-50 relative"
          >
            <div className="flex items-center mb-2">
              <User className="mr-2 text-gray-500" />
              <span className="font-medium">
                {review?.username || "Anonymous"}
              </span>
              <div className="ml-4 flex">
                <RenderStars rating={parseFloat(review?.rating)} size={16} />
              </div>

              {/* Conditional rendering of update/delete buttons */}
              {auth && auth?.user_id === review?.user_id && (
                <div className="ml-auto flex space-x-2">
                  <button
                    // onClick={() => handleUpdateReview(review)}
                    type="button"
                    className="text-blue-500 hover:text-secondary/70 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                  type="button"
                    onClick={() => handleDeleteReview(review.review_id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )}
            </div>

            <h4 className="font-semibold text-lg">{review.review_title}</h4>
            <p className="text-gray-700 mt-2">{review.review_text}</p>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <strong>Pros:</strong>
                <p className="text-green-600">{review.pros}</p>
              </div>
              <div>
                <strong>Cons:</strong>
                <p className="text-red-600">{review.cons}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>
                {new Date(review.date_submitted).toLocaleDateString()}
              </span>
              <ThumbsUp size={16} className="ml-4 mr-2" />
              <span>{review.helpful_votes} helpful votes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
