import { useState } from 'react'
import { useReviewStore } from '../store/reviewStore'
import { useOrderStore } from '../store/orderStore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { FiStar } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function ReviewSection({ productId, showFormOnly = false }) {
  const [user] = useAuthState(auth)
  const { addReview, getProductReviews, hasUserReviewed, getAverageRating } = useReviewStore()
  const { orders } = useOrderStore()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // --- SAFE CHECK: orders may be undefined initially ---
  const hasPurchased =
    !!user &&
    (orders ?? []).some(order =>
      order.items?.some(item => String(item.id) === String(productId))
    )

  const reviews = getProductReviews(productId) ?? []
  const avgRating = getAverageRating(productId) ?? 0
  const userHasReviewed = user && hasUserReviewed(productId, user.uid)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!user || !hasPurchased) return
    if (userHasReviewed) return

    addReview(productId, user.uid, rating, comment)
    setComment('')
    setRating(5)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  // If showFormOnly is true, only show the form (for order details page)
  if (showFormOnly) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4">
        {user && hasPurchased && !userHasReviewed ? (
          <form onSubmit={onSubmit} className="space-y-3">
            <h4 className="text-sm font-semibold">Write a Review</h4>
            <div>
              <label className="block text-xs font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className="p-2 transition hover:scale-110"
                  >
                    <FiStar
                      size={20}
                      fill={i <= rating ? 'currentColor' : 'none'}
                      className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full p-2 border rounded text-sm"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
            >
              {submitted ? '✓ Review submitted' : 'Submit Review'}
            </button>
          </form>
        ) : userHasReviewed ? (
          <p className="text-sm text-gray-500">✓ You have already reviewed this product</p>
        ) : (
          <p className="text-sm text-gray-500">You can only review products you have purchased</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4 animate-fadeIn">
      {/* Rating Summary */}
      <div className="mb-6 pb-4 border-b">
        <h3 className="font-semibold mb-3">Ratings & Reviews ({reviews.length})</h3>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={18}
                fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">({reviews.length} reviews)</div>
        </div>
      </div>

      {/* Reviews List Only - No Form */}
      {reviews.length === 0 ? (
        <p className="text-xs text-gray-500">No reviews yet</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, idx) => (
            <div
              key={review.id}
              className="border-t pt-3 animate-fadeIn"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  {review.userId === user?.uid && (
                    <div className="text-xs text-gray-400 mt-1">(Your review)</div>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  {review.createdAt ? dayjs(review.createdAt).fromNow() : 'Just now'}
                </div>
              </div>

              {review.comment && (
                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
