import React, { ReactElement } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { GameConclusions } from "../../common";

export interface WinStateProps {
    winState: undefined | GameConclusions;
    resetState: () => any;
}

const WinState = ({ winState, resetState }: WinStateProps): ReactElement => {
    let winStateText;
    switch (winState) {
        case "DRAW":
            winStateText = "Draw";
            break;
        case "WIN":
            winStateText = "Player 1 won";
            break;
        case "LOSE":
            winStateText = "Player 2 won";
            break;
        default:
            return <></>;
    }
    return (
        <Stack>
            <Typography variant="h4">{winStateText}</Typography>
            <Button variant="contained" onClick={resetState}>Continue</Button>
        </Stack>
    );
}

export default WinState;