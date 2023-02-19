import { React } from "react";
import "./Pay.css";
import { FaDollarSign } from "react-icons/fa";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";
import img from "../eth1.png";
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
import Multisig from "../contracts/frontend-interaction/Multisig";
import Multisig_confirm from "../contracts/frontend-interaction/Mutisig_confirm";
import Multisig_execute from "../contracts/frontend-interaction/Multisig_execute";

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const Pay2 = ({
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
  const [to, setTo] = useState("");
  const [confirm, setConfirm] = useState("");
  const [execute, setExecute] = useState("");
  const [index, setIndex] = useState("");

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

    const result=await Multisig(to,token_address,newMessage,note);
    console.log("lll");
    console.log(localStorage.getItem("temp"))
    setIndex(localStorage.getItem("temp"))
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
            content: to,
            chatId: selectedChat,
            payment: true,
            payment_mode: "pay",
            chat_mode: "group",
            payment_type: "token",
            currency: "submitted txn",
            receiver_id: sender_id,
            note: note,
            token_address: localStorage.getItem("temp"),
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

  const sendMessage2 = async (event) => {
    await Multisig_confirm(confirm);
    if (newMessage || confirm) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        console.log(confirm);
        console.log(newMessage + " " + selectedChat);
        const { data } = await axios.post(
          "/api/message",
          {
            content: confirm,
            chatId: selectedChat,
            payment: true,
            payment_mode: "pay",
            chat_mode: "group",
            payment_type: "token",
            currency: "confirmed txn",
            receiver_id: sender_id,
            note: "empty",
            token_address: confirm,
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

  const sendMessage3 = async (event) => {

    await Multisig_execute(execute);
   
    if (newMessage || execute) {
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
            content: execute,
            chatId: selectedChat,
            payment: true,
            payment_mode: "pay",
            chat_mode: "group",
            payment_type: "token",
            currency: "executed txn",
            receiver_id: sender_id,
            note: "",
            token_address: execute,
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
        <p class="choice_label1 font2">TOKEN</p>
        <IconButton
          d={{ base: "flex" }}
          onClick={onOpen}
          bg="linear-gradient(125deg,transparent,rgba(0,0,0,255))"
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
          h="560px"
          bg={"rgb(30,33,36)"}
          color="white"
          className={"font1"}
        >
          <ModalBody>
            <FormControl
              id="first-name"
              isRequired
              mt={3}
              width={"100%"}
              margin={"auto"}
            >
              <p id="payment">Submit</p>
              <FormLabel>To</FormLabel>
              <Input
                placeholder="Enter To Address"
                type="text"
                variant="filled"
                bg="rgb(54,57,62)"
                borderRadius={"10px"}
                color="white"
                focusBorderColor="rgb(54,57,62)"
                value={to}
                width="100%"
                marginBottom={"15px"}
                height={"35px"}
                fontSize="15px"
                onChange={(event) => {
                  setTo(event.target.value);
                }}
                _focus={{ border: "0px" }}
                _hover={{ bg: "transparent" }}
              />

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
                    placeholder="Enter amount"
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

              <div
                className={"form-pay"}
                style={{
                  width: "100%",
                  margin: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  placeholder="Add a Note"
                  type="text"
                  variant="filled"
                  bg="rgb(54,57,62)"
                  color="white"
                  focusBorderColor="rgb(54,57,62)"
                  value={note}
                  width="55%"
                  borderRadius={"10px"}
                  height={"35px"}
                  fontSize="12px"
                  textAlign={"center"}
                  onChange={(event) => {
                    setNote(event.target.value);
                  }}
                  _hover={{ bg: "rgb(54,57,62)" }}
                />
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
                >
                  <RiSendPlane2Fill />
                </Button>
              </div>
              <p id="payment">Confirm</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  placeholder="transaction index"
                  type="text"
                  variant="filled"
                  bg="rgb(54,57,62)"
                  borderRadius={"10px"}
                  color="white"
                  focusBorderColor="rgb(54,57,62)"
                  value={confirm}
                  width="80%"
                  marginBottom={"15px"}
                  height={"35px"}
                  fontSize="15px"
                  onChange={(event) => {
                    setConfirm(event.target.value);
                  }}
                  _focus={{ border: "0px" }}
                  _hover={{ bg: "transparent" }}
                />
                <Button
                  onClick={() => {
                    onClose();
                    sendMessage2();
                    toClose();
                  }}
                  backgroundColor="rgb(40,43,48)"
                  _hover={{ bg: "rgb(3, 252, 173)", color: "black" }}
                  borderRadius={"30px"}
                  width={"15%"}
                >
                  <RiSendPlane2Fill />
                </Button>
              </div>

              <p id="payment">Execute</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  placeholder="Transaction index"
                  type="text"
                  variant="filled"
                  bg="rgb(54,57,62)"
                  borderRadius={"10px"}
                  color="white"
                  focusBorderColor="rgb(54,57,62)"
                  value={execute}
                  width="80%"
                  marginBottom={"15px"}
                  height={"35px"}
                  fontSize="15px"
                  onChange={(event) => {
                    setExecute(event.target.value);
                  }}
                  _focus={{ border: "0px" }}
                  _hover={{ bg: "transparent" }}
                />
                <Button
                  onClick={() => {
                    onClose();
                    sendMessage3();
                    toClose();
                  }}
                  backgroundColor="rgb(40,43,48)"
                  _hover={{ bg: "rgb(3, 252, 173)", color: "black" }}
                  borderRadius={"30px"}
                  width={"15%"}
                >
                  <RiSendPlane2Fill />
                </Button>
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Pay2;
