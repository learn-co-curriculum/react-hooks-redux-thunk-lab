# Async Redux Lab: Pictures of Cats

Who doesn't want to look at pictures of cats? Well, now you can look at up to 20
pictures of cats with our new React + Redux app. All you have to do is...build
it yourself! Let's get started.


## Objectives

1. Use Redux-Thunk middleware to make an asynchronous web request in an action creator function
2. Dispatch an action from the `componentDidMount` lifecycle method.

## Instructions

We'll build out our app following the **container pattern**. We'll have one
top-level component, `App`, that connects to the store and gets data from the
state via `mapStateToProps`. `App` will render a child presentational component,
`CatList`, which will receive the list of cat pics from `App` and render them in
a series of `<img>` tags.

We'll be getting our cat pics from a real API! Sort of. We made a very special
API just for you to use with this lab (aren't you so lucky). Clone down [this
repo](https://github.com/learn-co-curriculum/cat-api), run `npm install` and
`npm start`. If you point your browser to `http://localhost:4000/db` you should
see a JSON collection of 20 cat image objects.

Our action creator function will be making a request to
`http://localhost:4000/db` to receive these cat images.

#### Part 1: Set Up the Store and Reducer and Action Creator

First things first, use Redux's `createStore` function to initialize your store
in `src/index.js`. Define your `rootReducer` in `reducers/index.js` to use the
`combineReducers` function with your `catsReducer`.

Once you initialize your store with the reducer and middleware, make sure you
pass it to the `<Provider>` component and wrap your `<App>` component in the
`<Provider>` in `src/index.js`.

Define your `catsReducer` in `src/reducers/cats_reducer`. Your `catsReducer`
should respond to two actions with types of  `'LOADING_CATS'` and a `'FETCH_CATS'` respectively.

Define your action creator function, `fetchCats` in `src/actions/catActions`.
This action should use `fetch` to make the web request for your cat pic JSON. It
should use a `then` function to parse the JSON of the response to this request,
and another `.then` function chained on that to grab the actual collection of
cat pic image objects. Something like:

```js
fetch('http://localhost:4000/db').then(response => {
  return response.json()
}).then(responseJSON => {
  return responseJSON.images
})
```

Save the results of this `fetch` request to a `const`, `cats`, and make sure
your action creator function returns an object with a type of `'FETCH_CATS'` and
a payload of the `cats` collection.

#### Part 2: Build the Container Component

Your `App` component should use `connect` and `mapStateToProps` to set a prop of
`catPics` to the cats collection in state.

#### Dispatching the `fetchCats` action

This is something new, so read carefully...

You might be wondering when/where we will actually dispatch our `fetchCats`
action in order to get all the cat pics into state. We want our cat pics to be
fetched when the `App` component is first loaded up. So, we'll enact a common
pattern in which we hook into a component lifecycle method to fetch the cat
pics.

#### The `componentDidMount` function

The `componentDidMount` function will *always be called automatically after
`render` gets called by our component, when the component is mounting for the
first time*. This is the perfect place to go and get the cat pics.

We can define our `componentDidMount` function like this:

```js
// src/App.js

...

class App extends React.Component {
  componentDidMount() {
    // fetch the cats
  }

  render() {
    return (...)
  }
}
```

So, we want to dispatch the `fetchCats` function from inside our component,
specifically from inside the  `componentDidMount` function. We'll need to use
`mapDispatchToProps` in order to make our `fetchCats` function dispatch-able
from within our component.

Once you successfully fetch cats, put them in state, grab them from state and
pass them to `App` under the `catPics` prop, you're ready to build the `CatList`
component.

#### The Presentational Component

Your container component, `App`, should render the presentational component,
`CatList`. `App` should pass `catPics` down to `CatList` as a prop. `CatList`
should iterate over the cat pics and display each cat pic in an image URL.
Remember to use debugger to take a look at the `catPics` collection and
determine which property of each `catPic` object you will use to populate your
`<img>` tag and render the image.
