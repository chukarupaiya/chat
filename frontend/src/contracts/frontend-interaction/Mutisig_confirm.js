const { ethers} = require("ethers");
async function  Multisig_confirm(index){
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




  const confirmtxn  = await contract_signer.confirmTransaction(index,{gasLimit: 210000})
//   const executetxn  = await contract_signer.executeTransaction()

}

export default Multisig_confirm;