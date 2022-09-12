import {
  Stack,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { Fragment, MouseEventHandler, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import BoltIcon from "@mui/icons-material/Bolt";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddCardIcon from "@mui/icons-material/AddCard";
import Link from "next/link";
import { getExerciseDefs } from "../services/backend";
import { ExerciseDef } from "../services/models";

const Home: NextPage = () => {
  const [routineName, setRoutineName] = useState<string>("");
  const [exercises, setExercises] = useState<Array<ExerciseDef>>([]);
  const [valid, setValid] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      setExercises(await getExerciseDefs());
    }
    init();
  });

  const handleRoutineName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoutineName(e.target.value);
  }

  const createRoutine = (e: React.MouseEvent) => {
    // TODO: Update Firestore
    if (routineName.length === 0) {
      setValid(false)
    } else {
      setValid(true)
    }
  }

  const handleExerciseDef = (e: React.ChangeEvent) => {
  }

  return (
    <Stack spacing={10} width={"80%"}>
      <Heading size={"lg"} color={"whiteAlpha.700"}>
        <FormattedMessage id="create-routine" />
      </Heading>
      <FormControl>
        <FormLabel>
          <FormattedMessage id="routine-name" />
        </FormLabel>
        <Input type="text" onChange={(e) => handleRoutineName(e)}/>
      </FormControl>
      <FormControl>
        <FormLabel>
          <FormattedMessage id="exercises" />
        </FormLabel>
        { exercises.length > 0 ? (
          <Select onChange={(e) => handleExerciseDef(e)}>
            {exercises.map((exercise, idx) => (
              <option key={idx} value={exercise.name}>{exercise.name}</option>
            ))}
          </Select>
        ):(
          <FormattedMessage id="no-exercises"/>
        )}
      </FormControl>
      <Button onClick={(e) => createRoutine(e)} color={"whiteAlpha.900"} backgroundColor={"blue.700"}><FormattedMessage id="save"/></Button>
      {!valid && (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle><FormattedMessage id="invalid"/></AlertTitle>
          <AlertDescription><FormattedMessage id="invalid-text"/></AlertDescription>
        </Alert>
      )}
    </Stack>
  );
};

export default Home;
