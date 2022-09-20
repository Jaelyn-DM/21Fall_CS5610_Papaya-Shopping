import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import ItemDetail from "../components/ItemDetail";
import React from "react";
enableFetchMocks();

const mockAddToCart = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
    };
  },
}));

fetch.mockResponse(
  JSON.stringify({
    id: 1,
    title: "item",
    price: 200,
    image: "https://picsum.photos/id/1",
    description: "description",
  })
);

test("render item detail", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <ItemDetail />
    </MemoryRouter>
  );
  const mockTitle = await screen.findByText("Title: item");
  const mockPrice = await screen.findByText("Price: 200");
  const mockDescription = await screen.findByText("Description: description");
  const mockImage = await screen.findByAltText("random image");
  expect(mockTitle).toBeInTheDocument();
  expect(mockPrice).toBeInTheDocument();
  expect(mockDescription).toBeInTheDocument();
  expect(mockImage).toBeInTheDocument();
});
