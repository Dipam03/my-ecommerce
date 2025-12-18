# TODO: Make Order Status Working

- [x] Update deliveryStatus in addOrder to include 'Processing' after 'Confirmed'
- [x] Modify cancelOrder to update deliveryStatus with 'Cancelled' as completed
- [x] Remove special case for cancelled orders in OrderTracking.jsx and always display deliverySteps
- [x] Add proper colors to status badges in Orders.jsx (red for cancelled, yellow for processing, etc.)
- [x] Fix the dark mode class typo in OrderTracking.jsx: "dark:bg-white-800" to "dark:bg-gray-800"
- [x] Commit changes to GitHub
