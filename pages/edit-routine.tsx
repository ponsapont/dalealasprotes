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
  addRoutine,
  getExerciseDef, getExerciseDefs,
  getRoutine,
  updateRoutine
} from "../services/backend";
import { ExerciseDef, Routine } from "../services/models";

const EditExercise: NextPage = () => {
  // ExerciseDef retrieved from the server
  const [serverRoutine, setServerRoutine] = useState<Routine | undefined>(
    undefined
  );
  // Muscle groups retrieved from server.
  const [exerciseDefs, setExercisedefs] = useState<Array<ExerciseDef>>([]);
  // Array of Muscle groups. Each nested array represents the available options for the matching index.
  const [selectedExerciseDefs, setSelectedExerciseDefs] = useState<
    Array<Array<ExerciseDef>>
  >([]);
  const initialised = useRef(false);
  const router = useRouter();
  const id = router.query.id as string;

  const addExerciseDef = (
    exerciseToRemove: string,
    selectedExerciseDefs: Array<Array<ExerciseDef>>
  ): {
    nextSelected: string | undefined;
    selectedExerciseDefs: Array<Array<ExerciseDef>>;
  } => {
    // Value is not set, then it is the first element
    if (!exerciseToRemove) {
      exerciseToRemove =
        selectedExerciseDefs[selectedExerciseDefs.length - 1][0].name;
    }
    // Remove the last selected group from the list of available muscle groups for providing the next options
    let lastExerciseDefs = [
      ...selectedExerciseDefs[selectedExerciseDefs.length - 1],
    ];
    const idx = lastExerciseDefs.findIndex(
      (m) => m.name === exerciseToRemove
    );
    lastExerciseDefs.splice(idx, 1);
    const updatedSelectedMgs = [...selectedExerciseDefs, lastExerciseDefs];
    setSelectedExerciseDefs(updatedSelectedMgs);
    return {
      nextSelected: lastExerciseDefs[0]?.name,
      selectedExerciseDefs: updatedSelectedMgs,
    };
  };

  const removeExerciseDef = () => {
    selectedExerciseDefs.splice(selectedExerciseDefs.length - 1, 1);
    setSelectedExerciseDefs([...selectedExerciseDefs]);
  };

  useEffect(() => {
    const init = async () => {
      const mgs = await getExerciseDefs();
      setExercisedefs(mgs);
      setSelectedExerciseDefs([mgs]);
      if (id !== undefined) {
        const routine = await getRoutine(id);
        setServerRoutine(routine);
        // TODO: re-create [[mg],[mg]] for the selectors for the received mgs
        // setSelectedExerciseDefs(routine.routines);
        let smgs = [mgs];
        for (var i = 0; i < routine.exerciseDefs.length; i++) {
          const mg = routine.exerciseDefs[i];
          smgs = addExerciseDef(mg.name, smgs).selectedExerciseDefs;
        }
      }
      initialised.current = true;
    };
    if (exerciseDefs.length === 0) {
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
          exerciseDefs: [exerciseDefs[0].name],
        }
      : {
          exerciseName: serverRoutine?.name || "",
          exerciseDefs: serverRoutine?.exerciseDefs.map((mg) => mg.name) || [],
        };

  const onSubmit = (values: {
    exerciseName: string;
    exerciseDefs: Array<string>;
  }) => {
    const newRoutines = values.exerciseDefs
      .map((name) => exerciseDefs.find((m) => m.name == name))
      .filter((x) => x !== undefined) as ExerciseDef[];
    const newRoutine = {
      _id: "",
      name: values.exerciseName,
      exerciseDefs: newRoutines,
    };
    if (id === undefined) {
      addRoutine(newRoutine);
    } else {
      updateRoutine(id, newRoutine);
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
              {selectedExerciseDefs.map((selectedExerciseDef, idx) =>
                exerciseDefs.length > 0 ? (
                  <Fragment key={idx}>
                    <Select
                      name={`exerciseDefs.${idx}`}
                      marginBottom="2rem"
                      disabled={idx < selectedExerciseDefs.length - 1}
                      onChange={props.handleChange}
                      value={props.values.exerciseDefs[idx]}
                    >
                      {selectedExerciseDef.map((muscleGroup, idx2) => (
                        <option key={idx2} value={muscleGroup.name}>
                          <FormattedMessage id={muscleGroup.name} />
                        </option>
                      ))}
                    </Select>
                    {idx == selectedExerciseDefs.length - 1 && (
                      <Fragment>
                        <RemoveIcon
                          onClick={() => removeExerciseDef()}
                          style={{ float: "left", fontSize: "32px" }}
                        />
                        <AddIcon
                          onClick={(e) => {
                            const { nextSelected } = addExerciseDef(
                              props.values.exerciseDefs[idx],
                              selectedExerciseDefs
                            );
                            props.setFieldValue(
                              `exerciseDefs.${idx + 1}`,
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
