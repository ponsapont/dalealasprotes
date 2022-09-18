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
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Link from "next/link";

const navItems = [
  { name: "start-workout", slug: "start-workout", icon: <FitnessCenterIcon/> },
  { name: "create-routine", slug: "create-routine", icon: <PlaylistAddIcon/> },
  { name: "add-routine", slug: "edit-routine", icon: <PlaylistAddIcon/> },
  { name: "add-exercise", slug: "edit-exercise", icon: <BoltIcon/> },
  { name: "list-exercises", slug: "list-exercises", icon: <FormatListBulletedIcon/> },
  { name: "list-routines", slug: "list-routines", icon: <FormatListBulletedIcon/> },
  { name: "list-workouts", slug: "list-workouts", icon: <FormatListBulletedIcon/> },
  { name: "history", slug: "history", icon: <HistoryIcon/> },
  { name: "charts", slug: "charts", icon: <BarChartIcon/> },
];

const Home: NextPage = () => {
  return (
      <SimpleGrid  columns={2} spacing={10}>
        {navItems.map((item, idx) => (
          <Link key={idx} href={item.slug}>
            <Button color={"whiteAlpha.900"} backgroundColor={"blue.700"}size={"lg"} >
              <FormattedMessage id={item.name} />
            </Button>
          </Link>
        ))}
      </SimpleGrid>
  );
};

export default Home;
