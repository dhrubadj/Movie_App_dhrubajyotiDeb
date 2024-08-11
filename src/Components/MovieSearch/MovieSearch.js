import { useState } from "react";
import React from "react";
import axios from "axios";
import './MovieSearch.css'


const imdbIDs = [
  "tt0111161", "tt0068646", "tt0071562", "tt0468569", "tt0050083", "tt0108052",
  "tt0167260", "tt0110912", "tt0060196", "tt0137523", "tt0120737", "tt0109830",
  "tt1375666", "tt0080684", "tt0167261", "tt0073486", "tt0099685", "tt0133093",
  "tt0047478", "tt0076759", "tt0317248", "tt0114369", "tt0118799", "tt0102926",
  "tt0038650", "tt0078788", "tt4633694", "tt0110413", "tt0120815", "tt0120689",
  "tt0103064", "tt0082971", "tt0047396", "tt0253474", "tt0172495", "tt0120586",
  "tt0075314", "tt0095765", "tt0034583", "tt0407887", "tt0482571", "tt0054215",
  "tt0043014", "tt0057012", "tt4154756", "tt0051201", "tt0088763", "tt0119698",
  "tt0112573", "tt0056172", "tt0064116", "tt0050825", "tt0105236", "tt0095327",
  "tt0022100", "tt0086190", "tt0211915", "tt0033467", "tt0093058", "tt0089881",
  "tt0066921", "tt0081505", "tt0052618", "tt0172493", "tt0027977", "tt2096673",
  "tt0120735", "tt0245429", "tt0052357", "tt0036775", "tt0078748", "tt0090605",
  "tt0021749", "tt0078788", "tt0107290", "tt0073195", "tt0114814", "tt0087843",
  "tt0015864", "tt0113277", "tt0169547", "tt0062622", "tt0045152", "tt0068646",
  "tt0105695", "tt0361748", "tt0042876", "tt0032138", "tt0020629", "tt0032553",
  "tt0110413", "tt0053604", "tt0025316", "tt0082096", "tt0031679", "tt0017925",
  "tt0120382", "tt0120815", "tt0041959", "tt0114814", "tt0050986", "tt0477348"
];

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
                  const matchingMovies = await searchByRating(searchKey);
                  if (matchingMovies.length > 0) {
                    setMovies(matchingMovies);
                  } else {
                    setError("No movies found");
                    setMovies([]);
                  }
                  setSearchKey("");
                }
              } catch (error) {
                setError("Error searching for movies. Please try again later.");
              } finally {
                setLoading(false);
              }
            };
          
            const searchByRating = async (rating) => {
              const matchingMovies = [];
              try {
                const detailedMovies = await Promise.all(
                  imdbIDs.map(async (imdbID) => {
                    try {
                      const { data } = await axios.get(
                        `https://www.omdbapi.com/?i=${imdbID}&apikey=5baa7886`
                      );
                      if (data.imdbRating === rating) {
                        const { Title, Genre, imdbRating, Poster } = data;
                        return {
                          Title,
                          imdbID,
                          Poster,
                          Genre: Genre || "N/A",
                          imdbRating: imdbRating || "N/A",
                        };
                      }
                      return null;
                    } catch (error) {
                      console.error("Error fetching movie details:", error);
                      return null;
                    }
                  })
                );
                detailedMovies.forEach((movie) => {
                  if (movie) matchingMovies.push(movie);
                });
              } catch (error) {
                console.error("Error searching by rating:", error);
              }
              return matchingMovies;
             // setSearchKey("");
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
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default MovieSearch;