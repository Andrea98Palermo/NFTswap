# NFTswap

How to run the frontend:
### Prerequisites
* Node.js > 12
* Yarn, install [guide](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
  
### Run
On terminal:
```bash
cd frontend
yarn install
yarn start 
```
You can now visit `http://localhost:3000/`
### Run using Docker
```
cd frontend
docker build -t blockchain-frontend .
docker run -p 8000:80 blockchain-frontend:latest
```
You can now visit `http://localhost:8000/`
