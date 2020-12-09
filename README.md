# Async Redux Lab: Pictures of Cats

Who doesn't want to look at pictures of cats? Well, now you can look at up to 20
pictures of cats with our new React + Redux app. All you have to do is...build
it yourself! In this lab, you are tasked with building out a React + Redux app
that fetches data using Thunk. Since this is a pretty specific task, we'll walk
through it a bit in this Readme. Let's get started!

## Objectives

1. Use `redux-thunk` middleware to make an asynchronous web request in an action
   creator function
2. Dispatch an action from the `useEffect` hook.

## Instructions

We'll be working in two components: `Cats` and `CatList`. The `Cats` component
will be responsible for getting data from the state via `useSelector`. `Cats`
will render a child component, `CatList`, which will receive the list of cat
pics from `Cats` and render them in a series of `<img>` tags.

We'll be getting our cat pics from a real API! Sort of. We made a very special
API just for you to use with this lab (aren't you so lucky). We've got a GitHub
repository set up with GitHub pages to deliver a JSON file. If you point your
browser to
[https://learn-co-curriculum.github.io/cat-api/cats.json][static json] you
should see a JSON collection of 20 cat image objects. Now that we have a source
for the data, we'll need to set up Redux and Thunk.

### Part 1: Set Up the Store and Reducer and Action Creator

#### Configuring the Store

First things first, use Redux's `createStore()` function to initialize your
store in `src/index.js`. To get Redux configured, we'll need to import
`createStore` from `redux` and `Provider` from `react-redux`. We'll also need to
import a reducer. We haven't written it yet, but let's import from
`src/reducers/catsReducer.js`. We pass this reducer into `createStore`,
assigning the return value to `store`. Then, we'll wrap the `App`
component in `Provider` and pass `store` to it:

```js
// ./src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import catsReducer from "./features/cats/catsSlice.js";

const store = createStore(catsReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

This is the Redux configuration we've seen previously. To implement Thunk, we'll
need to also import `applyMiddleware` from `redux` and `thunk` from
`redux-thunk` (package already included in `package.json`). We pass `thunk` into
`applyMiddleware()`, and pass _that_ in as the second argument for
`createStore`:

```js
// ./src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import catsReducer from "./features/cats/catsSlice.js";

const store = createStore(catsReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

We can also add the Redux DevTools:

```js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import catsReducer from "./features/cats/catsSlice.js";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(catsReducer, composedEnhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

We have the setup for connecting Redux to the React app, and we've configured
`redux-think`. Now, we need to build out the reducer.

#### Setting up the Reducer

For our `catsReducer()` function in `./src/features/cats/catsSlice.js`, we'll want
to set up a switch that handles two action types, `'cats/loading'` and
`'cats/loaded'`.

```js
// ./src/features/cats/catsSlice.js
const initialState = {
  entities: [], // array of cats
  status: "idle", // loading state
};

export default function catsReducer(state = initialState, action) {
  switch (action.type) {
    case "cats/loading":
      return {
        ...state,
        status: "loading",
      };
    case "cats/loaded":
      return {
        ...state,
        entities: action.payload,
        status: "idle",
      };
    default:
      return state;
  }
}
```

We also set up the initial state here. We can see that in the `'cats/loading'`
case, `state.status` becomes `'loading'`, while the rest of `state` is just copied
to a new object. In the `'cats/loaded'` case, `state.status` becomes `'idle'`,
and `state.entities` is set to the `action.payload` array.

#### Setting up the Action Creator

Now, define your action creator function, `fetchCats()` in
`./src/features/cats/catsSlice.js`. Remember, `redux-thunk` alters the behavior of
action creator functions, allowing us to _return_ a function that takes in
`dispatch`. Inside this function, we can execute asynchronous code, and, once
resolved, we can use `dispatch` to update our store with the remote data.

The `fetchCats()` action creator should use `fetch()` to make the web request for
your cat pic JSON. It should use a `.then()` function to parse the JSON of the
response to this request, and another `.then()` function chained on that to grab
the actual collection of cat pic image objects. Something like:

```js
fetch("https://learn-co-curriculum.github.io/cat-api/cats.json")
  .then((response) => {
    return response.json();
  })
  .then((responseJSON) => {
    // instead of logging here, call dispatch and send the cat JSON data to your store
    console.log(responseJSON.images);
  });
```

Remember, we built the `catsReducer` to look for two action types. The first, `'cats/loading'`, should be dispatched _before_ the `fetch()`
request is called. The other type, `'cats/loaded'`, should be dispatched
along with a payload of the cats JSON collection. Judging by the case
for `'cats/loaded'`:

```js
...
case 'cats/loaded':
  return {
    ...state,
    entities: action.payload,
    status: 'idle'
  }
...
```

We can see that the reducer is expecting an action that looks like this:

```js
{
  type: 'cats/loaded',
  payload: [] // cat data from the cat API
}
```

Putting what we know together, we can start by writing the basic function definition:

```js
export function fetchCats() {
  return function (dispatch) {};
}
```

The first thing we want to do in this function is send a `dispatch` to indicate
we're loading (fetching) the cats:

```js
export function fetchCats() {
  return function (dispatch) {
    dispatch({ type: "cats/loading" });
  };
}
```

Then, we call `fetch()`, dispatching the returned data:

```js
export function fetchCats() {
  return function (dispatch) {
    dispatch({ type: "cats/loading" });
    fetch("https://learn-co-curriculum.github.io/cat-api/cats.json")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "cats/loaded", payload: data.images });
      });
  };
}
```

In this case, we just need the data inside `images`, so we can pass that
directly when calling the second `dispatch`.

### Part 2: Build the Cats Component

Now that our reducer and action creators are set up, it is time to display the
retrieved data in our app. First, let's set up the `Cats` component to read from
our Redux store. We'll do this by first importing `useSelector` from
`react-redux`. Then, we'll call `useSelector` in our component and write a
callback function to access our Redux store state.

```js
// src/features/cats/Cats.js
import React from "react";
import { useSelector } from "react-redux";

