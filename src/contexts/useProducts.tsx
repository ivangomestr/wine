import { Product, ProductsContextData } from 'interfaces/types'
import { ProductsProviderProps } from 'interfaces/props'

import { createContext, useState, useEffect, useContext } from 'react'
import { api } from 'services/api'

const ProductsContext = createContext<ProductsContextData>(
  {} as ProductsContextData
)

export const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const [data, setData] = useState<any>({})
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        const response = await api.get(`/products?page=${page}&limit=9`)
        setData(response.data)
        setProducts(response.data.items)
        setIsLoading(false)

        return response.data
      } catch (err) {
        setIsLoading(false)
        console.log(err.response.data)
      }
    }

    loadProducts()
  }, [page])

  const productsFiltered = products.filter((product) => {
    if (search === null) {
      return product
    }

    if (typeof search === 'string') {
      if (
        product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ) {
        return product
      }
    }
  })

  return (
    <ProductsContext.Provider
      value={{
        data,
        page,
        setPage,
        products: productsFiltered,
        setSearch,
        isLoading
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)

  return context
}
