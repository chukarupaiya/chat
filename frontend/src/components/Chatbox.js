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
      p={3}
      bg="rgb(54,57,62)"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
     
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} Moralis={Moralis} EvmChain={EvmChain} />
    </Box>
  );
};

export default Chatbox;
