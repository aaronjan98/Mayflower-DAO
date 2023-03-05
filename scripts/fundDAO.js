const hre = require('hardhat')
const config = require('../src/config.json')

const tokens = n => {
  return ethers.utils.parseEther(n.toString())
}

const ether = tokens

async function main() {
  console.log(`Fetching accounts & network...\n`)

  const accounts = await ethers.getSigners()
  const funder = accounts[0]

  let transaction

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()

  // Fetch deployed dao
  const dao = await ethers.getContractAt('DAO', config[chainId].dao.address)
  console.log(`DAO fetched: ${dao.address}\n`)

  // Funder sends Ether to DAO treasury
  transaction = await funder.sendTransaction({
    to: dao.address,
    value: ether(8),
  })
  await transaction.wait()
  console.log(`Sent funds to dao treasury...\n`)

  console.log(`Finished.\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
