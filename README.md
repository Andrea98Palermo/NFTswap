# NFTswap

How to run the frontend:
### Prerequisite
* Node.js > 12
* Yarn, install [guide](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
* A valid `REACT_APP_ALCHEMY_KEY` environment variable set, you can get the API Key from the Alchemy console, put it in a `.env` file, replacing the `.env.example` file.
  
### Run
On terminal:
```bash
cd frontend
yarn install
yarn start 
```
### Run using Docker
```
docker build -t blockchain-frontend .
docker run -p 8000:80 blockchain-frontend:latest
```
