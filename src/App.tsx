import React, { useCallback, useEffect } from 'react';
import axios from "axios";
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setMode as setModeAction, reset, getGamesSagaTrigger } from "./redux/game-slice";
import { RootState } from "./redux/store";
import SelectGameType from "./components/select-game-type";
import { GameModes } from './common';
import Game from "./components/game";


// We want to make sure this is defaulted for saving purposes
axios.defaults.withCredentials = true;

function App() {
  const {
    mode,
  } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const setMode = useCallback((mode: GameModes) => dispatch(setModeAction(mode)), []);
  useEffect(() => {
    dispatch(getGamesSagaTrigger());
}, [])

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
      justifyContent: "center",
      display: "flex",
    }}>
      <Paper sx={{
        margin: "auto",
        padding: "1rem",
      }}>
        <Stack>
          <Typography variant="h3">Rock-Paper-Scissors</Typography>
          {mode && <Button
            sx={{ marginRight: "auto" }}
            variant="contained"
            onClick={() => dispatch(reset())}
          >
            Choose Mode
          </Button>}
          {mode ? <Game /> : <SelectGameType setMode={setMode} />}
        </Stack>
      </Paper>
    </Box>
  );
}

export default App;
