import { useAuth } from '../context/AuthContext'
import { Modal } from '@mui/material'
import AuthModal from './Modals/AuthModal'
import { useState } from 'react'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className="h-10 w-screen">
      <h1>Ecommerce</h1>
      {isAuthenticated ? <button>Logout</button> : <button>Login</button>}
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
