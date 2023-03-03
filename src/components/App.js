import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'
import { format, bignumber } from 'mathjs'

// Components
import Navigation from './Navigation'
import Create from './Create'
import Proposals from './Proposals'
import Loading from './Loading'

// ABIs: Import your contract ABIs here
import DAO_ABI from '../abis/DAO.json'
import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
import config from '../config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [dao, setDao] = useState(null)
  const [token, setToken] = useState(null)
  const [treasuryBalance, setTreasuryBalance] = useState(0)

  const [chainId, setChainId] = useState(null)
  const [account, setAccount] = useState(null)

  const [proposals, setProposals] = useState(null)
  const [quorum, setQuorum] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const { chainId } = await provider.getNetwork()
    setChainId(chainId)

    // Reload page when network changes
    window.ethereum.on('chainChanged', async () => {
      window.location.reload()
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })

    // Fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })

    // Initiate contracts
    const dao = new ethers.Contract(
      config[chainId].dao.address,
      DAO_ABI,
      provider
    )
    setDao(dao)

    const token = new ethers.Contract(
      config[chainId].token.address,
      TOKEN_ABI,
      provider
    )
    setToken(token)

    // Fetch treasury balance
    let treasuryBalance = await provider.getBalance(dao.address)
    treasuryBalance = ethers.utils.formatUnits(treasuryBalance, 18)
    setTreasuryBalance(treasuryBalance)

    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch proposals count
    const count = await dao.proposalCount()
    const items = []

    for (let i = 0; i < count; i++) {
      const proposal = await dao.proposals(i + 1)
      items.push(proposal)
    }

    setProposals(items)

    // Fetch quorum
    setQuorum(await dao.quorum())

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return (
    <Container>
      <Navigation account={account} setAccount={setAccount} chainId={chainId} />

      <h1 className="my-4 text-center">Welcome to our DAO!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Create provider={provider} dao={dao} setIsLoading={setIsLoading} />

          <hr />
          <p className="text-center">
            <strong>Treasury Balance: </strong>
            {treasuryBalance} ETH
          </p>

          <p className="text-center">
            <strong>Quorum: </strong>
            {ethers.utils.commify(quorum.toString())} (
            {format(bignumber(quorum.toString()), {
              notation: 'exponential',
              precision: 1,
            })}
            )
          </p>
          <hr />

          <Proposals
            provider={provider}
            dao={dao}
            token={token}
            proposals={proposals}
            quorum={quorum}
            setIsLoading={setIsLoading}
          />
        </>
      )}
    </Container>
  )
}

export default App
