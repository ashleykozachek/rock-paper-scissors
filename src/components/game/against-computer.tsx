import React, { ReactElement } from "react";
import { Stack, Typography } from "@mui/material";
import MovePicker from "./move-picker";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerOneMove, getComputerMoveSagaTrigger } from "../../redux/game-slice";
import { RootState } from "../../redux/store";
import { ValidMoves } from "../../common";

const AgainstComputer = (): ReactElement => {
    const dispatch = useDispatch();
    const {
        playerTwoMove,
        fetchingCompMove,
    } = useSelector((state: RootState) => state.game);
    if (!fetchingCompMove && !playerTwoMove) {
        dispatch(getComputerMoveSagaTrigger());
    }
    return (
        <Stack>
            <Typography variant="h4">Player one</Typography>
            <MovePicker chooseMove={(move: ValidMoves) => {
                dispatch(setPlayerOneMove(move));
            }} />
        </Stack>
        
    );
}

export default AgainstComputer;