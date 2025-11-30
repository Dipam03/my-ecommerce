import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [],
      addReview: (productId, userId, rating, comment) => {
        const newReview = {
          id: Date.now(),
          productId,
          userId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          reviews: [newReview, ...s.reviews]
        }))
      },
      getProductReviews: (productId) => {
        const allReviews = get().reviews
        return allReviews.filter(r => r.productId === productId)
      },
      hasUserReviewed: (productId, userId) => {
        const allReviews = get().reviews
        return allReviews.some(r => r.productId === productId && r.userId === userId)
      },
      getAverageRating: (productId) => {
        const reviews = get().getProductReviews(productId)
        if (reviews.length === 0) return 0
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        return Math.round(avg * 10) / 10
      },
    }),
    { name: 'reviews' }
  )
)
