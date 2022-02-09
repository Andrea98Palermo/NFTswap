# NFTswap

How to run the frontend:

## Prerequisites

* Node.js > 12
* Yarn Classic, aka Yarn v1, you can install it using this [guide](https://classic.yarnpkg.com/lang/en/docs/install/). If you are using macOS a simple `brew install yarn` should work.

## Contract

### Compile

On a terminal, install all the dependencies:

```bash
cd contract
yarn install
yarn compile
```

### Deploy on a local node

#### Launch a local node

On a terminal

```bash
cd contract
yarn exec hardhat node
```

This command launch an HTTP and WebSocket JSON-RPC server @ `http://127.0.0.1:8545/`, you can use it as Web3 Provider on [Remix](https://remix.ethereum.org/).

#### Deploy it

On another terminal, deploy it

```bash
cd contract
yarn deploy
```

### Deploy on a Testnet

#### Prerequisites

* An [Alchemy](https://www.alchemy.com/) account with a valid project on a Testnet (I suggest Mumbai Polygon testnet).
* An account with some funds on the chain selected before, if you choose Mumbai you can obtain them on the [official faucet](https://faucet.polygon.technology/)
* The choosen testnet available as Network in MetaMask, you can add Mumbai Testnet from [here](https://chainlist.org/). (You can find a longer guide [here](https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8))

---

1. Rename `contract/.env.example` in `contract/.env` and put in it the `API_URL` that can be found in the Alchemy Dashboard.
2. [Export your MetaMask private key](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) and put it in the `PRIVATE_KEY` field in the `.env` file
3. Uncomment the `mumbai` part in `contract/hardhat.config.js`
4. Run `yarn deploy:testnet`

## Frontend

### Run

On terminal:

```bash
cd frontend
yarn install
yarn start 
```

You can now visit `http://localhost:3000/`

### Run using Docker

```bash
cd frontend
docker build -t blockchain-frontend .
docker run -p 8000:80 blockchain-frontend:latest
```

You can now visit `http://localhost:8000/`

## The easiest way to test Frontend + "Backend"

1. Launch a local node, as described [here](#launch-a-local-node)
2. Deploy the contract on a local node, as described [before](#deploy-it)
3. Connect MetaMask to `http://127.0.0.1:8545/`
4. Import an Account on Metamask from the private key printed on terminal in step `1`, as described [here](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account)
5. Open `contract\artifacts\contracts\NFTSwap.sol\NFTSwap.json` and paste the content into `frontend\src\contracts\contract-abi.json`.
6. Edit `frontend\src\utils\blockchain.js` with `CONTRACT_ADDRESS` obtained in point `2`
