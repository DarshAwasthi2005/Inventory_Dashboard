import { useLiveQuery } from 'dexie-react-hooks'
import { productService } from '../../db/productService'

// Returns undefined while loading and re-renders automatically when the database changes.
export function useProducts() {
  return useLiveQuery(() => productService.getAll(), [])
}
