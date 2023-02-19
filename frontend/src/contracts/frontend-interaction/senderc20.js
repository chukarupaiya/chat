const { ethers} = require("ethers");
const { POSClient, use } = require("@maticnetwork/maticjs");
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-ethers");



async function senderc20(token_address,receiver_address,amount1,sender_address,note) {
  const contractabi = require("../abi/senderc20.json");
  const contractaddr = "0xAAEFCa53e21E85C00B1Db5090fF2EC275b6d4D90";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract_signer = new ethers.Contract(
    contractaddr,
    contractabi,
    signer
  );

  const owner1 = sender_address;

  console.log("1");
  use(Web3ClientPlugin);

  const posClient = new POSClient();
  await posClient.init({
    network: "testnet",
    version: "mumbai",
    parent: {
      provider: signer,
      defaultConfig: {
        from: owner1,
      },
    },
    child: {
      provider: signer,
      defaultConfig: {
        from: owner1,
      },
    },
  });
  console.log("2");

  
  const erc20Token = posClient.erc20(token_address, true);
  const input0 = ""+amount1;
  const decimals0 = "18";
  const amount = ethers.utils.parseUnits(input0, decimals0);
  const amounthex = ethers.utils.hexlify(amount);
  const approveResult = await erc20Token.approve(amounthex, {
    spenderAddress: contractaddr,
  });
  console.log("3");

  
  const senderc20 = await contract_signer.sendToken(token_address,receiver_address,amount,note,{gasLimit: 210000});
}

export default senderc20;
