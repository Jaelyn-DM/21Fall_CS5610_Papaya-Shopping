import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";
import userEvent from "@testing-library/user-event";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

const mockLogOut = jest.fn();
const mockGetWeather = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: {
        nickname: "user1",
        email: "user1@123.com",
        picture: "user image",
      },
      logout: mockLogOut,
    };
  },
}));

fetch.mockResponse(
  JSON.stringify({
    current: {
      temp: 10,
      feels_like: 5,
      pressure: 1000,
      weather: [
        {
          main: "Clouds",
        },
      ],
    },
  })
);

test("renders user profile", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );

  expect(screen.getByText("Name: user1")).toBeInTheDocument();
  expect(screen.getByText("Email: user1@123.com")).toBeInTheDocument();
  expect(screen.getByAltText("user image")).toBeInTheDocument();
});

test("render log out", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );
  const logOutButton = screen.getByText("LogOut");
  userEvent.click(logOutButton);

  expect(mockLogOut).toHaveBeenCalled();
});

// ??

test("render get weather", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );

  const getWeatherButton = screen.getByText("Get Weather");
  userEvent.click(getWeatherButton);

  const mockWeather = await screen.findByText("Weather: Clouds");
  const mockTemp = await screen.findByText("Temp: 10");
  const mockFeelsLike = await screen.findByText("Feels Like: 5");
  const mockPressure = await screen.findByText("Pressure: 1000");
});
