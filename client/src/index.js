import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Cart from "./components/Cart";
import ItemDetail from "./components/ItemDetail";
import NewItem from "./components/NewItem";
import VerifyUser from "./components/VerifyUser";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";

const requestedScopes = [
  "read:item",
  "read:user",
  "edit:item",
  "edit:user",
  "delete:item",
  "delete:user",
  "write:user",
  "write:item",
];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-pye9-05m.us.auth0.com"
      clientId="Y4QnReOogA250h9YzqE6vZFokJgcCQAH"
      redirectUri={window.location.origin + "/verify-user"}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope={requestedScopes.join(" ")}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route
              path="newitem"
              element={
                <RequireAuth>
                  <NewItem />
                </RequireAuth>
              }
            />
            <Route path="/" element={<App />} />
            <Route path="profile" element={<Profile />} />

            <Route path="item/detail/:itemId" element={<ItemDetail />} />
            <Route
              path="cart"
              element={
                <RequireAuth>
                  <Cart />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
