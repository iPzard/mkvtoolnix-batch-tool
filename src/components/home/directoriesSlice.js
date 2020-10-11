import { createSlice } from '@reduxjs/toolkit';
import { getDirectory } from 'utils/services';

export const directoriesSlice = createSlice({
  name: 'directories',
  initialState: {
    input: '',
    output: ''
  },
  reducers: {
    setInput: (state) => getDirectory((directory) => state.input = directory),
    setOutput: (state) => getDirectory((directory) => state.output = directory),
  },
});

export const { setInput, setOutput } = directoriesSlice.actions;

// Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectInput = (state) => state.input;
export const selectOutput = (state) => state.output;

export default counterSlice.reducer;