function Cats() {
  const catPics = useSelector((state) => state.entities);

  console.log(catPics);
  return (
    <div className="App">
      <h1>CatBook</h1>
      {/* missing component */}
    </div>
  );
}

export default Cats;
```

Using the above code, you should see an empty array logged in the console when
the app is launched. This is the empty `entities` array in our initial state,
now mapped to `catPics` in `Cats`.

#### Dispatching the `fetchCats` Action

This is something new, so read carefully...

You might be wondering when/where we will actually dispatch our `fetchCats`
action to get all the cat pics into state. We want our cat pics to be fetched
when the `Cats` component is first loaded up. So, we'll enact a common pattern
in which we use a side effect to fetch the cat pics.

#### The useEffect function

When we use `useEffect()` in our component, the callback function we provide
will _always be called automatically every time our component is rendered_. We
can also provide an empty dependencies array to tell React to only run the
callback the first time our component is rendered. This is the perfect place to
go and get the cat pics.

We need to import `useEffect`, then define our `useEffect()` callback function
so that it calls our `fetchCats()` action creator. We also need to import
`useDispatch()` function to make `dispatch()` available.

```js
// src/features/cats/Cats.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCats } from "./catsSlice";

function Cats() {
  const catPics = useSelector((state) => state.entities);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCats());
  }, []);

  console.log(catPics);
  return (
    <div className="App">
      <h1>CatBook</h1>
      {/* missing component */}
    </div>
  );
}

export default Cats;
```

Ah! If we check the console, we'll see that `catPics` is set to `[]` on the
first render, but on the second, we see an array of 20 cat objects! Notice that
we still can call `dispatch` here, even though we're _also_ calling `dispatch`
in our action creator.

Once you successfully fetch cats, put them in state, grab them from state and
pass them to `Cats` using `useSelector` prop, you're ready to build the
`CatList` component.

#### The CatList Component

We will leave the final task to you - building the `CatList` component. Your
container component, `Cats`, should render the`CatList` component. `Cats` will
pass `catPics` down to `CatList` as a prop. `CatList` should iterate over the
cat pics and display each cat pic in an image URL. Remember to use `debugger` to
take a look at the `catPics` collection and determine which property of each
`catPic` object you will use to populate your `<img>` tag and render the image.
In order to get the tests to pass, you will need to wrap your `<img>` tags in a
`<div>` tag or something similar.

## Conclusion

With all tests passing, you should have a working example of a React + Redux +
Thunk application. Of the two components, one is purely presentational, just like a
regular React app. The other connects to Redux, but beyond that, it's not any
different than a regular React + Redux app. Thunk lets us augment our action
creators and handle our asynchronous requests without requiring any major
changes to other parts of the application.

## Bonus

While we have a working application, there is one more thing we did not fully
implement: handling loading. If you've followed the instructions, you should
have access to `loading` in your `Cats` component by calling `useSelector`.

While content is being fetched, it would be nice to show the user something -
often, spinning icons are used, but even just a simple 'Loading...' is enough to
show to the user that content is on the way.

How might we use the value of `loading` to implement a loading message until the
cat images arrive?

[static json]: https://learn-co-curriculum.github.io/cat-api/cats.json
