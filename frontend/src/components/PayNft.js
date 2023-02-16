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

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const PayNft = ({
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
  const [options, setOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

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
            content: currency,
            chatId: selectedChat,
            payment: true,
            payment_mode: "pay",
            chat_mode: "private",
            payment_type: "NFT",
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

  useEffect(async () => {
    const { EvmChain } = require("@moralisweb3/common-evm-utils");

    const address = "0xf5b7a2f2a99aEa196994f525f531D648417d2706";

    const chain = EvmChain.MUMBAI;

    if (Moralis != undefined) {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });

      console.log(response.toJSON());
      setOptions(response.toJSON().result);
    }
  }, [Moralis]);

  const options2 = options
    .filter((d) => {
      if (JSON.parse(d.metadata) != null) {
        return true;
      } else {
        return false;
      }
    })
    .map((d) => {
      return (
        <option value={d.name + "|" + JSON.parse(d.metadata).image}>
         {d.name}&ensp;&ensp;(tokenId:{d.token_id})
        </option>
      );
    });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button width="100%" height="100%" margin={"0px"} padding="0px">
        <p class="choice_label">NFT</p>
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
        <ModalContent h="550px" bg={"rgb(30,33,36)"} color="white">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            margin={"5px"}
            justifyContent="center"
          >
            {"Transfer NFT"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="imageNft">
            {imageUrl == "" && <p>selected NFT</p>}
              {imageUrl != "" && <img src={imageUrl}></img>}</div>
            <FormControl
              onSubmit={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              width={"100%"}
              margin={"auto"}
            >
              <Select
                placeholder="select the NFT"
                size="lg"
                fontSize={"15px"}
                width={"80%"}
                margin={"auto"}
                name="currency"
                onChange={(event) => {
                  console.log(event.target);
                  console.log(event.target.value.split("|")[0]);
                  setImageUrl(event.target.value.split("|")[1]);
                  setCurrency(event.target.value);
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
                sendMessage();
                toClose();
              }}
              bg="rgb(114,137,218)"
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PayNft;
