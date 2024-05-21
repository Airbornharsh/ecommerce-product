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
        className="border p-2 mb-1 mt-1 w-[80vw] ml-1 max-w-[20rem] max500:w-[94vw] max500:max-w-[94vw]"
      />
      <ul className="flex flex-wrap gap-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 w-[48vw] max-w-[20rem] max500:w-[94vw] max500:max-w-[94vw] bg-white rounded-lg shadow-md"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-80 object-cover sm:h-60 max500:w-full rounded-t-lg"
              />
            </Link>
            <h2 className="mt-2 text-lg font-bold">{product.name}</h2>
            <p className="mt-2">${product.price}</p>
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
          setPage(data.selected)
        }}
        containerClassName={'pagination'}
      />
    </div>
  )
}

export default Home
