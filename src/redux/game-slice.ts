import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import Cookies from 'js-cookie'

import { GameModes, ValidMoves, GameConclusions} from "../common";
import { getSagaTrigger } from "./utility";

interface WLD {
    wins: number;
    draws: number;
    losses: number;
}

export interface GameState extends WLD {
    mode: undefined | GameModes;
    winState: undefined | GameConclusions;
    playerOneMove: undefined | ValidMoves;
    playerTwoMove: undefined | ValidMoves;
    fetchingGameState: boolean;
    fetchingCompMove: boolean;
}

interface GamesReturnType extends WLD{
    user_id: string;
    win_state?: GameConclusions;
}

const name = "game";

const initialState: GameState = {
    wins: 0,
    losses: 0,
    draws: 0,
    mode: undefined,
    winState: undefined,
    playerOneMove: undefined,
    playerTwoMove: undefined,
    fetchingGameState: false,
    fetchingCompMove: false,
};

export const gameSlice = createSlice({
    name,
    initialState,
    reducers: {
        setWins: (state, { payload: wins }: { payload: number }) => {
            state.wins = wins;
        },
        setLosses: (state, { payload: losses }: { payload: number }) => {
            state.losses = losses;
        },
        setDraws: (state, { payload: draws }: { payload: number }) => {
            state.draws = draws;
        },
        setMode: (state, { payload: mode }: { payload: GameModes }) => {
            state.mode = mode;
        },
        setPlayerOneMove: (state, { payload: move }: { payload: ValidMoves }) => {
            state.playerOneMove = move;
        },
        setPlayerTwoMove: (state, { payload: move }: { payload: ValidMoves }) => {
            state.playerTwoMove = move;
        },
        setWinState: (state, { payload: winState }: { payload: undefined | GameConclusions }) => {
            state.winState = winState;
        },
        startNewRound: (state) => {
            state.playerOneMove = undefined;
            state.playerTwoMove = undefined;
            state.winState = undefined;
        },
        reset: (state) => {
            state.mode = undefined;
            state.playerOneMove = undefined;
            state.playerTwoMove = undefined;
            state.winState = undefined;
        },
        setFetchingGameState: (state, { payload: fetchingGameState }: { payload: boolean }) => {
            state.fetchingGameState = fetchingGameState;
        },
        setFetchingCompMove: (state, { payload: fetchingCompMove }: { payload: boolean }) => {
            state.fetchingCompMove = fetchingCompMove;
        },
        getGamesSagaTrigger: getSagaTrigger<GameState, undefined>(),
        calculateGameResultTrigger: getSagaTrigger<GameState, undefined>(),
        getComputerMoveSagaTrigger: getSagaTrigger<GameState, undefined>(),
    },
});

export const {
    setWins,
    setLosses,
    setDraws,
    setMode,
    setPlayerOneMove,
    setPlayerTwoMove,
    setWinState,
    startNewRound,
    setFetchingGameState,
    setFetchingCompMove,
    reset,
    getGamesSagaTrigger,
    calculateGameResultTrigger,
    getComputerMoveSagaTrigger,
} = gameSlice.actions;

function* getGamesSaga(): Generator<any> {
    const game = yield select(({ game }: { game: GameState}) => game);
    if (!(game as GameState).fetchingGameState) {
        yield put(setFetchingGameState(true));
        // @ts-ignore
        const { data } = (yield call(axios.get, "games")) as { data: GamesReturnType };
        if (!Cookies.get("user_id") && data?.user_id) {
            Cookies.set("user_id", data?.user_id);
        }
        const { wins, losses, draws } = data;
        yield put(setWins(wins));
        yield put(setDraws(draws));
        yield put(setLosses(losses));
        yield put(setFetchingGameState(false));
    }
}

function* calculateGameResultSaga(): Generator<any> {
    const game = (yield select(({ game }: { game: GameState}) => game)) as GameState;
    if (!game.fetchingGameState) {
        yield put(setFetchingGameState(true));
        const { playerOneMove, playerTwoMove } = game;
        const { data: {
            win_state,
            wins,
            draws,
            losses,
        }} = (yield call(axios.post, "games", {
            player_one_move: playerOneMove,
            player_two_move: playerTwoMove,
        })) as { data: GamesReturnType };
        yield put(setWins(wins));
        yield put(setDraws(draws));
        yield put(setLosses(losses));
        yield put(setWinState(win_state));
        yield put(setFetchingGameState(false));
    }
}

function* getComputerMoveSaga(): Generator<any> {
    const game = (yield select(({ game }: { game: GameState}) => game)) as GameState;
    if (!game.fetchingCompMove) {
        yield put(setFetchingCompMove(true));
        const { data: { move }} = (yield call(axios.get, "move")) as { data: { move: ValidMoves }};
        yield put(setPlayerTwoMove(move));
        yield put(setFetchingCompMove(false));
    }
}

export function* gameSaga() {
    yield takeEvery(getGamesSagaTrigger.type, getGamesSaga);
    yield takeEvery(calculateGameResultTrigger.type, calculateGameResultSaga);
    yield takeEvery(getComputerMoveSagaTrigger.type, getComputerMoveSaga);
}

export default gameSlice.reducer;