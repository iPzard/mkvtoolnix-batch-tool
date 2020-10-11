import { configureStore } from '@reduxjs/toolkit';
import counterReducer from 'components/counter/counterSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
