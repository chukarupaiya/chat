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

import { connect } from "../snap/export";
import { connectWallet } from "../components/interact";

function Homepage() {
  const history = useHistory();
  const [walletAddr, setWalletAddr] = useState("0xE7B0a0ca3443FF1C90E8f3d7fce8B58bd308ca5f");

  localStorage.setItem("address", walletAddr);
  //0xE7B0a0ca3443FF1C90E8f3d7fce8B58bd308ca5f-->sai
  //0x0C9d33186f7D87A94cBA10F3083BB208A49c1647
  //0x3103FF402aEbd5a7b6cF799aaAb076f5a21172b0-->account

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <>
      <div
        className={"font1"}
        style={{ display: "flex", width: "100%", height: "100vh" }}
      >
        <div className="leftlogin">
          <img
            class="metamask-fox"
            src={"https://metamask.io/images/metamask-logo.png"}
          />
        </div>
        <div className="rightlogin">
          {walletAddr == "" ? (
            <div>
              <button
                className="connectBtn"
                onClick={async() => {
                  const temp=await connectWallet();
                  console.log(temp);
                  setWalletAddr(temp.address)
                }}
              >
                connect wallet
              </button>
            </div>
          ) : (
            <Container maxW="xl" centerContent>
              <Box
                bg="rgb(40,43,48)"
                w="100%"
                p={4}
                borderRadius="lg"
                color="white"
                marginTop={"40%"}
              >
                <Tabs isFitted variant="soft-rounded">
                  <TabList mb="1em">
                    <Tab _selected={{ color: "white", bg: "rgb(30,33,36)" }}>
                      Login
                    </Tab>
                    <Tab _selected={{ color: "white", bg: "rgb(30,33,36)" }}>
                      Sign Up
                    </Tab>
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
