const { ethers} = require("ethers");
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");



async function sendnft(to,token_address,token_id,sender_address) {
  const contractabi = require("../abi/senderc20.json");
  const erc721abi=require("../abi/IERC721.json");
  const contractaddr = "0xfEa987B55BA353482487E018327B056b91Aa8538";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract_signer = new ethers.Contract(
    contractaddr,
    contractabi,
    signer
  );

  const erc721_signer = new ethers.Contract(
    token_address,
    erc721abi,
    signer
  );

const approveNft= await erc721_signer.approve(contractaddr,token_id)

  // const owner1 = sender_address;

  // console.log("1");
  // use(Web3ClientPlugin);

  // const posClient = new POSClient();
  // await posClient.init({
  //   network: "testnet",
  //   version: "mumbai",
  //   parent: {
  //     provider: signer,
  //     defaultConfig: {
  //       from: owner1,
  //     },
  //   },
  //   child: {
  //     provider: signer,
  //     defaultConfig: {
  //       from: owner1,
  //     },
  //   },
  // });
  console.log("2");

//    const erc721RootToken = posClient.erc721(token_address,true);
// const approveResult = await erc721RootToken.approve(token_id);
  console.log("3");

  
  const sendNft = await contract_signer.SendNFT(to,token_address,token_id,{gasLimit: 210000});
}

export default sendnft;