import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { expect } from "chai";
import nock from "nock";
import fetch from "isomorphic-fetch";
import catsReducer, { fetchCats } from "../features/cats/catsSlice";

// change to redux thunk
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const catPics = [
  { url: "www.example.com/cat1" },
  { url: "www.example.com/cat2" },
];

describe("async actions", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('uses redux and thunk to create an action object with type of "cats/catsLoaded" and a payload of cat images', async () => {
    window.fetch = fetch;

    nock("https://learn-co-curriculum.github.io")
      .get("/cat-api/cats.json")
      .reply(200, {
        images: [
          { url: "www.example.com/cat1" },
          { url: "www.example.com/cat2" },
        ],
      });

    const expectedActions = [
      { type: "cats/catsLoading" },
      { type: "cats/catsLoaded", payload: catPics },
    ];

    const store = mockStore({});
    await store.dispatch(fetchCats());
    await sleep(2000);
    expect(store.getActions()).to.eql(expectedActions);
  });
});

describe("catsReducer()", () => {
  it("should return the initial state", () => {
    expect(catsReducer(undefined, {})).to.eql({ status: "idle", entities: [] });
  });

  it("should handle the 'cats/catsLoaded' action", () => {
    const catPics = [
      { url: "www.example.com/cat1" },
      { url: "www.example.com/cat2" },
    ];
    expect(
      catsReducer([], {
        type: "cats/catsLoaded",
        payload: catPics,
      })
    ).to.eql({ status: "idle", cats: catPics });
  });
});
