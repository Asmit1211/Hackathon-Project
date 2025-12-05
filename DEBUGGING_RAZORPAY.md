# Debugging Razorpay Issues

## Current Status

✅ Backend is running on port 5000
✅ Frontend is running on port 8081  
✅ Razorpay credentials are configured correctly
✅ Test order creation works via direct API call

## How to Debug

### Step 1: Check Browser Console

1. Open your browser to http://localhost:8081
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Add items to cart and go to checkout
5. Fill in your name and email
6. Click "Pay with Razorpay"
7. Look for these logs:
   - `Sending Razorpay order request:` - Shows what data is being sent
   - Any error messages in red

### Step 2: Check Network Tab

1. In Developer Tools, go to Network tab
2. Click "Pay with Razorpay"
3. Look for the request to `/payments/razorpay/order`
4. Click on it to see:
   - **Request Payload**: What was sent
   - **Response**: What the server returned
   - **Status Code**: Should be 201 (success) or 422 (validation error)

### Step 3: Check Backend Logs

The backend terminal should show:
- `POST /api/v1/payments/razorpay/order 201` - Success
- `POST /api/v1/payments/razorpay/order 422` - Validation error

If you see 422, look for:
- `Validation failed:` - Shows which fields failed validation
- `Request body:` - Shows what was received

### Step 4: Common Issues

#### Issue: "Razorpay key missing"
**Solution**: 
- Check that `.env` file exists in project root
- Restart frontend server after creating `.env`
- Verify in browser console: `console.log(import.meta.env.VITE_RAZORPAY_KEY_ID)`

#### Issue: 422 Validation Error
**Possible causes**:
1. **Empty cart**: Add items to cart first
2. **Missing contact info**: Fill in name and email
3. **Invalid data types**: Check browser console for the request payload
4. **Notes field**: All values must be strings (not undefined)

**Solution**:
- Check backend logs for "Validation failed:" message
- Compare request payload with expected schema
- Ensure all required fields are filled

#### Issue: "Failed to create Razorpay order"
**Possible causes**:
1. Backend not running
2. Wrong API URL
3. Network/CORS issues

**Solution**:
- Verify backend is running: http://localhost:5000/health
- Check API_BASE_URL in browser console
- Look for CORS errors in browser console

#### Issue: "Razorpay SDK not available"
**Possible causes**:
1. Script failed to load
2. Ad blocker blocking Razorpay
3. Network issues

**Solution**:
- Check browser console for script loading errors
- Disable ad blockers
- Try opening https://checkout.razorpay.com/v1/checkout.js directly

### Step 5: Manual API Test

Test the backend directly:

```powershell
$body = @{
    amount = 100
    currency = 'INR'
    customer = @{
        email = 'test@example.com'
        name = 'Test User'
    }
    items = @(
        @{
            productId = 'test-1'
            title = 'Test Product'
            quantity = 1
            price = 100
            subtotal = 100
        }
    )
    notes = @{
        customerName = 'Test User'
        customerEmail = 'test@example.com'
        customerPhone = ''
        address = ''
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/payments/razorpay/order' -Method Post -Body $body -ContentType 'application/json'
```

Expected response:
```json
{
  "success": true,
  "message": "Razorpay order created",
  "data": {
    "order": {
      "id": "order_...",
      "amount": 10000,
      "currency": "INR",
      ...
    },
    "keyId": "rzp_test_..."
  }
}
```

### Step 6: Check Environment Variables

**Frontend (.env)**:
```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_RnsEjnqlfCIF5x
```

**Backend (backend/.env)**:
```bash
RAZORPAY_KEY_ID=rzp_test_RnsEjnqlfCIF5x
RAZORPAY_KEY_SECRET=4bNKczWt56UAF3eJhKIK1y1O
```

Verify they match:
```bash
node verify-setup.js
```

## What I Fixed

1. ✅ Created `.env` file with correct Razorpay key
2. ✅ Fixed CORS configuration
3. ✅ Removed hardcoded fallback key
4. ✅ Added better error handling and logging
5. ✅ Fixed notes field to ensure all values are strings
6. ✅ Added request body logging for debugging

## Next Steps

1. **Clear browser cache** and reload the page
2. **Add items to cart** from the homepage
3. **Go to checkout** and fill in your details
4. **Open browser console** (F12) before clicking pay
5. **Click "Pay with Razorpay"** and watch the console
6. **Share the error** you see in console or network tab

## Getting Help

If it still doesn't work, please provide:
1. Screenshot of browser console errors
2. Screenshot of Network tab showing the failed request
3. Backend terminal output showing the error
4. What step fails (script loading, order creation, payment modal, etc.)
