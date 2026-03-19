import { useEffect, useState } from "react";
import BookList from "../../components/BookList/BookList";
import {
  fetchBooks,
  fetchBooksSortedByRating
} from "../../api/books";
import "./Home.css";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortMode, setSortMode] = useState("default");

  useEffect(() => {
    loadBooks();
  }, [sortMode]);

  async function loadBooks() {
    setLoading(true);
    setError("");

    try {
      const data =
        sortMode === "rating"
          ? await fetchBooksSortedByRating()
          : await fetchBooks();

      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleSort() {
    setSortMode((prev) =>
      prev === "rating" ? "default" : "rating"
    );
  }

  return (
    <main className="home-page">
      <h1>Second-Shelf</h1>
      <p>Discover affordable used books and read community reviews.</p>

      <button className="sort-button" onClick={toggleSort}>
        {sortMode === "rating"
          ? "Show Default Order"
          : "Sort by Highest Rating"}
      </button>

      <BookList books={books} loading={loading} error={error} />
    </main>
  );
}

export default Home;