import { NavLink } from "react-router-dom";
import "./Error.css"

export const Error = () => {
    return (
    <>
      <section id="error-page">
        <div className=" content">
          <h2 className="header">404</h2>
          <div className="content-text">
            <h4>Sorry! Page not found</h4>
            <p>
              Oops! It seems like the page you're trying to access doesn't exist.
              If you believe there's an issue, feel free to report it, and we'll
              look into it.
            </p>
            <div className="btns">
              <NavLink to="/" className="btn btn--primary">return home</NavLink>
              <NavLink to="/contact" className="btn btn--primary">report problem</NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}