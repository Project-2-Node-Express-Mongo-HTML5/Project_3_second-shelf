import { ObjectId } from "mongodb";
import { getDb } from "../config/mongo.js";

const COL = "reviews";

export function getReviewsByBookId(bookId) {
  return getDb()
    .collection(COL)
    .find({ bookId: new ObjectId(bookId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export function getReviewById(id) {
  return getDb()
    .collection(COL)
    .findOne({ _id: new ObjectId(id) });
}

export function createReview(review) {
  return getDb()
    .collection(COL)
    .insertOne({
      ...review,
      bookId: new ObjectId(review.bookId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
}

export function updateReview(id, updates) {
  return getDb()
    .collection(COL)
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
}

export function deleteReview(id) {
  return getDb()
    .collection(COL)
    .deleteOne({ _id: new ObjectId(id) });
}

export function getAverageRatingByBookId(bookId) {
  return getDb()
    .collection(COL)
    .aggregate([
      {
        $match: {
          bookId: new ObjectId(bookId),
        },
      },
      {
        $group: {
          _id: "$bookId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    .toArray();
}
