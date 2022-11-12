import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { gameSaga } from "./game-slice";
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(gameSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;