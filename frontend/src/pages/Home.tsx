import { useEffect, useState } from 'react'
import { useProduct } from '../context/ProductContext'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReactPaginate from 'react-paginate'
import { Button } from '@mui/material'

const Home = () => {
  const { totalProductPages, products, setProducts } = useProduct()
  const { isAuthenticated, addToCart } = useAuth()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(parseInt(searchParams.get('page')!) || 1)
  const [search, setSearch] = useState(searchParams.get('search') || '')

  useEffect(() => {
    if (!isAuthenticated) return
    setProducts(page, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, isAuthenticated])
  return (
    <div>
      <input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-1 ml-1 mt-1 w-[80vw] max-w-[20rem] border p-2 max500:w-[94vw] max500:max-w-[94vw]"
      />
      <ul className="flex flex-wrap gap-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="w-[48vw] max-w-[20rem] rounded-lg border bg-white p-4 shadow-md max500:w-[94vw] max500:max-w-[94vw]"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-80 rounded-t-lg object-cover sm:h-60 max500:w-full"
              />
            </Link>
            <h2 className="mt-2 text-lg font-bold">{product.name}</h2>
            <p className="mt-2">₹{product.price / 100}</p>
            <div className="flex flex-col gap-2">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addToCart(product.id)
                }}
              >
                Add to Cart
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalProductPages}
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

export default Home
