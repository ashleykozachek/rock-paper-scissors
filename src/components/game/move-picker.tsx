import React, { ReactElement } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { ValidMoves } from "../../common";

export interface MovePickerProps {
    chooseMove: (move: ValidMoves) => any;
}

const MovePicker = ({ chooseMove }: MovePickerProps): ReactElement => 
<Stack>
    <Typography>What will you choose?</Typography>
    <Stack sx={{ justifyContent: "space-around"}} direction="row">
        <Button onClick={() => chooseMove("ROCK")} variant="contained">Rock</Button>
        <Button onClick={() => chooseMove("PAPER")} variant="contained">Paper</Button>
        <Button onClick={() => chooseMove("SCISSORS")} variant="contained">Scissors</Button>
    </Stack>
</Stack>;

export default MovePicker;