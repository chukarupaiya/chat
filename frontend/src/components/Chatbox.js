import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain,Moralis,EvmChain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      bg="rgb(66,69,73)"
      w={{ base: "100%", md: "68%" }}
      position={"relative"}
      height={"100%"}
      overflow="hidden"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} Moralis={Moralis} EvmChain={EvmChain} />
    </Box>
  );
};

export default Chatbox;
