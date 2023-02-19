import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = (props) => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%",overflow:"hidden"}} >
      {user && <SideDrawer />}
      <Box d="flex" w="97%" h="91.5vh" margin={"auto"} borderRadius={"20px"} overflow="hidden" >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} Moralis={props.Moralis} EvmChain={props.EvmChain}/>
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
