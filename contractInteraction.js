require("dotenv").config();
const ethers = require("ethers");
const UniswapRouterArtifact = require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json");

// TO DO: Copy-paste your Alchemy Rinkeby HTTP Endpoint
const url = process.env.ALCHEMY_URL;

// connect to JSON-RPC provider
const provider = new ethers.providers.JsonRpcProvider(url);

// import private key from .env file and initialize a wallet
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

//addresses and ABIs necessary
const chainShotTokenAddress = "0x45075E4BdB8025f4B5c71876399FE5F8C89a3c73";
const WETH = "0xc778417e063141139fce010982780140aa0cd5ab";
const uniswapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const uniswapABI = UniswapRouterArtifact.abi;

// connect contract to its abi so that we can communicate with it via this instance
const uniswap = new ethers.Contract(uniswapRouterAddress, uniswapABI, provider);

// create object with transaction details
let obj = {
  tokenIn: WETH,
  tokenOut: chainShotTokenAddress,
  fee: 3000,
  recipient: wallet.getAddress(),
  deadline: Date.now() + 86400,
  amountIn: ethers.utils.parseUnits(".1", "ether"),
  amountOutMinimum: 1,
  sqrtPriceLimitX96: 0,
};

// start of async function where we will make the function call
async function main() {
  // connect Uniswap instance to wallet and call exactInputSingle() function
  const tx = await uniswap.connect(wallet).exactInputSingle(obj, {
    value: ethers.utils.parseUnits(".1", "ether"),
  });

  await tx.wait();

  console.log("Go to the URL below to see your deposit details: ");
  console.log("https://rinkeby.etherscan.io/tx/" + tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
