const { ethers} = require("ethers");
async function  Crowdfund_launch(amount,days,token_address){

    console.log(days);
    
    const Crowdfund_launch_abi = require("../abi/Crowdfunding.json")
    const Crowdfundaddr = "0xB0328d991C5Dcaf323698d4eCd65dF37c253e904";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract_signer = new ethers.Contract(
    Crowdfundaddr,
    Crowdfund_launch_abi,
    signer
  );

  const input0 = ""+amount;
  const decimals0 = "18";
  const amount1 = ethers.utils.parseUnits(input0, decimals0);

  const submittxn =await contract_signer.launch(amount1,days,token_address,{gasLimit: 210000})
//   const confirmtxn  = await contract_signer.confirmTransaction()
//   const executetxn  = await contract_signer.executeTransaction()

}

export default Crowdfund_launch;