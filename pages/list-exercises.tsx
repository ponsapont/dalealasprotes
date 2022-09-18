import { Box, SimpleGrid, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getExerciseDefs } from "../services/backend";
import { ExerciseDef } from "../services/models";

export default function ListExercises() {
  const [exerciseDefs, setExerciseDefs] = useState<Array<ExerciseDef>>([]);
  const initialised = useRef(false);

  useEffect(() => {
    const init = async () => {
      setExerciseDefs(await getExerciseDefs());
      initialised.current = true;
    };
    if (!initialised.current) {
      init();
    }
  });

  if (!initialised.current) {
    return <Spinner />;
  }

  return (
    <SimpleGrid columns={2} spacing={10}>
      {exerciseDefs.map((exerciseDef, idx) => (
        <Link key={idx} href={`edit-exercise?id=${exerciseDef._id}`}>
          <Box
            color={"whiteAlpha.900"}
            backgroundColor={"blue.700"}
            padding={"50px"}
            textAlign={"center"}
            borderRadius={"20px"}
          >
            {exerciseDef.name}
          </Box>
        </Link>
      ))}
    </SimpleGrid>
  );
}
