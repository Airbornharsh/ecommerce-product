import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Product } from '../utils/types'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@mui/material'
import { useLoader } from '../context/LoaderContext'

const Product2 = () => {
  const { setToastMessage } = useLoader()
  const { addToCart, isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product>({
    id: 0,
    description: '',
    images: [],
    name: '',
    price: 0
  })
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)

  const { id } = useParams()

  const fetchProduct = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND_URL}/api/products/${id}`
    )
    const responseData = response.data
    setProduct(responseData.product)
  }

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const buyNow = async () => {
    if (!isAuthenticated) {
      alert('Please login to buy the product')
      return
    }
    setToastMessage('Product Bought')
  }

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center gap-10 rounded-lg bg-white mt-10">
      <div className="mb-10 w-[90vw] max-w-[85rem] flex-col items-center max1000:w-[96vw]">
        <div className="flex h-full justify-center gap-10 rounded-lg bg-white max1250:gap-4 max1000:w-[96vw] max1000:flex-col">
          <div className="flex gap-10 max1250:gap-4 max1000:hidden">
            <div className="scrollBar flex h-[70vh] w-[8rem] flex-col gap-2 overflow-auto max1250:w-[6rem]">
              {product.images.map((image, index) => (
                <img
                  key={image + index}
                  src={image}
                  alt=""
                  className={`h-[12rem] w-[8rem] rounded-md object-cover opacity-50 hover:opacity-90 max1250:h-[9rem] max1250:w-[6rem] ${index === activeImage && 'opacity-100'}`}
                  style={{
                    border:
                      index === activeImage
                        ? '2px solid #48A9A6'
                        : '2px solid transparent',
                    opacity: index === activeImage ? 1 : ''
                  }}
                  onClick={() => {
                    setActiveImage(index)
                  }}
                />
              ))}
            </div>
            <img
              src={product.images[activeImage]}
              alt=""
              className="h-[70vh] max-h-[45rem] w-[70vw] max-w-[30rem] rounded-xl object-cover max1250:max-h-[30rem] max1250:w-[50vw] max1250:max-w-[20rem]"
            />
          </div>
          <div className="flex gap-10 max1250:gap-4 min1000:hidden">
            {product.images.length >= 1 && (
              <div className="scrollBar flex gap-2 overflow-auto">
                {product.images.map((image) => (
                  <img
                    src={image}
                    alt=""
                    className="h-[] max-h-[45rem] w-[70vw] max-w-[40rem] rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium">{product.name}</h3>
            <span></span>
            <div className="border-b-[0.02rem] pb-1 pt-2">
              <span className="px-2 text-sm font-medium text-gray-500">
                MRP ₹{product.price / 100}
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <p className="font-bold">QUANTITY:</p>
              <div className="flex ">
                <p
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border-[0.02rem] border-r-0 text-2xl"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity((q) => q - 1)
                    }
                  }}
                >
                  -
                </p>
                <input
                  type="number"
                  value={quantity}
                  disabled={true}
                  className="flex h-10 max-w-10 items-center justify-center border-[0.02rem] pl-2 pr-1 focus:outline-none"
                />
                <p
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border-[0.02rem] border-r-0 text-2xl"
                  onClick={() => {
                    setQuantity((q) => q + 1)
                  }}
                >
                  +
                </p>
              </div>
            </div>
            <Button
              onClick={async () => {
                addToCart(product.id, quantity)
              }}
              className="w-48"
              variant="contained"
              style={{
                color: 'white',
                backgroundColor: 'blue'
              }}
            >
              Add to Cart
            </Button>
            <Button
              onClick={buyNow}
              className="w-48"
              variant="contained"
              style={{
                color: 'white',
                backgroundColor: 'blue'
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product2
