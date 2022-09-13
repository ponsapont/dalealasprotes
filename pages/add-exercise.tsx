import {
  Stack,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { addExerciseDef, getMuscleGroups } from "../services/backend";
import { MuscleGroup } from "../services/models";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UserContext from "../components/UserContext";
import { User } from "firebase/auth";

const AddExercise: NextPage = () => {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [muscleGroups, setMuscleGroups] = useState<Array<MuscleGroup>>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    Array<MuscleGroup>
  >([]);
  const [valid, setValid] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const mgs = await getMuscleGroups();
      setMuscleGroups(mgs);
      setSelectedMuscleGroups([mgs[0]]);
    };
    if (muscleGroups.length === 0) {
      init();
    }
  });

  const handleExerciseName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExerciseName(e.target.value);
  };

  const saveExercise = (e: React.MouseEvent) => {
    if (exerciseName.length === 0 || selectedMuscleGroups.length === 0) {
      setValid(false);
    } else {
      setValid(true);
      const exercise = {
        name: exerciseName,
        muscleGroups,
      };
      addExerciseDef(exercise);
    }
  };

  const addMuscleGroup = () => {
    // Remove the group from the list of available
    const idx = muscleGroups.findIndex(
      (m) => m === selectedMuscleGroups[selectedMuscleGroups.length - 1]
    );
    console.log(`removing index ${idx}`);
    // muscleGroups.splice(idx, 1);
    // setMuscleGroups([...muscleGroups])
    setSelectedMuscleGroups([...selectedMuscleGroups, muscleGroups[0]]);
  };

  const removeMuscleGroup = () => {
    selectedMuscleGroups.splice(selectedMuscleGroups.length - 1, 1);
    setSelectedMuscleGroups([...selectedMuscleGroups]);
  };

  const handleExerciseDef = (e: React.ChangeEvent) => {};

  return (
    <Stack spacing={10} width={"80%"}>
      <Heading size={"lg"} color={"whiteAlpha.700"}>
        <FormattedMessage id="create-exercise" />
      </Heading>
      <FormControl>
        <FormLabel>
          <FormattedMessage id="exercise-name" />
        </FormLabel>
        <Input type="text" onChange={(e) => handleExerciseName(e)} />
      </FormControl>
      <FormControl>
        <FormLabel>
          <FormattedMessage id="muscle-groups" />
        </FormLabel>
        {selectedMuscleGroups.map((selectedMuscleGroup, idx) =>
          muscleGroups.length > 0 ? (
            <Fragment>
              <Select
                key={idx}
                onChange={(e) => handleExerciseDef(e)}
                marginBottom="2rem"
                disabled={idx < selectedMuscleGroups.length - 1}
              >
                {muscleGroups.map((muscleGroup, idx2) => (
                  <option key={idx2} value={muscleGroup.name}>
                    <FormattedMessage id={muscleGroup.name} />
                  </option>
                ))}
              </Select>
              {idx == selectedMuscleGroups.length - 1 && (
                <Fragment>
                  <RemoveIcon
                    onClick={() => removeMuscleGroup()}
                    style={{ float: "left", fontSize: "32px" }}
                  />
                  <AddIcon
                    onClick={() => addMuscleGroup()}
                    style={{ float: "right", fontSize: "32px" }}
                  />
                </Fragment>
              )}
            </Fragment>
          ) : (
            <Spinner key={idx}/>
          )
        )}
      </FormControl>
      <Button
        onClick={(e) => saveExercise(e)}
        color={"whiteAlpha.900"}
        backgroundColor={"blue.700"}
      >
        <FormattedMessage id="save" />
      </Button>
      {!valid && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            <FormattedMessage id="invalid" />
          </AlertTitle>
          <AlertDescription>
            <FormattedMessage id="invalid-text" />
          </AlertDescription>
        </Alert>
      )}
    </Stack>
  );
};

export default AddExercise;
