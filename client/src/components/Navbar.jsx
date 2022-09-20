import React from "react";
import "../style/Navbar.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
  const { loginWithRedirect, user } = useAuth0();

  function userLogin() {
    loginWithRedirect();
  }

  return (
    <header className="navbar">
      <ul>
        <li className="">
          <div className="homepage link">
            <Link to={`/`}>Home</Link>
          </div>
        </li>
        <li>
          <div className="new-ltem link">
            {user ? <Link to={`/newitem`}>New Item</Link> : <hr />}
          </div>
        </li>
        <li>
          <div className="user link">
            {user ? (
              <Link to={`/profile`}>{user.nickname}</Link>
            ) : (
              <Link onClick={() => userLogin()} to="/verify-user">
                Login/Sign up
              </Link>
            )}
          </div>
        </li>
        <li>
          <div className="cart link">
            <Link
              to={{
                pathname: `/cart`,
                state: user,
              }}
            >
              Cart
            </Link>
          </div>
        </li>
      </ul>
    </header>
  );
}
