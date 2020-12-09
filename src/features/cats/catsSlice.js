export function fetchCats() {
  return function (dispatch) {
    dispatch({ type: "cats/catsLoading" });
    fetch("https://learn-co-curriculum.github.io/cat-api/cats.json")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "cats/catsLoaded", payload: data.images });
      });
  };
}

const initialState = {
  entities: [], // array of cats
  status: "idle", // loading state
};

export default function catsReducer(state = initialState, action) {
  switch (action.type) {
    case "cats/catsLoading":
      return {
        ...state,
        status: "loading",
      };
    case "cats/catsLoaded":
      return {
        ...state,
        entities: action.payload,
        status: "idle",
      };
    default:
      return state;
  }
}
