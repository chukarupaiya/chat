import { React } from "react";
import "./Pay.css";
import { FaDollarSign } from "react-icons/fa";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";

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
} from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
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

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

import senderc20 from "../contracts/frontend-interaction/senderc20";

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const Pay = ({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  refAgain,
  toClose,
  Moralis,
  sender_id,
}) => {
  const [messages, setMessages] = useState([]);
  const [currency, setCurrency] = useState("");
  const [payment_type, setPaymentType] = useState("token");
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [token_address, setTokenAddress] = useState("");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const sendMessage = async (event) => {
    senderc20(
      token_address,
      sender_id,
      newMessage,
      "0x0C9d33186f7D87A94cBA10F3083BB208A49c1647"
    );

    //console.log(token_address+" "+sender_id+" "+newMessage);

    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        console.log(newMessage + " " + selectedChat);
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
            payment: true,
            payment_mode: "pay",
            chat_mode: "private",
            payment_type: payment_type,
            currency: currency,
            receiver_id: sender_id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      refAgain();
    }
  };

  const sendMessageReq = async (event) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        console.log(newMessage + " " + selectedChat);
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
            payment: true,
            payment_mode: "request",
            chat_mode: "private",
            payment_type: payment_type,
            currency: currency,
            receiver_id: sender_id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      refAgain();
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    console.log(socket);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const [options, setOptions] = useState([]);

  useEffect(async () => {
    const { EvmChain } = require("@moralisweb3/common-evm-utils");

    const address = "0x0C9d33186f7D87A94cBA10F3083BB208A49c1647";

    const chain = EvmChain.MUMBAI;

    if (Moralis != undefined) {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
      });

      console.log(response.toJSON());
      setOptions(response.toJSON());
    }
  }, [Moralis]);

  const options2 = options.map((d) => {
    return (
      <option value={d.symbol + "|" + d.token_address}>
        {d.symbol}&ensp;&ensp;(bal:{Math.pow(10, -18) * d.balance})
      </option>
    );
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button width="100%" height="100%" margin={"0px"} padding="0px">
        <p class="choice_label">TOKEN</p>
        <IconButton
          d={{ base: "flex" }}
          icon={<FaDollarSign />}
          onClick={onOpen}
          colorScheme="grey"
          _hover={{ bg: "rgb(68, 201, 34);" }}
          bg="rgb(114,137,218)"
          color={"white"}
          width="100%"
          height="100%"
        />
      </Button>

      <Modal
        size="lg"
        onClose={() => {
          onClose();
          toClose();
        }}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent h="410px" bg={"rgb(30,33,36)"} color="white">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            margin={"5px"}
            justifyContent="center"
          >
            {"Payment"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              onSubmit={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              width={"100%"}
              margin={"auto"}
            >
              <div style={{ width: "100%", margin: "auto" }}>
                <Input
                  placeholder="Enter amount $"
                  type="number"
                  variant="filled"
                  bg="rgb(54,57,62)"
                  color="white"
                  focusBorderColor="rgb(54,57,62)"
                  value={newMessage}
                  width="50%"
                  textAlign={"Center"}
                  marginLeft={"25%"}
                  marginRight={"auto"}
                  marginBottom={"15px"}
                  height={"100px"}
                  fontSize="20px"
                  onChange={typingHandler}
                  _hover={{ bg: "rgb(54,57,62)" }}
                />
              </div>

              <Select
                placeholder="select the token"
                size="lg"
                width={"80%"}
                margin={"auto"}
                name="currency"
                onChange={(event) => {
                  setTokenAddress(event.target.value.split("|")[1]);
                  setCurrency(event.target.value.split("|")[0]);
                }}
              >
                {options2}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                sendMessageReq();
                toClose();
              }}
              bg="rgb(114,137,218)"
              marginRight={"10px"}
            >
              Request
            </Button>
            <Button
              onClick={() => {
                onClose();
                sendMessage();
                toClose();
              }}
              bg="rgb(114,137,218)"
            >
              Pay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Pay;
