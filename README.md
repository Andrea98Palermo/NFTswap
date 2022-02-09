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

On a terminal, launch a local node

```bash
cd contract
yarn exec hardhat node
```

This command launch an HTTP and WebSocket JSON-RPC server @ `http://127.0.0.1:8545/`, you can use it as Web3 Provider on [Remix](https://remix.ethereum.org/).

On another terminal, deploy it

```bash
cd contract
yarn deploy
```

### Deploy on a Testnet

#### Prerequisite

* An [Alchemy](https://www.alchemy.com/) account with a valid project.

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
