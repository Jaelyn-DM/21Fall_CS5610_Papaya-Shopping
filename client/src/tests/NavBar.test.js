import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
let mockUser;

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: mockUser,
    };
  },
}));

test("render logged in", () => {
  mockUser = {
    nickname: "user1",
    email: "user1@123.com",
    picture: "user image",
  };
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Navbar />
    </MemoryRouter>
  );
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("user1")).toBeInTheDocument();
  expect(screen.getByText("Cart")).toBeInTheDocument();
  expect(screen.getByText("New Item")).toBeInTheDocument();
});

test("render not logged in", () => {
  mockUser = undefined;
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Login/Sign up")).toBeInTheDocument();
  expect(screen.getByText("Cart")).toBeInTheDocument();
});
