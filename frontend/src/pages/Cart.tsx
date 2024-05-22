import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from '@mui/material'
import ReactPaginate from 'react-paginate'

const Cart = () => {
  const {
    cartItems,
    getCartItems,
    totalCartPages,
    removeFromCart,
    isAuthenticated
  } = useAuth()
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (isAuthenticated) getCartItems(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, page])

  return (
    <div className="mt-10">
      <h1 className="mx-2 mb-4 text-2xl font-bold">Your Cart</h1>
      <ul className="mx-2 flex flex-col">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="mb-4 flex justify-between rounded border p-4 max500:flex-col max500:gap-2"
          >
            <div className="flex gap-2 max500:flex-col">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="h-32 w-32 rounded-lg object-cover max500:h-60 max500:w-full max500:rounded-lg max500:rounded-t-lg"
              />
              <div>
                <h2 className="text-lg font-bold">{item.product.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Total Price: ₹{(item.price * item.quantity) / 100}</p>
              </div>
            </div>
            <Button
              onClick={() => removeFromCart(item.id)}
              className="h-10 max500:w-24"
              variant="contained"
              style={{
                color: 'white',
                backgroundColor: 'red'
              }}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalCartPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(data) => {
          setPage(data.selected + 1)
        }}
        containerClassName={'pagination'}
      />
    </div>
  )
}

export default Cart
