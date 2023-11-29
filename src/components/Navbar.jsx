import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/Home">Home</Link>
      <br />
      <Link to="/Questionario">Questionario</Link>
    </nav>
  );
};

export default Navbar;
