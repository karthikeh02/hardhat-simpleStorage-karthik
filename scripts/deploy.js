//imports
const { ethers, run, network } = require("hardhat")

//async main

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contracts...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    //await simpleStorage.getDeployedCode()

    // whats a private key?
    // whats a rpc url?
    console.log(`Deployed contracts to: ${simpleStorage.target}`)
    // what happens if we deploy this to our hardhat network?
    //because hardhat happens in our local environment
    // this is not like our rinkeby,sepolia

    //4 == 4 true
    //4 =="4" true
    //4 === "4" false

    //WHAT we are doing here is if the sepolia chain id is 11155111 and if the
    //etherscan api key exists in the env then do this
    //this network config is getted by require network
    //we can console.log this to see more of the netweork
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waitin for")
        await simpleStorage.waitForDeployment(6)
        await verify(simpleStorage.target, [])
    }
    const currentValue = await simpleStorage.retrieve()
    console.log(`current value is ${currentValue}`)

    //update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is ${updatedValue}`)
}
// this verify function is onlyethereum args) {
//since we dont have constructor in simpleStorage
async function verify(contractAddress, args) {
    console.log("Verifyinggggg....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowercase().includes("already been verified")) {
            console.log("Already verified")
        } else {
            console.log(e)
        }
    }
}

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
