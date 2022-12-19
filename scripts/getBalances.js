const config = require('../src/config.json')

async function main() {
  let accounts, deployer, minter

  // Create the accounts
  accounts = await ethers.getSigners()
  deployer = accounts[0]
  minter = accounts[1]

  // print all users balances
  for (let i = 0; i < accounts.length; i++) {
    account = accounts[i].address
    deployerBalance = await ethers.provider.getBalance(account)
    console.log(
      `${i}: ${account} ${await ethers.utils.formatEther(
        deployerBalance.toString()
      )}`
    )
  }

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()

  // Fetch deployed token
  const dao = await ethers.getContractAt('DAO', config[chainId].dao.address)
  // console.log(`DAO fetched: ${dao.address}\n`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
