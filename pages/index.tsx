import { Button, Container, SimpleGrid } from "@chakra-ui/react";
import type { NextPage } from "next";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import BoltIcon from "@mui/icons-material/Bolt";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddCardIcon from "@mui/icons-material/AddCard";
import Link from "next/link";

const navItems = [
  { slug: "start-workout", icon: <FitnessCenterIcon /> },
  { slug: "create-routine", icon: <PlaylistAddIcon /> },
  { slug: "add-exercise", icon: <BoltIcon /> },
  { slug: "list-workouts", icon: <AddCardIcon /> },
  { slug: "history", icon: <HistoryIcon /> },
  { slug: "charts", icon: <BarChartIcon /> },
];

const Home: NextPage = () => {
  return (
      <SimpleGrid  columns={2} spacing={10}>
        {navItems.map((item, idx) => (
          <Link key={idx} href={item.slug}>
            <Button color={"whiteAlpha.900"} backgroundColor={"blue.700"}size={"lg"} >
              <FormattedMessage id={item.slug} />
            </Button>
          </Link>
        ))}
      </SimpleGrid>
  );
};

export default Home;
