import { useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ethers } from 'ethers'

const Proposals = ({ provider, dao, proposals, quorum, setIsLoading }) => {
  const [voted, setVoted] = useState(false)

  const voteHandler = async id => {
    try {
      const signer = await provider.getSigner()
      const transaction = await dao.connect(signer).vote(id, true)
      await transaction.wait()
      const accounts = await provider.listAccounts()

      const proposal = await dao.votes(ethers.utils.getAddress(accounts[0]), id)
      const voteStatus = proposal.voted
      setVoted(voteStatus)
      console.log('voted: ', voteStatus)
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
            <td>{ethers.utils.formatEther(proposal.amount)} ETH</td>
            <td>{proposal.finalized ? 'Approved' : 'In Progress'}</td>
            <td>{proposal.votes.toString()}</td>
            <td>
              {console.log('voted from return ', voted)}
              {!proposal.finalized && proposal.votes < quorum && (
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
