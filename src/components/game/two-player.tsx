import React, { ReactElement } from "react";
import { Stack, Typography } from "@mui/material";
import MovePicker from "./move-picker";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerOneMove, setPlayerTwoMove } from "../../redux/game-slice";
import { RootState } from "../../redux/store";
import { ValidMoves } from "../../common";

const TwoPlayer = (): ReactElement => {
    const dispatch = useDispatch();
    const {
        playerOneMove,
    } = useSelector((state: RootState) => state.game);
    return (
        <Stack>
            <Typography variant="h4">{!playerOneMove ? "Player one" : "Player two"}</Typography>
            <MovePicker chooseMove={(move: ValidMoves) => {
                if (!playerOneMove) {
                    dispatch(setPlayerOneMove(move));
                } else {
                    dispatch(setPlayerTwoMove(move));
                }
            }} />
        </Stack>
        
    );
}

export default TwoPlayer;