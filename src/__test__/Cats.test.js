import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { configure, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import Cats from "../features/cats/Cats";
import { Provider } from "react-redux";
import catsReducer from "../features/cats/catsSlice";

configure({ adapter: new Adapter() });

describe("<Cats />", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = createStore(catsReducer, applyMiddleware(thunk));
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);
    wrapper = mount(
      <Provider store={store}>
        <Cats />
      </Provider>
    );
  });

  it("should dispatch the 'cats/catsLoading' action", () => {
    expect(store.dispatch).toHaveBeenCalledWith({ type: "cats/catsLoading" });
  });
});
