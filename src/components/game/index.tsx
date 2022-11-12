import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Stack, Typography } from "@mui/material";

import AgainstComputer from "./against-computer";
import TwoPlayer from "./two-player";
import WinState from "./win-state";

import { startNewRound, calculateGameResultTrigger } from "../../redux/game-slice";
import { RootState } from "../../redux/store";

const Game = (): ReactElement => {
    const {
        mode,
        wins,
        losses,
        draws,
        winState,
        playerOneMove,
        playerTwoMove,
    } = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    if (playerOneMove && playerTwoMove && !winState) {
        dispatch(calculateGameResultTrigger());
    }
    
    return (
        <Stack>
            <Typography>Wins: {wins}</Typography>
            <Typography>Losses: {losses}</Typography>
            <Typography>Draws: {draws}</Typography>
            <WinState winState={winState} resetState={() => {
                dispatch(startNewRound());
            }} />
            {!winState && (mode === "COMP" ? <AgainstComputer /> : <TwoPlayer />)}
        </Stack>
    );
}

export default Game;