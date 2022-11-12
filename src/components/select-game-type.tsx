import React, { ReactElement } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { GameModes } from "../common";

export interface SelectGameTypeProps {
    setMode: (mode: GameModes) => any;
}

const SelectGameType = ({ setMode }: SelectGameTypeProps): ReactElement => (
    <Stack>
        <Typography>Please select a game mode to begin</Typography>
        <Stack direction="row"  sx={{ justifyContent: "space-around"}}>
            <Button variant="contained" onClick={() => setMode("COMP")}>Vs. CPU</Button>
            <Button variant="contained" onClick={() => setMode("PVP")}>Two Player</Button>
        </Stack>
    </Stack>
);

export default SelectGameType;