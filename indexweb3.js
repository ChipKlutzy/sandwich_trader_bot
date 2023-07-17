const Web3 = require("web3");
const ethers = require("ethers");

const RouterABI = require("./abis/routerABI.json");

const wssUrl =
  "wss://rough-cold-layer.discover.quiknode.pro/15c42900474e5f79da7359398f3e101e2238dd13/";

const web3 = new Web3(wssUrl);

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const routerAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const routerInterface = new ethers.Interface(RouterABI);

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
  "swapETHForExactTokens(uint256,address[],address,uint256)", // amountOut
  "swapExactETHForTokens(uint256,address[],address,uint256)", // amountOutMin
  "swapExactTokensForETH(uint256,uint256,address[],address,uint256)", // amountIn, amountOutMin
  "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)", // amountIn, amountOutMin
  "swapTokensForExactETH(uint256,uint256,address[],address,uint256)", // amountOut, amountInMax
  "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)", // amountOut, amountInMax
  "swapExactETHForTokensSupportingFeeOnTransferTokens(uint256,address[],address,uint256)", // amountOutMin
  "swapExactTokensForETHSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)", // amountIn, amountOutMin
  "swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)", // amountIn, amountOutMin
];

const subscription = web3.eth.subscribe(
  "pendingTransactions",
  async (error, result) => {
    if (!error) {
      let tx = await web3.eth.getTransaction(result);
      if (tx) {
        if (tx.to && tx.to.toUpperCase() == routerAddr.toUpperCase()) {
          let funcSig = tx.input.substring(0, 10); // collects first 4 bytes from data bytes string
          let index = Signatures.indexOf(
            Signatures.find((item) => item == funcSig) // checks if its present in Signatures
          );
          if (index > -1) {
            // filters Router Swap Transactions for only 9 Specific Swap Functions
            const data = tx.input;
            let txDesc = routerInterface.parseTransaction(
              // sigStrings[index];
              {
                data,
              }
            );
            const Path = Array.isArray(txDesc.args[1])
              ? txDesc.args[1]
              : txDesc.args[2];

            let amountIn, amountOut, amountInMax, amountOutMin;

            if (
              Path.length == 2 &&
              Path[0].toUpperCase() == WETH.toUpperCase()
            ) {
              switch (index) {
                case 0:
                  amountOut = txDesc.args[0];
                  break;
                case 1:
                  amountOutMin = txDesc.args[0];
                  break;
                case 2:
                  amountIn = txDesc.args[0];
                  amountOutMin = txDesc.args[1];
                  break;
                case 3:
                  amountIn = txDesc.args[0];
                  amountOutMin = txDesc.args[1];
                  break;
                case 4:
                  amountOut = txDesc.args[0];
                  amountInMax = txDesc.args[1];
                  break;
                case 5:
                  amountOut = txDesc.args[0];
                  amountInMax = txDesc.args[1];
                  break;
                case 6:
                  amountOutMin = txDesc.args[0];
                  break;
                case 7:
                  amountIn = txDesc.args[0];
                  amountOutMin = txDesc.args[1];
                  break;
                case 8:
                  amountIn = txDesc.args[0];
                  amountOutMin = txDesc.args[1];
                  break;
              }
              console.log({
                amountIn: amountIn,
                amountOut: amountOut,
                amountInMax: amountInMax,
                amountOutMin: amountOutMin,
                funcName: sigStrings[index],
              });
            }
          }
        }
      } else {
        console.error(error);
      }
    }
  }
);

// Unsubscribe after 10 minutes
setTimeout(() => {
  subscription.unsubscribe((error, success) => {
    if (success) {
      console.log("Unsubscribed successfully!");
    } else {
      console.error("Error unsubscribing:", error);
    }
  });
}, 10 * 60 * 1000); // 10 minutes

// Alchemy wss URL = wss://eth-mainnet.g.alchemy.com/v2/09iJ98PnLVH_h4w7fCpWKTErwIdDBwTj
