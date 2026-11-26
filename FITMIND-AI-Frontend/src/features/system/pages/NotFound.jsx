import { Link } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/States'

export default function NotFound() {
  return (
    <EmptyState title="Page not found">
      <Link className="btn btn-primary" to="/">Back to home</Link>
    </EmptyState>
  )
}
