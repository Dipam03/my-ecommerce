import { useState } from 'react'
import { useReviewStore } from '../store/reviewStore'
import { useOrderStore } from '../store/orderStore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { FiStar } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function ReviewSection({ productId }) {
  const [user] = useAuthState(auth)
  const { addReview, getProductReviews, hasUserReviewed, getAverageRating } = useReviewStore()
  const { items: orders } = useOrderStore()

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

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded mb-4 animate-fadeIn">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Ratings & Reviews ({reviews.length})</h3>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold">{avgRating || 'N/A'}</div>

          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {user ? (
        hasPurchased ? (
          <form onSubmit={onSubmit} className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <h4 className="text-sm font-medium mb-2">
              {userHasReviewed ? '✓ You already reviewed this product' : 'Write a review'}
            </h4>

            {!userHasReviewed && (
              <>
                <div className="mb-2">
                  <label className="block text-xs font-medium mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <FiStar
                          size={20}
                          fill={i <= rating ? '#fbbf24' : 'none'}
                          stroke={i <= rating ? '#fbbf24' : 'currentColor'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience (optional)"
                    className="w-full p-2 text-xs border rounded bg-white dark:bg-gray-800"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-gray-900 py-1 rounded text-xs hover:bg-gray-100 transition-colors"
                >
                  {submitted ? '✓ Submitted' : 'Submit Review'}
                </button>
              </>
            )}
          </form>
        ) : (
          <p className="text-xs text-amber-600 mb-4 p-2 bg-amber-50 rounded">
            💡 You can only review products you've purchased
          </p>
        )
      ) : (
        <p className="text-xs text-gray-500 mb-4">
          <a href="/login" className="text-gray-900 font-medium">Login</a> to write a review
        </p>
      )}

      {/* Reviews List */}
      <div className="space-y-2">
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((review, idx) => (
            <div
              key={review.id}
              className="border-t pt-2 animate-fadeIn"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-1 text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={12}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    {review.userId === user?.uid && '(Your review)'}
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {review.createdAt ? dayjs(review.createdAt).fromNow() : 'Just now'}
                </div>
              </div>

              {review.comment && (
                <p className="text-xs mt-1">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
