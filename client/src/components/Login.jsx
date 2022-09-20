import React from "react";
import Navbar from "./Navbar";
import { useAuth0 } from "@auth0/auth0-react";

export default function Login() {
  const { loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      Login Page
      <Navbar />
      <form>
        <h2>Login</h2>
        <input
          // type="email"
          // name="username"
          required
          placeholder="Username"
          // value={user.email}
          // onChange={onChangeInput}
        />

        <input
          type="password"
          name="password"
          required
          // autoComplete="on"
          placeholder="Password"
          // value={user.password}
          // onChange={onChangeInput}
        />

        <div className="row">
          <button type="submit">Login</button>
          {/* <Link to="/register">Register</Link> */}
        </div>
      </form>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      <button
        className="exit-button"
        onClick={() => logout({ returnTo: window.location.origin })}
      >
        LogOut
      </button>
    </div>
  );
}
