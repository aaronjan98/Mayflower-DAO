const config = require('../src/config.json')

async function main() {
  let accounts, deployer, minter, investor2, investor3, recipient

  // Create the accounts
  accounts = await ethers.getSigners()
  deployer = accounts[0]
  minter = accounts[1]
  investor2 = accounts[2]
  investor3 = accounts[3]
  recipient = accounts[4]

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

  // Fetch deployed contracts
  const token = await ethers.getContractAt(
    'Token',
    config[chainId].token.address
  )
  const dao = await ethers.getContractAt('DAO', config[chainId].dao.address)

  console.log('♥ ´¨`•.¸¸.♫│▌▌▌│▌▌│▌▌▌│▌▌│▌▌▌♫´¨`*•.¸¸♥')

  // print all users' token balances
  for (let i = 0; i < accounts.length; i++) {
    account = accounts[i].address
    const tokenBalance = await token.balanceOf(ethers.utils.getAddress(account))
    console.log(
      `${i}: ${account} ${await ethers.utils.formatEther(
        tokenBalance.toString()
      )}`
    )
  }

  console.log('₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪')

  // print DAO balance

  daoBalance = await token.balanceOf(ethers.utils.getAddress(dao.address))
  console.log(
    '₪\n' +
      '₪ ' +
      `DAO Token Balance: ${await ethers.utils.formatEther(daoBalance)}`
  )

  // Fetch treasury balance
  let treasuryBalance = await ethers.provider.getBalance(dao.address)
  treasuryBalance = ethers.utils.formatUnits(treasuryBalance, 18)
  console.log('₪\n' + '₪ ' + 'DAO Eth Balance: ', treasuryBalance)

  console.log('₪\n' + '₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪₪')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
