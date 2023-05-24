const ethers = require("ethers");
const abi = require("./abi.json");

const wssUrl =
  "wss://rough-cold-layer.discover.quiknode.pro/15c42900474e5f79da7359398f3e101e2238dd13/";
const routerV2 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //Uniswap v2 Peppa/Weth

const interface = new ethers.Interface(abi);

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
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2".toLowerCase(); //"0xff8c479134a18918059493243943150776cf8cf2".toLowerCase();
  const PLOUTOS = "0x8718b8EB796ead111C0aF9CE05387e6c741d8e3e".toLowerCase();

  provider.on("pending", async (tx) => {
    const txnData = await provider.getTransaction(tx);

    if (txnData) {
      let gas = txnData["gasPrice"];
      if (txnData.to == routerV2) {
        let checkSig = txnData["data"].substring(0, 10);
        let index = Signatures.indexOf(
          Signatures.find((item) => item == checkSig)
        );

        let decoded = interface.decodeFunctionData(
          sigStrings[index],
          txnData["data"]
        );

        // address lower case : bug is possible,  Add this below code
        // console.log(decoded);
        const Path = Array.isArray(decoded[1])
          ? decoded[1].map((addr) => addr.toLowerCase())
          : decoded[2].map((addr) => addr.toLowerCase());

        console.log(Path.indexOf(PLOUTOS), Path.indexOf(WETH));

        if (Path.indexOf(WETH) != -1 && Path.indexOf(PLOUTOS) != -1) {
          console.log("hash: ", txnData["hash"]);
          console.log(Path);
        }
        // }
        //   if (index < 2) {
        //     if (

        //       Path[0] == WETH &&
        //       Path[Path.length - 1] == PLOUTOS
        //       // Path[1].includes(PLOUTOS)
        //     ) {
        //       console.log(decoded);
        //       console.log("line 71");
        //     }
        //   } else {
        //     if (
        //       Path[0] == WETH &&
        //       Path[Path.length - 1] == PLOUTOS
        //       // decoded[2].includes(PEPPA)
        //     ) {
        //       console.log(decoded);
        //       console.log("line 80");
        //     }
        //   }
        //   console.log("Line 83");
      }
    }
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

// QuickNode WSS - wss://rough-cold-layer.discover.quiknode.pro/15c42900474e5f79da7359398f3e101e2238dd13/
