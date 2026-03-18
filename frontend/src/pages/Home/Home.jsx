// import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router";
// // import { fetchBooks } from "../../api/books";
// import BookList from "../../components/BookList/BookList";
// import "./Home.css";

// function Home() {
//   // const [books, setBooks] = useState([]);
//   // const [error, setError] = useState("");
//   // const navigate = useNavigate();

//   useEffect(() => {
//     // async function loadBooks() {
//     //   try {
//     //     const data = await fetchBooks();
//     //     setBooks(data);
//     //   } catch (err) {
//     //     setError(err.message);
//     //   }
//     // }
//     // loadBooks();
//   }, []);

//   //   function handleSelect(id) {
//   //     navigate(`/books/${id}`);
//   //   }

//   return (
//     <main className="home-page">
//       <h1>Second-Shelf</h1>
//       <p>Discover affordable used books and read community reviews.</p>
//       {/* {error && <p>{error}</p>} */}
//       {/* <BookList books={books} onSelect={handleSelect} /> */}
//       <BookList />
//     </main>
//   );
// }

// export default Home;

import { useEffect, useState } from "react";
import { fetchBooks } from "../../api/books.js";
import BookList from "../../components/BookList/BookList.jsx";
import "./Home.css";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <main className="home-page">
      <h1>Second-Shelf</h1>
      <p>Discover affordable used books and read community reviews.</p>
      <BookList books={books} loading={loading} error={error} />
    </main>
  );
}

export default Home;