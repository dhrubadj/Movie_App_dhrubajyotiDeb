import './MovieStore.css';


const MovieStore = ({ title, genre, poster, imdbRating }) => {
  return (
    <div className="store-container">
      <div className="image-container">
        <img className="store-img" src={poster} alt={title} />
      </div>
      <div className="movie-details">
        <div>
          <span className="title">{title}</span>
        </div>
        <div>
              <span className="genre">Genre: {genre}</span>
            </div>
        <div>
          <span className="ratings">IMDB Rating: {imdbRating}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieStore;