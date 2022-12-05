import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'

const Create = ({ provider, dao, setIsLoading }) => {
  return (
    <Form>
      <Form.Group style={{ maxWidth: '450px', margin: '50px auto' }}>
        <Form.Control type="text" placeholder="Enter name" className="my-2" />
        <Form.Control
          type="number"
          placeholder="Enter amount"
          className="my-2"
        />
        <Form.Control
          type="text"
          placeholder="Enter address"
          className="my-2"
        />
        <Button variant="primary" type="submit" style={{ width: '100%' }}>
          Create Proposal
        </Button>
      </Form.Group>
    </Form>
  )
}

export default Create
