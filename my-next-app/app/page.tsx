"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
 
  // Fetch books from Django backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/restapp/api/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Books from API:", data);
        setBooks(data);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📚 Book Library</h1>

      {/* BOOK LIST */}
      <section>
        <h2>All Books</h2>
        <ul>
          {books.length === 0 ? (
            <li>No books found</li>
          ) : (
            books.map((book, index) => (
              <li
                key={book.id ?? book.isbn ?? index} // 🔑 handle missing id
              >
                <strong>{book.title ?? "No Title"}</strong> —{" "}
                {book.isbn ?? "No ISBN"}
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
