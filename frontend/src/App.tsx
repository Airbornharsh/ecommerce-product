import { Box, Image, Text, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const ProductCard = () => {
  const product = {
    id: 1,
    name: 'Product 1',
    price: 100,
    images: ['https://via.placeholder.com/150']
  }
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="5">
      <Image src={product.images[0]} alt={product.name} />
      <Text mt="2" fontWeight="bold">
        {product.name}
      </Text>
      <Text>{product.price}</Text>
      <Link as={RouterLink} to={`/product/${product.id}`}>
        View Details
      </Link>
    </Box>
  )
}

export default ProductCard
