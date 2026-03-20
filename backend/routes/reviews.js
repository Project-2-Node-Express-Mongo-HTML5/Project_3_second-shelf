import { Router } from "express";
import {
  getReviewsByBookId,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../data/reviews.js";
import { requireAuth } from "../middleware/auth.js";
import { validateReview } from "../utils/validation.js";

const router = Router();

/**
 * GET /api/reviews/book/:bookId
 * Returns all reviews for a specific book
 * Public route
 */
router.get("/book/:bookId", async (req, res) => {
  try {
    const reviews = await getReviewsByBookId(req.params.bookId);
    return res.json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

/**
 * POST /api/reviews
 * Creates a new review for a book
 * Protected route
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;

    const validationError = validateReview({ bookId, rating });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await createReview({
      bookId,
      rating: Number(rating),
      reviewText: reviewText || "",
      userId: req.user.id,
      userName: req.user.name,
    });

    return res.status(201).json({
      message: "Review created",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create review" });
  }
});

/**
 * PUT /api/reviews/:id
 * Updates an existing review
 * Only the review owner can update it
 * Protected route
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const review = await getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const validationError = validateReview({
      bookId: review.bookId.toString(),
      rating,
    });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    await updateReview(req.params.id, {
      rating: Number(rating),
      reviewText: reviewText || "",
    });

    return res.json({ message: "Review updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update review" });
  }
});

/**
 * DELETE /api/reviews/:id
 * Deletes an existing review
 * Only the review owner can delete it
 * Protected route
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await deleteReview(req.params.id);

    return res.json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
