/**
 * Simple test script to verify Razorpay configuration
 * Run with: node backend/test-razorpay.js
 */

require("dotenv").config({ path: "./backend/.env" });
const Razorpay = require("razorpay");

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log("=== Razorpay Configuration Test ===\n");

// Check if credentials are set
if (!RAZORPAY_KEY_ID) {
  console.error("❌ RAZORPAY_KEY_ID is not set in backend/.env");
  process.exit(1);
}

if (!RAZORPAY_KEY_SECRET) {
  console.error("❌ RAZORPAY_KEY_SECRET is not set in backend/.env");
  process.exit(1);
}

console.log("✅ RAZORPAY_KEY_ID:", RAZORPAY_KEY_ID);
console.log("✅ RAZORPAY_KEY_SECRET:", RAZORPAY_KEY_SECRET.substring(0, 8) + "...");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

console.log("\n✅ Razorpay instance created successfully");

// Test order creation
async function testOrderCreation() {
  try {
    console.log("\n=== Testing Order Creation ===\n");
    
    const order = await razorpay.orders.create({
      amount: 50000, // ₹500.00 in paise
      currency: "INR",
      receipt: `test_${Date.now()}`,
      notes: {
        test: "true",
        description: "Test order from Cursed Relics",
      },
    });

    console.log("✅ Order created successfully!");
    console.log("\nOrder Details:");
    console.log("  Order ID:", order.id);
    console.log("  Amount:", order.amount / 100, order.currency);
    console.log("  Status:", order.status);
    console.log("  Receipt:", order.receipt);
    console.log("\nFull Response:", JSON.stringify(order, null, 2));
    
    console.log("\n✅ All tests passed! Razorpay is configured correctly.");
  } catch (err) {
    console.error("\n❌ Order creation failed!");
    console.error("Error:", err.message);
    if (err.error) {
      console.error("Razorpay Error:", JSON.stringify(err.error, null, 2));
    }
    console.error("\nFull Error:", err);
    process.exit(1);
  }
}

testOrderCreation();
