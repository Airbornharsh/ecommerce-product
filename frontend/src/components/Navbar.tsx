import { useAuth } from '../context/AuthContext'
import { Button, Modal } from '@mui/material'
import AuthModal from './Modals/AuthModal'
import { useEffect, useState } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    setOpen(!isAuthenticated)
  }, [isAuthenticated])

  return (
    <div className="fixed flex h-10 w-screen items-center justify-between bg-white px-2 shadow-md">
      <h1>Ecommerce</h1>
      <div className="flex items-center gap-2">
        <ShoppingCartIcon
          onClick={() => {
            window.location.href = '/cart'
          }}
        />
        {isAuthenticated ? (
          <Button
            style={{
              color: 'white',
              backgroundColor: 'red'
            }}
            onClick={logout}
          >
            Logout
          </Button>
        ) : (
          <Button
            style={{
              color: 'white',
              backgroundColor: 'green'
            }}
            onClick={() => setOpen(true)}
          >
            Login
          </Button>
        )}
      </div>
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
