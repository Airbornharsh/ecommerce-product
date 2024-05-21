import { useState } from 'react'
import { AuthFormData } from '../../utils/types'
import { useAuth } from '../../context/AuthContext'

const AuthModal = () => {
  const { signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState<AuthFormData>({
    email: 'admin@example.com',
    password: 'admin'
  })

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      await signIn(formData)
    } catch (e) {
      /* empty */
    }
  }

  const handleSignup = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      await signUp(formData)
    } catch (e) {
      /* empty */
    }
  }

  return (
    <>
      {isLogin ? (
        <form className="w-[90vw] max-w-[25rem] bg-white px-2 py-2 rounded">
          <div className="flex flex-col space-y-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="p-2 border border-gray-300 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="p-2 border border-gray-300 rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <p
              className="text-blue-500 text-xs cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              Don't have an Account
            </p>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      ) : (
        <form className="w-[90vw] max-w-[25rem] bg-white px-2 py-2 rounded">
          <div className="flex flex-col space-y-4">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="p-2 border border-gray-300 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="p-2 border border-gray-300 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="p-2 border border-gray-300 rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <p
              className="text-blue-500 text-xs cursor-pointer"
              onClick={() => setIsLogin(true)}
            >
              Already have an Account
            </p>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default AuthModal
