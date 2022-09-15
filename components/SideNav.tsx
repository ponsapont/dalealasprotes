import {
  Button,
  Center,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Fragment } from "react";
import React from "react";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BoltIcon from '@mui/icons-material/Bolt';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCardIcon from '@mui/icons-material/AddCard';

const navItems = [
  { name: "start-workout", slug: "start-workout", icon: <FitnessCenterIcon/> },
  { name: "create-routine", slug: "create-routine", icon: <PlaylistAddIcon/> },
  { name: "add-exercise", slug: "edit-exercise", icon: <BoltIcon/> },
  { name: "list-workouts", slug: "list-workouts", icon: <AddCardIcon/> },
  { name: "history", slug: "history", icon: <HistoryIcon/> },
  { name: "charts", slug: "charts", icon: <BarChartIcon/> },
];

export default function SideNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Fragment>
      <Center minHeight={"60px"} padding={"8px 16px"} backgroundColor="gray.900" >
          <Button left={"16px"} position="absolute" color={"whiteAlpha.900"} backgroundColor={"blue.700"} onClick={onOpen}>
            <HamburgerIcon />
          </Button>
          <Link href="/">
            <Heading cursor={"pointer"} color={"whiteAlpha.700"}>Dale a las protes</Heading>
          </Link>
      </Center>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={"left"}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="gray.900">
          <DrawerHeader onClick={onClose}>
            <Flex justifyContent={"space-between"}>
              <Link href="/">
                <a>
                  <Text color={"whiteAlpha.800"}>
                    <FormattedMessage id="home" />
                  </Text>
                </a>
              </Link>
              <CloseButton color={"whiteAlpha.800"} float={"right"} onClick={onClose} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <List spacing={5}>
              {navItems.map((item, idx) => (
                <ListItem key={idx} onClick={onClose}>
                  <Link href={`/${item.slug}`}>
                    <a>
                      <Flex fontSize={"xl"} color={"whiteAlpha.800"} display="flex" alignItems={"center"}>
                        {item.icon}
                        <div style={{"marginLeft": "16px"}}>
                          <FormattedMessage id={item.name} />
                        </div>
                      </Flex>
                    </a>
                  </Link>
                </ListItem>
              ))}
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}
