import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
  name: 'profile',
  initialState: null,
  reducers: {
    setProfile: (state, action) => {
      state = action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions

export default profileSlice.reducer