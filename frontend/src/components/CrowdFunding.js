import { React } from "react";
import "./Pay.css";
import { FaDollarSign } from "react-icons/fa";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";
import img from "../crowd.webp";
import { RiSendPlane2Fill } from "react-icons/ri";
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
import Crowdfund_launch from "../contracts/frontend-interaction/Crowdfund_launch";

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const CrowdFunding = ({
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
  const [chain, setChain] = useState("");
  const [token_address, setTokenAddress] = useState("");
  const [note, setNote] = useState("");
  const [owner_address, setOwner_address] = useState(
    localStorage.getItem("address")
  );
  const [bal, setBal] = useState("");
  const [usd, setUsd] = useState(0);
  const [date, setDate] = useState("");

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

  const sendMessage1 = async (event) => {
    const temp=new Date();
    temp.setDate(temp.getDate()+parseInt(date))

    await Crowdfund_launch(newMessage,temp.toUTCString(),token_address);
   
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
            payment_mode: temp,
            chat_mode: "group",
            payment_type: "crowd",
            currency: currency,
            receiver_id: sender_id,
            note: note,
            token_address: token_address,
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

    const address = localStorage.getItem("address");

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
      <option
        className="font1"
        value={
          d.symbol + "|" + d.token_address + "|" + Math.pow(10, -18) * d.balance
        }
      >
        {d.symbol}
      </option>
    );
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(async () => {
    const result = await priceFeed();
    setUsd(result);
  }, []);

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
          class="choice_label font2"
          style={{ fontSize: "14px", marginLeft: "35px" }}
        >
          Crowd Funding
        </p>
        <IconButton
          d={{ base: "flex" }}
          onClick={onOpen}
          colorScheme="grey"
          bg="linear-gradient(125deg,rgba(0,0,0,255) 10%,transparent)"
          width="100%"
          height="100%"
          zIndex={"500"}
          border={"0px"}
          borderRadius={"0px"}
        />
        <img className={"choice_img2"} src={img}></img>
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
        <ModalContent
          h="460px"
          bg={"rgb(30,33,36)"}
          color="white"
          className={"font1"}
        >
          <ModalBody>
            <p id={"payment"} style={{"textAlign":"center"}}>CrowdFunding</p>
            <FormControl
              id="first-name"
              isRequired
              mt={3}
              width={"100%"}
              margin={"auto"}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <FormLabel>Select Token</FormLabel>
                <p>Bal:{bal == "" ? "--" : bal + " " + currency}</p>
              </div>
              <div className={"form-pay2"}>
                <Select
                  placeholder="token"
                  width={"35%"}
                  margin={"auto"}
                  name="currency"
                  outline={"0px"}
                  border={"0px"}
                  marginBottom={"15px"}
                  marginTop={"7px"}
                  height={"100%"}
                  fontSize={"20px"}
                  _focus={{ border: "0px" }}
                  className={"font1"}
                  onChange={(event) => {
                    if (event.target.value.split("|")[0] != "") {
                      setTokenAddress(event.target.value.split("|")[1]);
                      setCurrency(event.target.value.split("|")[0]);
                      setBal(event.target.value.split("|")[2].substring(0, 8));
                    } else {
                      setBal("");
                    }
                  }}
                >
                  {options2}
                </Select>
                <div>
                  <Input
                    placeholder="Enter goal"
                    type="number"
                    variant="filled"
                    bg="rgba(54,57,62,0)"
                    color="white"
                    focusBorderColor="rgb(54,57,62)"
                    value={newMessage}
                    textAlign={"right"}
                    width="100%"
                    marginBottom={"15px"}
                    height={"35px"}
                    fontSize="19px"
                    onChange={typingHandler}
                    _focus={{ border: "0px" }}
                    _hover={{ bg: "transparent" }}
                  />
                  <p
                    style={{
                      textAlign: "right",
                      fontStyle: "italic",
                      fontSize: "14px",
                    }}
                  >
                    ~&ensp;{parseInt(newMessage) * usd}&ensp;$
                  </p>
                </div>
              </div>

              

              <p id="payment">Note</p>
              <Input
                placeholder="Enter a note"
                type="text"
                variant="filled"
                bg="rgb(54,57,62)"
                borderRadius={"10px"}
                color="white"
                focusBorderColor="rgb(54,57,62)"
                value={note}
                width="100%"
                marginBottom={"15px"}
                height={"35px"}
                fontSize="15px"
                onChange={(event) => {
                  setNote(event.target.value);
                }}
                _focus={{ border: "0px" }}
                _hover={{ bg: "transparent" }}
              />

              <p id="payment">Duration</p>
              <Input
                placeholder="Enter the duration "
                type="number"
                variant="filled"
                bg="rgb(54,57,62)"
                borderRadius={"10px"}
                color="white"
                focusBorderColor="rgb(54,57,62)"
                value={date}
                width="100%"
                marginBottom={"15px"}
                height={"35px"}
                fontSize="15px"
                onChange={(event) => {
                  setDate(event.target.value);
                }}
                _focus={{ border: "0px" }}
                _hover={{ bg: "transparent" }}
              />
            </FormControl>
            <Button
              onClick={() => {
                onClose();
                sendMessage1();
                toClose();
              }}
              backgroundColor="rgb(40,43,48)"
              _hover={{ bg: "rgb(3, 252, 173)", color: "black" }}
              borderRadius={"30px"}
              width={"15%"}
              marginLeft={"85%"}
              
            >
              <RiSendPlane2Fill />
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CrowdFunding;
