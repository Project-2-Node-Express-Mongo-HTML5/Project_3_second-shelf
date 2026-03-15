<<<<<<< HEAD
// components/BookCard/BookCard.jsx
// Compact summary card for a single book listing.
// Rendered as a grid item inside BookList on the Home page.
// Displays the title (as a link to BookDetails), author,
// condition badge, price, and a "View" button.

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./BookCard.css";

/**
 * BookCard component — summary tile for a single book listing.
 * @param {Object} props
 * @param {Object} props.book - The book document from the database
 * @param {string} props.book._id - MongoDB document id, used to build the detail link
 * @param {string} props.book.title - Book title
 * @param {string} props.book.author - Book author
 * @param {number} props.book.price - Listing price
 * @param {string} props.book.condition - One of: 'Like New', 'Good', 'Fair', 'Poor'
 */
export default function BookCard({ book }) {
  return (
    <article className="book-card">
      <div className="book-card__info">
        {/* Title links to the full BookDetails page for this listing */}
        <h3 className="book-card__title">
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </h3>

        <p className="book-card__author">{book.author}</p>

        {/* Condition badge — CSS class varies by condition for color coding */}
        <span
          className={`book-card__condition book-card__condition--${book.condition.toLowerCase().replace(" ", "-")}`}
        >
          {book.condition}
        </span>
      </div>

      <div className="book-card__footer">
        <span className="book-card__price">${book.price.toFixed(2)}</span>
        {/* View button navigates to the full listing detail page */}
        <Link to={`/books/${book._id}`} className="book-card__btn">
          View
        </Link>
      </div>
=======
import PropTypes from "prop-types";
import "./BookCard.css";

function BookCard({ book }) {
  return (
    <article className="book-card">
      <h3>{book.title}</h3>

      <p>
        <strong>Author:</strong> {book.author}
      </p>

      <p>
        <strong>Price:</strong> ${book.price}
      </p>

      <p>
        <strong>Condition:</strong> {book.condition}
      </p>

      <button type="button">View Details</button>
>>>>>>> 8804c2469e0ac0d2b96aa06e113be1717223d4fd
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
<<<<<<< HEAD
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    condition: PropTypes.string.isRequired,
  }).isRequired,
};
=======
    _id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    price: PropTypes.number,
    condition: PropTypes.string
  }).isRequired
};

export default BookCard;
>>>>>>> 8804c2469e0ac0d2b96aa06e113be1717223d4fd
