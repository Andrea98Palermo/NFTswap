async function main() {
    const NFTSwap = await ethers.getContractFactory("NFTSwap");

    // Start deployment, returning a promise that resolves to a contract object
    const contract = await NFTSwap.deploy();
    console.log("Contract deployed to address:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });