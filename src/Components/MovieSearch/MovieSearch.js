import { useState } from "react";
import React from "react";
import axios from "axios";
import './MovieSearch.css'

const MovieSearch = ({ setMovies }) => {
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchKey.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `https://www.omdbapi.com/?s=${searchKey}&apikey=5baa7886`
      );
      if (data.Response === "True") {
        const movies = data.Search;
                const detailedMovies = await Promise.all(
                    movies.map(async (movie) => {
                      try {
                       
                        const { data: details } = await axios.get(
                          `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=5baa7886`
                        );
                        const { Genre, imdbRating } = details;
                        return {
                          Title: movie.Title,
                          imdbID: movie.imdbID,
                          Poster: movie.Poster,
                          Genre: Genre || "N/A",  
                          imdbRating: imdbRating || "N/A", 
                        };
                      } catch (error) {
                        console.error("Error in getting movie details:", error);
                        return {
                          Title: movie.Title,
                          imdbID: movie.imdbID,
                          Poster: movie.Poster,
                          Genre: "N/A",
                          imdbRating: "N/A",
                        };
                      }
                    })
                  );
          
                  setMovies(detailedMovies);
                  setSearchKey("");
                } else {
        setError("No movies found");
        setMovies([]);
      }
    } catch (error) {
      setError("Error searching for movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        placeholder="Search for a movie..."
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Searching...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default MovieSearch;