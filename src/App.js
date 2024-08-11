import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
//import { MovieStore } from "./Components/MovieStore/MovieStore";
import MovieProvider from './Components/MovieProvider/MovieProvider';

function App() {


 
  return (
    <div className="App">
      <h1>Movies</h1>
      <main className='main'>
      <MovieProvider />
      </main>
    </div>
  );
}

export default App;