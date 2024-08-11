import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieStore from '../MovieStore/MovieStore';
import MovieSearch from '../MovieSearch/MovieSearch';

const preloadedMovies = [
  {
    Title: "The Shawshank Redemption",
    Genre: "Drama, Crime",
    Poster: "https://m.media-amazon.com/images/M/MV5BOWJlYjkzNDgtZDI1NS00YTkwLTgxNGItZDYzZDcxNWRjNDA2XkEyXkFqcGdeQXVyMTQyMTMwOTk0._V1_QL75_UX1230_.jpg",
    imdbRating: "9.3",
    imdbID: "tt0111161"
  },
  {
    Title: "Inception",
    Genre: "Action, Adventure, Sci-Fi",
    Poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRkfh9meRvbPnTr5ag0P8b0VQ10ZEU0w_aJDt0mdPXlgiodGg5ej2KHynXjqkXNWxB8E8&usqp=CAU",
    imdbRating: "8.8",
    imdbID: "tt1375666"
  },
  {
    Title: "The Matrix",
    Genre: "Action, Sci-Fi",
    Poster: "https://c8.alamy.com/comp/2JH2N9A/pantolianofishburnereevesposter-the-matrix-1999-2JH2N9A.jpg",
    imdbRating: "8.7",
    imdbID: "tt0133093"
  },
  {
    Title: "Interstellar",
    Genre: "Adventure, Drama, Sci-Fi",
    Poster: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    imdbRating: "8.6",
    imdbID: "tt0816692"
  },
  {
    Title: "Pulp Fiction",
    Genre: "Crime, Drama",
    Poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlgWSFkot6KbScw9UwSKEO3le17mwTjj0Tzw&s",
    imdbRating: "8.9",
    imdbID: "tt0110912"
  }
];


const MovieProvider = () => {
  const [movies, setMovies] = useState(preloadedMovies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const getMovies = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://www.omdbapi.com/?i=tt3896198&apikey=5baa7886"); 
      console.log("API Response:", data);
      
      const apiMoviesArray = Array.isArray(data) ? data : [data];
      setMovies([...preloadedMovies, ...apiMoviesArray]);
    } catch (err) {
      setError("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    console.log('Movies updated:', movies);
  }, [movies]);

  const handleSearch = (searchResults) => {
    setIsSearchActive(true);
    setMovies(searchResults);
  };

  return (
    <div className="movie-provider">
    <MovieSearch setMovies={setMovies} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length > 0 ? (
        <div className="movie-list">  
        {movies.map((movie) => (
            <MovieStore
              key={movie.imdbID} 
              title={movie.Title}
             genre={movie.Genre}
              poster={movie.Poster}
              imdbRating={movie.imdbRating}
            />
          ))}
        </div>
      ) : (
        !loading && !error && <p>No movies available</p>
      )}
    </div>
  );
};

export default MovieProvider;