import { useAuth } from '../context/AuthContext'
import { Button, Modal } from '@mui/material'
import AuthModal from './Modals/AuthModal'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setOpen(!isAuthenticated)
  }, [isAuthenticated])

  return (
    <div className="h-10 w-screen flex justify-between items-center px-2">
      <h1>Ecommerce</h1>
      {isAuthenticated ? (
        <Button
          style={{
            color: 'white',
            backgroundColor: 'red'
          }}
        >
          Logout
        </Button>
      ) : (
        <Button
          style={{
            color: 'white',
            backgroundColor: 'blue'
          }}
          onClick={() => setOpen(true)}
        >
          Login
        </Button>
      )}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <AuthModal />
      </Modal>
    </div>
  )
}

export default Navbar
