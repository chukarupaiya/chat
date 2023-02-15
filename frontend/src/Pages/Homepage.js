import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import "./Homepage.css";


function Homepage() {
  const history = useHistory();
  const [walletAddr, setWalletAddr] = useState("");

  //0x8131B9FdEFB33E428E0FA33DbdA6C842BcD58439

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  

  return (
    <>
      <div style={{ display: "flex", width: "100%", height: "100vh" }}>
        <div className="leftlogin">
          <img
            class="metamask-fox"
            src={"https://metamask.io/images/metamask-logo.png"}
          />
        </div>
        <div className="rightlogin">
          {walletAddr == "" ? (
            <div>
              <button className="connectBtn"  >
                connect wallet
              </button>
            </div>
          ) : (
            <Container maxW="xl" centerContent>
              <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                marginTop={"40%"}
              >
                <Tabs isFitted variant="soft-rounded">
                  <TabList mb="1em">
                    <Tab>Login</Tab>
                    <Tab>Sign Up</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Login walletAddr={walletAddr} />
                    </TabPanel>
                    <TabPanel>
                      <Signup walletAddr={walletAddr} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Container>
          )}
        </div>
      </div>
    </>
  );
}

export default Homepage;
