import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select, Spinner, Stack
} from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Fragment, useEffect,
  useRef,
  useState
} from "react";
import { FormattedMessage } from "react-intl";
import {
  addExerciseDef,
  getExerciseDef, getMuscleGroups,
  updateExerciseDef
} from "../services/backend";
import { ExerciseDef, MuscleGroup } from "../services/models";

const EditExercise: NextPage = () => {
  // ExerciseDef retrieved from the server
  const [serverExercise, setServerExercise] = useState<ExerciseDef | undefined>(
    undefined
  );
  // Muscle groups retrieved from server.
  const [muscleGroups, setMuscleGroups] = useState<Array<MuscleGroup>>([]);
  // Array of Muscle groups. Each nested array represents the available options for the matching index.
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    Array<Array<MuscleGroup>>
  >([]);
  const initialised = useRef(false);
  const router = useRouter();
  const id = router.query.id as string;

  const addMuscleGroup = (
    muscleGroupToRemove: string,
    selectedMuscleGroups: Array<Array<MuscleGroup>>
  ): {
    nextSelected: string | undefined;
    selectedMuscleGroups: Array<Array<MuscleGroup>>;
  } => {
    // Value is not set, then it is the first element
    if (!muscleGroupToRemove) {
      muscleGroupToRemove =
        selectedMuscleGroups[selectedMuscleGroups.length - 1][0].name;
    }
    console.log(selectedMuscleGroups);
    // Remove the last selected group from the list of available muscle groups for providing the next options
    let lastMuscleGroups = [
      ...selectedMuscleGroups[selectedMuscleGroups.length - 1],
    ];
    const idx = lastMuscleGroups.findIndex(
      (m) => m.name === muscleGroupToRemove
    );
    lastMuscleGroups.splice(idx, 1);
    const updatedSelectedMgs = [...selectedMuscleGroups, lastMuscleGroups];
    setSelectedMuscleGroups(updatedSelectedMgs);
    return {
      nextSelected: lastMuscleGroups[0]?.name,
      selectedMuscleGroups: updatedSelectedMgs,
    };
  };

  const removeMuscleGroup = () => {
    selectedMuscleGroups.splice(selectedMuscleGroups.length - 1, 1);
    setSelectedMuscleGroups([...selectedMuscleGroups]);
  };

  useEffect(() => {
    const init = async () => {
      const mgs = await getMuscleGroups();
      setMuscleGroups(mgs);
      setSelectedMuscleGroups([mgs]);
      if (id !== undefined) {
        const exerciseDef = await getExerciseDef(id);
        setServerExercise(exerciseDef);
        // TODO: re-create [[mg],[mg]] for the selectors for the received mgs
        // setSelectedMuscleGroups(exerciseDef.muscleGroups);
        let smgs = [mgs];
        for (var i = 0; i < exerciseDef.muscleGroups.length; i++) {
          const mg = exerciseDef.muscleGroups[i];
          smgs = addMuscleGroup(mg.name, smgs).selectedMuscleGroups;
        }
      }
      initialised.current = true;
    };
    if (muscleGroups.length === 0) {
      init();
    }
  });

  if (!initialised.current) {
    return <Spinner />;
  }

  const initialValues =
    id === undefined
      ? {
          exerciseName: "",
          muscleGroups: [muscleGroups[0].name],
        }
      : {
          exerciseName: serverExercise?.name || "",
          muscleGroups: serverExercise?.muscleGroups.map((mg) => mg.name) || [],
        };

  const onSubmit = (values: {
    exerciseName: string;
    muscleGroups: Array<string>;
  }) => {
    const newMuscleGroups = values.muscleGroups
      .map((name) => muscleGroups.find((m) => m.name == name))
      .filter((x) => x !== undefined) as MuscleGroup[];
    const newExerciseDef = {
      _id: "",
      name: values.exerciseName,
      muscleGroups: newMuscleGroups,
    };
    if (id === undefined) {
      addExerciseDef(newExerciseDef);
    } else {
      updateExerciseDef(id, newExerciseDef);
    }
    router.push("/");
  };

  return (
    <Stack spacing={10} width={"80%"}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => onSubmit(values)}
      >
        {(props) => (
          <Form>
            <Heading size={"lg"} color={"whiteAlpha.700"}>
              {id === undefined ? (
                <FormattedMessage id="create-exercise" />
              ) : (
                <FormattedMessage id="edit-exercise" />
              )}
            </Heading>
            <FormControl marginBottom={"20px"}>
              <FormLabel>
                <FormattedMessage id="exercise-name" />
              </FormLabel>
              <Input
                type="text"
                name="exerciseName"
                required={true}
                onChange={props.handleChange}
                value={props.values.exerciseName}
              />
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
                            const { nextSelected } = addMuscleGroup(
                              props.values.muscleGroups[idx],
                              selectedMuscleGroups
                            );
                            props.setFieldValue(
                              `muscleGroups.${idx + 1}`,
                              nextSelected
                            );
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
