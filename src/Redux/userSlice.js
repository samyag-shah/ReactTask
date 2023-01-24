import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  deletedUsers: [],
  key: 0,
};

export const usersSlice = createSlice({
  name: "user",
  initialState,

  //state Mutation is allowed bcoz it uses immer library
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
      state.key += 1;
    },
    editUser: (state, action) => {
      let index = state.users.findIndex(
        (data) => data.key === action.payload.value.key
      );
      state.users[index] = action.payload.value;
    },
    deleteUser: (state, action) => {
      let user = state.users.find((data) => data.key === action.payload);
      let userIndex = state.users.findIndex(
        (data) => data.key === action.payload
      );
      state.deletedUsers.push(user);
      state.users.splice(userIndex, 1);
    },
    restoreUser: (state, action) => {
      let user = state.deletedUsers.find((data) => data.key === action.payload);
      let userIndex = state.deletedUsers.findIndex(
        (data) => data.key === action.payload
      );
      state.users.push(user);
      state.deletedUsers.splice(userIndex, 1);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addUser, editUser, deleteUser, restoreUser } =
  usersSlice.actions;

export default usersSlice.reducer;
