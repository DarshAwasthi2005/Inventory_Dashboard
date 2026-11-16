import { useLiveQuery } from 'dexie-react-hooks'
import { productService } from '../../db/productService'

// undefined = abhi load ho raha hai. DB badalte hi ye apne aap naya data deta hai.
export function useProducts() {
  return useLiveQuery(() => productService.getAll(), [])
}
