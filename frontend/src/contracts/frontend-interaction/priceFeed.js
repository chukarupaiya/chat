const { ethers} = require("ethers");
async function priceFeed(){
    const PriceFeedabi = require("../abi/price_feed.json")
  const PriceFeedaddr = "0x6e54346BF13e3B9eED79083b5CD268ae4331cf0B";
  const provider = new ethers.providers.Web3Provider(window.ethereum);

   const PriceFeedProvider = new ethers.Contract(PriceFeedaddr,PriceFeedabi,provider)
   const AggregatorV3addr="0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408"
   const FetchPrice=await PriceFeedProvider.getLatestPrice(AggregatorV3addr)
   
   return Math.round((Math.pow(10,-8)*FetchPrice)*1000)/1000;

}

export default priceFeed;