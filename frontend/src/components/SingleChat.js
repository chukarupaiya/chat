import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { useDisclosure } from "@chakra-ui/hooks";
import "./SingleChat.css";
import { IconButton, Spinner, useToast, Button } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import ChatLoading from "./ChatLoading";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import Pay from "./Pay";
import PaymentChoice from "./PaymentChoice";
import GroupPayment from "./GroupPayment";
import GroupBox1 from "./miscellaneous/GroupBox1";

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, Moralis, EvmChain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchResult = [1];

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

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        receiver_id: getSender(user, selectedChat.users),
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
            payment: false,
            payment_mode: "false",
            chat_mode: "private",
            payment_type: "false",
            currency: "false",
            note: "empty",
            token_address: "empty",
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
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const refAgain = () => {
    fetchMessages();
  };

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

  return (
    <>
      <div id="single_class_div">
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: "20px", md: "20px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              d="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
              color="white"
              position={"absolute"}
              top={"0"}
              left={"0"}
              padding={"10px"}
              bg="blackAlpha.400"
              backdropFilter="auto"
              backdropBlur="6px"
              zIndex={"1000"}
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    <p className="font1">
                      {getSender(user, selectedChat.users)}
                    </p>
                    {/* <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  /> */}
                  </>
                ) : (
                  <Box justifyContent={"space-between"} width={"100%"} display={"flex"}>
                    <p>{selectedChat.chatName}</p>
                    <div style={{"display":"flex"}}>
                      <Button
                        variant="ghost"
                        onClick={onOpen}
                        className={"summa"}
                        _hover={{ bg: "rgb(3, 252, 173);", color: "black" }}
                      >
                        <Text>#search</Text>
                      </Button>
                      <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                      />
                    </div>
                  </Box>
                ))}
            </Text>
            <Box
              d="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="rgb(66,69,73)"
              w="100%"
              h="105%"
              borderRadius="lg"
              overflowY="hidden"
              paddingTop={"10px"}
            >
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} refAgain={refAgain} />
                </div>
              )}

              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      // height={50}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div style={{ margin: "auto", display: "flex" }}>
                  <Input
                    variant="filled"
                    bg="rgb(54,57,62)"
                    color="white"
                    focusBorderColor="rgb(54,57,62)"
                    placeholder="Enter a message.."
                    value={newMessage}
                    width="97%"
                    onChange={typingHandler}
                    _hover={{ bg: "rgb(54,57,62)" }}
                  />
                  {messages &&
                    (!selectedChat.isGroupChat ? (
                      <PaymentChoice
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                        refAgain={refAgain}
                        Moralis={Moralis}
                        EvmChain={EvmChain}
                        sender_id={getSender(user, selectedChat.users)}
                      />
                    ) : (
                      <GroupPayment
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                        refAgain={refAgain}
                        Moralis={Moralis}
                        EvmChain={EvmChain}
                        sender_id={getSender(user, selectedChat.users)}
                      />
                    ))}
                </div>
              </FormControl>
            </Box>
            <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
              <DrawerOverlay />
              <DrawerContent
                bg="blackAlpha.400"
                backdropFilter="auto"
                backdropBlur="6px"
                color="white"
                className={"font1"}
                border={"0px"}
              >
                <DrawerHeader>Search Index</DrawerHeader>
                <DrawerBody>
                  <Box d="flex" pb={2}>
                    <Input
                      placeholder="Search by wallet address"
                      mr={2}
                      _focus={{ borderColor: "#e2b2ff;" }}
                    />
                    <Button bg="white" color="black" _hover={{ bg: "#77fcc7" }}>
                      Go
                    </Button>
                  </Box>
                  {loading ? (
                    <ChatLoading />
                  ) : (
                    searchResult?.map((user) => <GroupBox1 />)
                  )}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          // to get socket.io on same page
          <Box
            d="flex"
            alignItems="center"
            justifyContent="center"
            h="105%"
            w="100%"
            bg="rgb(66,69,73)"
          >
            <Text fontSize="3xl" pb={3} color="white" className="font1">
              Click on a user to start chatting
            </Text>
          </Box>
        )}
      </div>
    </>
  );
};

export default SingleChat;
