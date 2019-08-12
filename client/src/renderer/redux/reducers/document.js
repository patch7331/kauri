/** @format */

const initialState = [
  {
    type: "heading",
    level: 1,
    class: "h1",
    children: ["Kauri (Working Title)"],
  },
  {
    type: "paragraph",
    children: ["Testing testing..."]
  }
];

export default function documentReducer(state = initialState, action) {
  return state;
}
