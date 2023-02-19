const { ethers} = require("ethers");
async function  Multisig_execute(index){
    const Multisigabi = require("../abi/Multisig.json");
    const Multisigaddr = "0x95e125539b98E84e8005Ba743320951cb7D74dA5";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract_signer = new ethers.Contract(
    Multisigaddr,
    Multisigabi,
    signer
  );




  const executetxn  = await contract_signer.executeTransaction(index,{gasLimit: 210000})


}

export default Multisig_execute;