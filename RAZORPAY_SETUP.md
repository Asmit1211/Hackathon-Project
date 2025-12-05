# Razorpay Integration Setup & Troubleshooting

## Quick Fix Summary

I've fixed the following issues with your Razorpay integration:

1. ✅ **Created frontend `.env` file** with correct `VITE_RAZORPAY_KEY_ID`
2. ✅ **Fixed CORS origin** in backend from port 8080 to 5173 (Vite default)
3. ✅ **Removed hardcoded fallback key** that didn't match your backend
4. ✅ **Improved error handling** in both frontend and backend
5. ✅ **Added better logging** for debugging

## Environment Setup

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_RnsEjnqlfCIF5x
```

### Backend (backend/.env)
```env
RAZORPAY_KEY_ID=rzp_test_RnsEjnqlfCIF5x
RAZORPAY_KEY_SECRET=4bNKczWt56UAF3eJhKIK1y1O
CORS_ORIGIN=http://localhost:5173
```

## Testing Razorpay Configuration

### 1. Test Backend Razorpay Connection
```bash
node backend/test-razorpay.js
```

This will verify:
- ✅ Razorpay credentials are set
- ✅ Razorpay SDK can connect
- ✅ Test order creation works

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
Cursed Relics API listening on port 5000 in development mode
MongoDB connected: ...
```

### 3. Start Frontend Server
```bash
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Common Issues & Solutions

### Issue 1: "Razorpay key missing"
**Cause:** Frontend `.env` file missing or not loaded

**Solution:**
1. Ensure `.env` file exists in project root (not in `src/`)
2. Restart Vite dev server after creating/modifying `.env`
3. Check browser console for `import.meta.env.VITE_RAZORPAY_KEY_ID`

### Issue 2: "Failed to create Razorpay order"
**Cause:** Backend not running or CORS issues

**Solution:**
1. Ensure backend is running on port 5000
2. Check backend console for errors
3. Verify CORS_ORIGIN matches frontend URL
4. Test backend endpoint directly:
```bash
curl -X POST http://localhost:5000/api/v1/payments/razorpay/order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "INR"}'
```

### Issue 3: "Razorpay is not configured"
**Cause:** Missing or invalid Razorpay credentials in backend

**Solution:**
1. Check `backend/.env` has both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
2. Verify credentials are valid (test mode keys start with `rzp_test_`)
3. Run test script: `node backend/test-razorpay.js`

### Issue 4: "Razorpay SDK not available"
**Cause:** Script failed to load from Razorpay CDN

**Solution:**
1. Check internet connection
2. Check browser console for script loading errors
3. Verify no ad blockers are blocking Razorpay CDN
4. Try opening https://checkout.razorpay.com/v1/checkout.js directly

### Issue 5: Payment verification fails
**Cause:** Signature mismatch or missing payment record

**Solution:**
1. Ensure `RAZORPAY_KEY_SECRET` matches the key ID
2. Check backend logs for verification errors
3. Verify MongoDB is connected and Payment model is working

## Testing the Full Flow

1. **Add items to cart** on the homepage
2. **Go to checkout** page
3. **Fill in contact details** (name and email required)
4. **Click "Pay with Razorpay"**
5. **Razorpay modal should open** with test payment options
6. **Use test card details:**
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
7. **Payment should succeed** and redirect to homepage

## Debugging Tips

### Check Frontend Environment Variables
Open browser console and run:
```javascript
console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);
console.log(import.meta.env.VITE_API_BASE_URL);
```

### Check Backend Logs
Backend logs will show:
- Order creation attempts
- Payment verification attempts
- Any errors with full stack traces

### Check Network Tab
In browser DevTools Network tab, look for:
- `POST /api/v1/payments/razorpay/order` - Should return 201 with order data
- `POST /api/v1/payments/razorpay/verify` - Should return 200 after payment

### Check MongoDB
Verify Payment records are being created:
```javascript
// In MongoDB shell or Compass
db.payments.find().sort({createdAt: -1}).limit(5)
```

## Production Checklist

Before going live:

- [ ] Replace test keys with live keys (`rzp_live_...`)
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Enable authentication on Razorpay order endpoint (optional)
- [ ] Set up webhook for payment status updates
- [ ] Test with real payment methods
- [ ] Verify payment records are being stored correctly
- [ ] Set up proper error monitoring (Sentry, etc.)

## Support

If issues persist:
1. Run the test script: `node backend/test-razorpay.js`
2. Check browser console for errors
3. Check backend logs for errors
4. Verify all environment variables are set correctly
5. Ensure MongoDB is connected
6. Test backend endpoint with curl/Postman

## Key Changes Made

### Frontend (src/pages/Checkout.tsx)
- Removed hardcoded fallback key that didn't match backend
- Added better error messages with more context
- Improved error logging to console
- Fixed processing state management on modal dismiss
- Added validation for order response structure

### Backend (backend/src/services/paymentService.js)
- Added detailed error logging
- Improved error messages
- Added try-catch around Razorpay API calls
- Better handling of DB persistence failures

### Configuration
- Created `.env` file with correct Razorpay key
- Fixed CORS origin to match Vite default port
- Ensured backend and frontend keys match
