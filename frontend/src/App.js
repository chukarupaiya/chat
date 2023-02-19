import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import { useEffect } from "react";

function App() {
  const Moralis = require("moralis").default;
  const { EvmChain } = require("@moralisweb3/common-evm-utils");

  useEffect(async () => {
    await Moralis.start({
      apiKey:
        "KbdbJsvE5jGcuXLs6X37RMF7z6eW07l9IA8gx2ahPT9FYGCUhEffWRY8DRr9lyQ7",
    });
  }, []);
//"T5yjNDWdaF7Re1aS1kTgLl4cVWdFjiCx1cY1NVgxJtr7wQox2N1xdJXXV2DfamTB"

  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats">
        <Chatpage Moralis={Moralis} EvmChain={EvmChain} />
      </Route>
    </div>
  );
}

export default App;
