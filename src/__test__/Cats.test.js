import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import catsReducer from "../features/cats/catsSlice";
import Cats from "../features/cats/Cats";

const catPics = [
  { id: 1, url: "www.example.com/cat1" },
  { id: 2, url: "www.example.com/cat2" },
];

beforeEach(() => {
  const store = createStore(catsReducer, applyMiddleware(thunk));
  store.dispatch({ type: "cats/catsLoaded", payload: catPics });

  render(
    <Provider store={store}>
      <Cats />
    </Provider>
  );
});

test("passes catPics from the store down as a prop to CatList", () => {
  expect(screen.queryAllByAltText("cat")).toHaveLength(2);
});
