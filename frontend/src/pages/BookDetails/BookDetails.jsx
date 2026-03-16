// pages/BookDetails/BookDetails.jsx
// Detail page for a single book listing, accessed via /books/:id.
// Fetches the book and its reviews independently - if the reviews module is
// unavailable the book detail page still loads correctly

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchBook, deleteBook } from "../../api/books.js";
import ReviewList from "../../components/ReviewList/ReviewList.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import "./BookDetails.css";

//Attempt to load the review API - if the module doesn't exist or
// the endpoint is down, reviewsAvailable will be false and the
// reviews section degrades gracefully instead of crashing the page.

let fetchReviews, createReview, deleteReview;
let reviewsAvailable = false;

try {
  const reviewsApi = await import("../../api/reviews.js");
  fetchReviews = reviewsApi.fetchReviews;
  createReview = reviewsApi.createReview;
  deleteReview = reviewsApi.deleteReview;
  reviewsAvailable = true;
} catch {
  reviewsAvailable = false;
}

/**
 * BookDetails page — full view of a single book listing with reviews.
 * @param {Object}      props
 * @param {Object|null} props.user - The currently logged-in user, or null if not authenticated
 */
export default function BookDetails({ user }) {
  // Extract the book id from the URL params (e.g. /books/:id)
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  // True while the book fetch is in progress
  const [loading, setLoading] = useState(true);
  // Holds an error message string if book fetch fails
  const [error, setError] = useState("");
  // True if the reviews fetch failed at runtime (API down, not missing module)
  const [reviewsError, setReviewsError] = useState(false);

  // Fetch the book and its reviews in parallel when the id changes
  useEffect(() => {
    // Always fetch the book — this module's core responsibility
    fetchBook(id)
      .then((b) => setBook(b))
      .catch(() => setError("Failed to load book details."))
      .finally(() => setLoading(false));

    // Fetch reviews separately — failure here does not affect the book load
    if (reviewsAvailable) {
      fetchReviews(id)
        .then((r) => setReviews(r))
        .catch(() => setReviewsError(true));
    }
  }, [id]);

  /**
   * Deletes the current listing after user confirmation,
   * then redirects back to the home page.
   */
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await deleteBook(id);
    navigate("/");
  }

  /**
   * Submits a new review for this book, then optimistically
   * appends it to local state.
   * Only called when reviewsAvailable is true
   * @param {Object} data - { rating, body } from ReviewForm
   */
  async function handleReviewSubmit(data) {
    const result = await createReview({ ...data, bookId: id });
    setReviews((prev) => [
      ...prev,
      { ...data, _id: result.insertedId, bookId: id, username: user.username },
    ]);
  }

  /**
   * Deletes a review by id and removes it from local state.
   * Only called when reviewsAvailable is true.
   * @param {string} reviewId - The _id of the review to delete
   */
  async function handleReviewDelete(reviewId) {
    await deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  }

  // Show status messages while loading or if the fetch errored
  if (loading) return <p className="bookdetails__status">Loading...</p>;
  if (error)
    return (
      <p className="bookdetails__status bookdetails__status--error">{error}</p>
    );
  if (!book) return <p className="bookdetails__status">Book not found.</p>;

  // True if the logged-in user is the seller — controls edit/delete visibility
  const isOwner = user && user.username === book.sellerId;

  // Average rating is only calculated when reviews loaded successfully
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bookdetails">
      {/* Back link returns the user to the full book catalog */}
      <Link to="/" className="bookdetails__back">
        ← Back to listings
      </Link>

      {/* Main listing card — book info, meta badges, and owner actions */}
      <div className="bookdetails__card">
        <div className="bookdetails__main">
          <h1 className="bookdetails__title">{book.title}</h1>
          <p className="bookdetails__author">by {book.author}</p>

          {/* Meta row — price, condition badge, and average rating (if available) */}
          <div className="bookdetails__meta">
            <span className="bookdetails__price">${book.price.toFixed(2)}</span>
            {/* Condition modifier class drives the colour of the badge */}
            <span
              className={`bookdetails__condition bookdetails__condition--${book.condition.toLowerCase().replace(" ", "-")}`}
            >
              {book.condition}
            </span>
            {/*only show average rating if reviews loaded successfully */}
            {avgRating && (
              <span className="bookdetails__rating">
                ★ {avgRating} ({reviews.length})
              </span>
            )}
          </div>

          {/* Optional seller description — omitted if empty */}
          {book.description && (
            <p className="bookdetails__description">{book.description}</p>
          )}

          {/* Edit and Delete controls — only visible to the listing's owner */}
          {isOwner && (
            <div className="bookdetails__actions">
              <Link
                to={`/edit/${id}`}
                className="bookdetails__btn bookdetails__btn--edit"
              >
                Edit Listing
              </Link>
              <button
                className="bookdetails__btn bookdetails__btn--delete"
                onClick={handleDelete}
              >
                Delete Listing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews section — hidden entirely if the reviews module is unavailable */}
      {reviewsAvailable ? (
        <section className="bookdetails__reviews">
          <h2 className="bookdetails__reviews-heading">
            Community Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviewsError ? (
            // Graceful fallback if the reviews API is down at runtime
            <p className="bookdetails__status">
              Reviews unavailable right now.
            </p>
          ) : (
            <>
              <ReviewList
                reviews={reviews}
                user={user}
                onDelete={handleReviewDelete}
              />
              {user ? (
                <ReviewForm onSubmit={handleReviewSubmit} />
              ) : (
                <p className="bookdetails__login-prompt">
                  <button
                    className="bookdetails__login-link"
                    onClick={() => {}}
                  >
                    Log in
                  </button>{" "}
                  to leave a review.
                </p>
              )}
            </>
          )}
        </section>
      ) : null}
    </div>
  );
}

BookDetails.propTypes = {
  user: PropTypes.shape({ username: PropTypes.string, id: PropTypes.string }),
};
