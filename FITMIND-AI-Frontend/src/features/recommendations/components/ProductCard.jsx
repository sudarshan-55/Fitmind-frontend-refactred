import { useState } from 'react'
import { ExternalLink, Heart, ImageOff } from 'lucide-react'
import { MARKETPLACES } from '../../../constants/options'
import { formatCurrency } from '../../../utils/formatters'

export default function ProductCard({ product, sample, saved, onToggleSave }) {
  const [broken, setBroken] = useState(false)
  const marketplace = MARKETPLACES[product.marketplace] || product.marketplace
  return (
    <article className="card h-100">
      {product.imageUrl && !broken ? (
        <img className="card-img-top product-image" src={product.imageUrl} alt={product.title} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <div className="card-img-top product-image d-flex flex-column align-items-center justify-content-center text-secondary">
          <ImageOff size={28} aria-hidden="true" /><small>No image</small>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2">
          <h2 className="h6">{product.title}</h2>
          <button type="button" className="btn btn-sm p-0 align-self-start" aria-pressed={saved}
            aria-label={`${saved ? 'Unsave' : 'Save'} ${product.title}`} onClick={onToggleSave}>
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="small text-secondary mb-1">{marketplace}{sample && <span className="badge text-bg-light border ms-2">Sample</span>}</p>
        <p className="fw-semibold mb-1">{product.price === null ? 'Price not available' : formatCurrency(product.price)}</p>
        <p className="small mb-3">{product.recommendedSize ? `Recommended size: ${product.recommendedSize}` : 'Size: no verified size chart'}</p>
        {product.url && (
          <a className="btn btn-sm btn-outline-primary mt-auto" href={product.url} target="_blank" rel="noopener noreferrer">
            {product.linkType === 'search' ? `Search on ${marketplace}` : 'View product'} <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}
