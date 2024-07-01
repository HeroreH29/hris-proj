import { Link } from "react-router-dom";
import React from "react";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">HRIS Project</span>
        </h1>
      </header>
      <main className="public__main">
        <p>Click the link below to login</p>
        <Link to="/login">Employee Login</Link>
      </main>
      <footer>
        Via Mare 2023
        <br />
        HL 2023
      </footer>
    </section>
  );
  return content;
};

export default Public;
