const { ethers} = require("ethers");
async function  Multisig(to,token_address,amount,note){
    const Multisigabi = require("../abi/Multisig.json");
    const Multisigaddr = "0xb1e89A6F2eccf90b0c180f554323138F19ae0FC6";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract_signer = new ethers.Contract(
    Multisigaddr,
    Multisigabi,
    signer
  );
  const contract_provider=new ethers.Contract(
    Multisigaddr,
    Multisigabi,
    provider
  );

  const input0 = ""+amount;
  const decimals0 = "18";
  const amount1 = ethers.utils.parseUnits(input0, decimals0);

  const submittxn =await contract_signer.submitTransaction(to,token_address,amount1,note,"1",{gasLimit: 210000})
  const block = await provider.getBlockNumber()

    const transferEvents = await contract_provider.on('SubmitTransaction', (from,txindex,to)=>{
      let info={
        from:from,
        txindex:txindex,
        to:to
      };

      temp(info);
    });
    
    return transferEvents;
  
//   const confirmtxn  = await contract_signer.confirmTransaction()
//   const executetxn  = await contract_signer.executeTransaction()

}


const temp=(info)=>{
  localStorage.setItem("temp",info.txindex);
}

export default Multisig;