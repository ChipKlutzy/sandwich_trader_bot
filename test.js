const ethers = require("ethers");

let provider = new ethers.WebSocketProvider(
  "wss://rough-cold-layer.discover.quiknode.pro/15c42900474e5f79da7359398f3e101e2238dd13/"
);

// Uniswap V2 Router
let contractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

// provider.on("block", async (blockNumber) => {
//   console.log(`New block: ${blockNumber}`);
//   try {
//     let block = await provider.getBlock(blockNumber);
//     // for (let txhash of block.transactions) {
//     //   console.log(txhash);
//     // provider.once(txhash, (txn) => {
//     //   if (txn.to && txn.to.toLowerCase() === contractAddress.toLowerCase()) {
//     //     console.log(`txn found on block ${blockNumber}:`);
//     //     console.log(txn);
//     //   }
//     // });
//     // }
//   } catch (error) {
//     console.error(
//       `Error getting transactions for block ${blockNumber}: ${error}`
//     );
//   }
// });

async function main() {
  // getting all the txs in mempool
  const txs = await provider.send("eth_getBlockByNumber", ["pending", true]);

  // finding the tx
  // const tx = txs.filter((tx) => tx.to === contractAddress.toLowerCase());

  console.log(txs);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
