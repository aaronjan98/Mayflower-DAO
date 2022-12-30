import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ethers } from 'ethers'

const Proposals = ({
  provider,
  dao,
  token,
  proposals,
  quorum,
  setIsLoading,
}) => {
  const [voted, setVoted] = useState(new Set())
  const [recipientBalances, setRecipientBalances] = useState([])

  const retrieveRecipientBalances = async () => {
    const balances = await Promise.all(
      // Ether balance
      proposals.map(async proposal => {
        const recipient = proposal.recipient
        const balance = await provider.getBalance(recipient)
        return ethers.utils.formatEther(balance)
      })
    )

    let recBalances = []
    balances.forEach((balance, index) => {
      recBalances.push({ index, balance })
    })
    setRecipientBalances(recBalances)
  }

  const getBalance = index => {
    const item = recipientBalances.find(item => {
      return item.index === index
    })
    return item ? item.balance : null
  }

  // Make vote button dissapear once user votes
  const updateVotedStatus = async () => {
    const accounts = await provider.listAccounts()
    const address = ethers.utils.getAddress(accounts[0])

    const voteStatuses = await Promise.all(
      proposals.map(async proposal => {
        const id = proposal.id
        const proposalStatus = await dao.votes(address, id)
        return proposalStatus.voted
      })
    )

    const newVoted = new Set()
    voteStatuses.forEach((voteStatus, index) => {
      if (voteStatus === true) {
        newVoted.add(proposals[index].id)
      }
    })

    setVoted(newVoted)
  }

  useEffect(() => {
    retrieveRecipientBalances()
    updateVotedStatus()
  }, [proposals, provider])

  const voteHandler = async id => {
    try {
      const signer = await provider.getSigner()
      const transaction = await dao.connect(signer).vote(id, true)
      await transaction.wait()
    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

  const finalizeHandler = async id => {
    try {
      const signer = await provider.getSigner()
      const transaction = await dao.connect(signer).finalizeProposal(id)
      await transaction.wait()
    } catch {
      window.alert('User rejected or transaction reverted')
    }

    setIsLoading(true)
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Proposal Name</th>
          <th>Recipient Address</th>
          <th>Recipient Balance</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Total Votes</th>
          <th>Cast Vote</th>
          <th>Finalize</th>
        </tr>
      </thead>
      <tbody>
        {proposals.map((proposal, index) => (
          <tr key={index}>
            <td>{proposal.id.toString()}</td>
            <td>{proposal.name}</td>
            <td>{proposal.recipient}</td>
            <td>{getBalance(index)} ETH</td>
            <td>{ethers.utils.formatEther(proposal.amount)} ETH</td>
            <td>{proposal.finalized ? 'Approved' : 'In Progress'}</td>
            <td>{ethers.utils.commify(proposal.votes)}</td>
            <td>
              {!proposal.finalized &&
                proposal.votes < quorum &&
                !voted.has(proposal.id) && (
                  <Button
                    variant="primary"
                    style={{ width: '100%' }}
                    onClick={() => voteHandler(proposal.id)}
                  >
                    Vote
                  </Button>
                )}
            </td>
            <td>
              {!proposal.finalized && proposal.votes > quorum && (
                <Button
                  variant="primary"
                  style={{ width: '100%' }}
                  onClick={() => finalizeHandler(proposal.id)}
                >
                  Finalize
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Proposals
