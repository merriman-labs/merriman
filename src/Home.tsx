import React from 'react';
import { Jumbotron } from 'reactstrap';
import { Link } from 'react-router-dom';

const Home = () => (
  <Jumbotron>
    <h1 className="display-4">Hello, world!</h1>
    <p className="lead">Welcome to node media server!</p>
    <hr className="my-4" />
    <p>Choose from the following sections</p>
    <Link className="btn btn-primary btn-lg" to="/videos" role="button">
      Video Libraries
    </Link>
  </Jumbotron>
);

export default Home;
