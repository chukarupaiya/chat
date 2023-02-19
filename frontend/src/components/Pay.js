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
  const [chain, setChain] = useState("");
  const [token_address, setTokenAddress] = useState("");
  const [note, setNote] = useState("");
  const [owner_address, setOwner_address] = useState(
   localStorage.getItem("address")
  );
  const [bal, setBal] = useState("");
  const [usd, setUsd] = useState(0);

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

  const sendMessage = async (event) => 
  {
    await senderc20(
      token_address,
      sender_id,
      newMessage,
      "0x0C9d33186f7D87A94cBA10F3083BB208A49c1647",
      note
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
            receiver_id: owner_address,
            note: note,
            token_address: token_address,
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
          h="470px"
          bg={"rgb(30,33,36)"}
          color="white"
          className={"font1"}
        >
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            <p id={"payment"}>Transfer Token</p>
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
              {/* <FormLabel>Select Chain</FormLabel>
              <div
                style={{
                  display: "flex",
                  backgroundColor: "rgb(54, 57, 62)",
                  paddingTop: "15px",
                  borderRadius: "10px",
                }}
                
              >
                <Select
                  placeholder="chain"
                  width={"35%"}
                  margin={"auto"}
                  name="chain1"
                  outline={"0px"}
                  border={"0px"}
                  marginBottom={"15px"}
                  height={"100%"}
                  fontSize={"20px"}
                  _focus={{ border: "0px" }}
                  onChange={(event) => {
                    setChain(event.target.value);
                  }}
                >
                  <option value={"MATIC"}>MATIC</option>
                  <option value={"ETH"}>ETH</option>
                </Select>
                <BsArrowRight className="arrow"></BsArrowRight>
                <Select
                  placeholder="chain"
                  width={"35%"}
                  margin={"auto"}
                  name="chain2"
                  outline={"0px"}
                  fontSize={"20px"}
                  border={"0px"}
                  marginBottom={"15px"}
                  height={"100%"}
                  _focus={{ border: "0px" }}
                  onChange={(event) => {
                    setChain(event.target.value);
                  }}
                >
                  <option value={"MATIC"}>MATIC</option>
                  <option value={"ETH"}>ETH</option>
                </Select>
              </div> */}
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
                    {currency=="LINK" && (<p>~&ensp;{parseInt(newMessage) * usd}&ensp;$</p> )}
                    {currency!="LINK" && (<p>~&ensp;NaN&ensp;$</p> )}
                  </p>
                </div>
              </div>

              <div
                className={"form-pay"}
                style={{ width: "fit-content", margin: "auto" }}
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
                  marginLeft={"55px"}
                  borderRadius={"50px"}
                  height={"45px"}
                  fontSize="12px"
                  textAlign={"center"}
                  onChange={(event) => {
                    setNote(event.target.value);
                  }}
                  _hover={{ bg: "rgb(54,57,62)" }}
                />
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                onClose();
                sendMessageReq();
                toClose();
              }}
              backgroundColor="rgb(40,43,48)"
              marginRight={"10px"}
              _hover={{ bg: "rgb(255, 223, 64)", color: "black" }}
              borderRadius={"30px"}
            >
              Request
            </Button>
            <Button
              onClick={() => {
                onClose();
                sendMessage();
                toClose();
              }}
              backgroundColor="rgb(40,43,48)"
              _hover={{ bg: "rgb(3, 252, 173)", color: "black" }}
              borderRadius={"30px"}
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
