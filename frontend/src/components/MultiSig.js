import { React } from "react";
import "./Pay.css";
import { FaDollarSign } from "react-icons/fa";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";
import img from "../multisig.jpg";
import { BsArrowRight } from "react-icons/bs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Image,
  Select,
  useStyles,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box } from "@chakra-ui/layout";
import "./styles.css";
import "./SingleChat.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import priceFeed from "../contracts/frontend-interaction/priceFeed";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

import senderc20 from "../contracts/frontend-interaction/senderc20";
import Pay2 from "./Pay2";
import PayNft2 from "./PayNft2";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;


const MultiSig = ({
    children,
    fetchAgain,
    setFetchAgain,
    fetchMessages,
    refAgain,
    Moralis,
    EvmChain,
    sender_id,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        width="100%"
        height="100%"
        margin={"0px"}
        padding="0px"
        className="font1"
        _focus={{ outline: "none" }}
        _hover={{ transform: "scale(1.09)" }}
        borderRadius={"0px"}
      >
        <p
          class="choice_label1 font2"
          style={{ fontSize: "18px", marginRight: "5px" }}
        >
          MULTI SIG
        </p>
        <IconButton
          d={{ base: "flex" }}
          onClick={onOpen}
          bg="linear-gradient(125deg,transparent,rgba(0,0,0,255)90%)"
          colorScheme="grey"
          color={"white"}
          width="100%"
          height="100%"
          border={"0px"}
          zIndex={"500"}
          borderRadius={"0px"}
        />
        <img className={"choice_img2"} src={img}></img>
      </Button>

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h="280px"
          bg="transparent"
          backdropFilter="auto"
          backdropBlur="6px"
          color="white"
          padding={"10px"}
        >
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <div className="payment_choice one">
              <Pay2
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
                refAgain={refAgain}
                toClose={onClose}
                Moralis={Moralis}
                EvmChain={EvmChain}
                sender_id={sender_id}
              />
            </div>
            <div className="payment_choice two">
              <PayNft2
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
                refAgain={refAgain}
                toClose={onClose}
                Moralis={Moralis}
                EvmChain={EvmChain}
                sender_id={sender_id}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MultiSig;
