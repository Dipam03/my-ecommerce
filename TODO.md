# TODO: Make Order Status Working

- [ ] Update deliveryStatus in addOrder to include 'Processing' after 'Confirmed'
- [ ] Modify cancelOrder to update deliveryStatus with 'Cancelled' as completed
- [ ] Remove special case for cancelled orders in OrderTracking.jsx and always display deliverySteps
- [ ] Add proper colors to status badges in Orders.jsx (red for cancelled, yellow for processing, etc.)
- [ ] Fix the dark mode class typo in OrderTracking.jsx: "dark:bg-white-800" to "dark:bg-gray-800"
- [ ] Commit changes to GitHub
