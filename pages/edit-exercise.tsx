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
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { addExerciseDef, getExerciseDef, getExerciseDefs, getMuscleGroups, updateExerciseDef } from "../services/backend";
import { ExerciseDef, MuscleGroup } from "../services/models";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UserContext from "../components/UserContext";
import { User } from "firebase/auth";
import { Form, Formik, useFormik, useFormikContext } from "formik";
import { useRouter } from "next/router";


const EditExercise: NextPage = () => {
  // ExerciseDef retrieved from the server
  const [serverExercise, setServerExercise] = useState<ExerciseDef | undefined>(undefined);
  // Muscle groups retrieved from server.
  const [muscleGroups, setMuscleGroups] = useState<Array<MuscleGroup>>([]);
  // Array of Muscle groups. Each nested array represents the available options for the matching index.
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    Array<Array<MuscleGroup>>
  >([]);
  const initialised = useRef(false);
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    const init = async () => {
      const mgs = await getMuscleGroups();
      setMuscleGroups(mgs);
      if (id !== undefined) {
        const exerciseDef = await getExerciseDef(id)
        setServerExercise(exerciseDef);
        // TODO: re-create [[mg],[mg]] for the selectors for the received mgs
        // setSelectedMuscleGroups(exerciseDef.muscleGroups);
      } else {
        setSelectedMuscleGroups([mgs]);
      }
      initialised.current = true;
    };
    if (muscleGroups.length === 0) {
      init();
    }
  });

  if (!initialised.current) {
    return <Spinner/>
  }

  const initialValues = id === undefined ? {
    exerciseName: "",
    muscleGroups: [muscleGroups[0].name],
  } : {
    exerciseName: serverExercise?.name || "",
    muscleGroups: serverExercise?.muscleGroups.map(mg => mg.name) || [],
  };

  const onSubmit = (values: { exerciseName: string, muscleGroups: Array<string>}) => {
    const newMuscleGroups = values.muscleGroups.map(name => muscleGroups.find(m => m.name == name)).filter(x => x !== undefined) as MuscleGroup[];
    const newExerciseDef = {
      name: values.exerciseName,
      muscleGroups: newMuscleGroups,
    };
    if (id === undefined) {
      addExerciseDef(newExerciseDef)
    } else {
      updateExerciseDef(id, newExerciseDef)
    }
    router.push("/");
  };

  const validate = (values: any) => {
  };

  const addMuscleGroup = (muscleGroupToRemove: string): string => {
    // Value is not set, then it is the first element
    if (!muscleGroupToRemove) {
      muscleGroupToRemove = selectedMuscleGroups[selectedMuscleGroups.length - 1][0].name;
    }
    // Remove the last selected group from the list of available muscle groups for providing the next options
    let lastMuscleGroups = [
      ...selectedMuscleGroups[selectedMuscleGroups.length - 1],
    ];
    const idx = lastMuscleGroups.findIndex(
      (m) => m.name === muscleGroupToRemove
    );
    lastMuscleGroups.splice(idx, 1);
    setSelectedMuscleGroups([...selectedMuscleGroups, lastMuscleGroups]);
    return lastMuscleGroups[0].name
  };

  const removeMuscleGroup = () => {
    selectedMuscleGroups.splice(selectedMuscleGroups.length - 1, 1);
    setSelectedMuscleGroups([...selectedMuscleGroups]);
  };

  return (
    <Stack spacing={10} width={"80%"}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => onSubmit(values)}
        validate={(values) => validate(values)}
      >
        {(props) => (
          <Form>
            <Heading size={"lg"} color={"whiteAlpha.700"}>
              { id === undefined ?
              <FormattedMessage id="create-exercise" />
              :
              <FormattedMessage id="edit-exercise" />
              }
            </Heading>
            <FormControl marginBottom={"20px"}>
              <FormLabel>
                <FormattedMessage id="exercise-name" />
              </FormLabel>
              <Input type="text" name="exerciseName" required={true} onChange={props.handleChange} value={props.values.exerciseName}/>
            </FormControl>
            <FormControl>
              <FormLabel>
                <FormattedMessage id="muscle-groups" />
              </FormLabel>
              {selectedMuscleGroups.map((selectedMuscleGroup, idx) =>
                muscleGroups.length > 0 ? (
                  <Fragment key={idx}>
                    <Select
                      name={`muscleGroups.${idx}`}
                      marginBottom="2rem"
                      disabled={idx < selectedMuscleGroups.length - 1}
                      onChange={props.handleChange}
                      value={props.values.muscleGroups[idx]}
                    >
                      {selectedMuscleGroup.map((muscleGroup, idx2) => (
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
                          onClick={(e) => {
                            const nextSelected = addMuscleGroup(props.values.muscleGroups[idx]);
                            props.setFieldValue(`muscleGroups.${idx+1}`, nextSelected);
                          }}
                          style={{ float: "right", fontSize: "32px" }}
                        />
                      </Fragment>
                    )}
                  </Fragment>
                ) : (
                  <Spinner key={idx} />
                )
              )}
            </FormControl>
            <Button
              type="submit"
              color={"whiteAlpha.900"}
              backgroundColor={"blue.700"}
              width={"100%"}
            >
              <FormattedMessage id="save" />
            </Button>
          </Form>
        )}
      </Formik>
    </Stack>
  );
};

export default EditExercise;
