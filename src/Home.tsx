import React from 'react';
import { Jumbotron } from 'reactstrap';
import { Link } from 'react-router-dom';
import SearchPage from './SearchPage';

const Home = () => (
  <Jumbotron>
    <h1 className="display-4">Hello, world!</h1>
    <p className="lead">Welcome to node media server!</p>
    <SearchPage />
  </Jumbotron>
);

export default Home;
