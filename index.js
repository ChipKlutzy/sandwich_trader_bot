const ethers = require("ethers");
const RouterABI = require("./abis/routerABI.json");
const PairABI = require("./abis/pairABI.json");

const wssUrl = "wss://mainnet.infura.io/ws/v3/5b2f0da43289407191e8d8e142e416e6"; // Infura websocket Id
const RouterAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const PairAddr = "0xc63a4dd7c0a3f58cc619cf52163c88789c06f1b2"; //Uniswap v2 Peppa/Weth

const routerInterface = new ethers.Interface(RouterABI);
const pairInterface = new ethers.Interface(PairABI);

const Signatures = [
  "0xfb3bdb41",
  "0x7ff36ab5",
  "0x18cbafe5",
  "0x38ed1739",
  "0x4a25d94a",
  "0x8803dbee",
  "0xb6f9de95",
  "0x791ac947",
  "0x5c11d795",
];

const sigStrings = [
  "swapETHForExactTokens(uint256,address[],address,uint256)",
  "swapExactETHForTokens(uint256,address[],address,uint256)",
  "swapExactTokensForETH(uint256,uint256,address[],address,uint256)",
  "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
  "swapTokensForExactETH(uint256,uint256,address[],address,uint256)",
  "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)",
  "swapExactETHForTokensSupportingFeeOnTransferTokens(uint256,address[],address,uint256)",
  "swapExactTokensForETHSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)",
  "swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)",
];

async function main() {
  const provider = new ethers.WebSocketProvider(wssUrl);
  // const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase();
  // const FANTA = "0x5adebafbf2fd0d6808a7a1e823759de2df1df39e".toLowerCase(); // FANTA

  provider.on("pending", async (txhash) => {
    const txnData = await provider.getTransaction(txhash);
    if (txnData) {
      if (txnData.to && txnData.to.toLowerCase() == RouterAddr.toLowerCase()) {
        console.log(txnData.hash);
      }
    }

    // if (txnData) {
    //   if (txnData.to == RouterAddr) {
    //     console.log(txnData);
    //     // let checkSig = txnData["data"].substring(0, 10); // collects first 4 bytes of data
    //     // let index = Signatures.indexOf(
    //     //   Signatures.find((item) => item == checkSig) // checks if its present in Signatures
    //     // );
    //     // if (index > -1) {
    //     //   // filters Router Swap Transactions for only 9 Specific Swap Functions
    //     //   let decoded = routerInterface.decodeFunctionData(
    //     //     sigStrings[index],
    //     //     txnData["data"]
    //     //   );
    //     //   const Path = Array.isArray(decoded[1])
    //     //     ? decoded[1].map((addr) => addr.toLowerCase())
    //     //     : decoded[2].map((addr) => addr.toLowerCase());
    //     //   if (Path.includes(WETH)) {
    //     //     if (Path.includes(FANTA)) {
    //     //       console.log("hash: ", txnData["hash"]);
    //     //       console.log(Path);
    //     //     }
    //     //   }
    //     // }
    //     // address lower case : bug is possible,  Add this below code
    //     // console.log(decoded);
    //     // const Path = Array.isArray(decoded[1])
    //     //   ? decoded[1].map((addr) => addr.toLowerCase())
    //     //   : decoded[2].map((addr) => addr.toLowerCase());
    //     // console.log(Path.indexOf(FANTA), Path.indexOf(WETH));
    //     // if (Path.indexOf(WETH) != -1 && Path.indexOf(FANTA) != -1) {
    //     //   console.log("hash: ", txnData["hash"]);
    //     //   console.log(Path);
    //     // }
    //     // }
    //     //   if (index < 2) {
    //     //     if (
    //     //       Path[0] == WETH &&
    //     //       Path[Path.length - 1] == FANTA
    //     //       // Path[1].includes(FANTA)
    //     //     ) {
    //     //       console.log(decoded);
    //     //       console.log("line 71");
    //     //     }
    //     //   } else {
    //     //     if (
    //     //       Path[0] == WETH &&
    //     //       Path[Path.length - 1] == FANTA
    //     //       // decoded[2].includes(PEPPA)
    //     //     ) {
    //     //       console.log(decoded);
    //     //       console.log("line 80");
    //     //     }
    //     //   }
    //     //   console.log("Line 83");
    //   }
    // }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// gasPrice
// Buy or Sell
// amountIn
// Price Impact
// Slippage
// Setting gasPrice

// Infura WSS - wss://mainnet.infura.io/ws/v3/5b2f0da43289407191e8d8e142e416e6
// QuickNode WSS - wss://rough-cold-layer.discover.quiknode.pro/15c42900474e5f79da7359398f3e101e2238dd13/

// Related Docs
// Providers Method Docs - https://docs.ethers.org/v5/api/providers/provider/#Provider--events
