import { waitFor } from "@testing-library/react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import fetchMock from "fetch-mock";
import catsReducer, { fetchCats } from "../features/cats/catsSlice";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const catPics = [
  { url: "www.example.com/cat1" },
  { url: "www.example.com/cat2" },
];

describe("async actions", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test('creates an async action object with type of "cats/catsLoaded" and a payload of cat images', async () => {
    fetchMock.getOnce(
      "https://learn-co-curriculum.github.io/cat-api/cats.json",
      {
        body: {
          images: catPics,
        },
        headers: { "content-type": "application/json" },
      }
    );

    const expectedActions = [
      { type: "cats/catsLoading" },
      { type: "cats/catsLoaded", payload: catPics },
    ];

    const store = mockStore({});
    await store.dispatch(fetchCats());

    waitFor(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe("catsReducer()", () => {
  test("returns the initial state", () => {
    expect(catsReducer(undefined, {})).toEqual({
      status: "idle",
      entities: [],
    });
  });

  test("handles the 'cats/catsLoading' action", () => {
    expect(
      catsReducer(undefined, {
        type: "cats/catsLoading",
      })
    ).toEqual({ status: "loading", entities: [] });
  });

  test("handles the 'cats/catsLoaded' action", () => {
    expect(
      catsReducer(undefined, {
        type: "cats/catsLoaded",
        payload: catPics,
      })
    ).toEqual({ status: "idle", entities: catPics });
  });
});
