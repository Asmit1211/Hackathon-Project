/**
 * Quick verification script to check if Razorpay is properly configured
 * Run with: node verify-setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Razorpay Setup Verification ===\n');

let hasErrors = false;

// Check frontend .env
const frontendEnvPath = path.join(__dirname, '.env');
if (!fs.existsSync(frontendEnvPath)) {
  console.error('❌ Frontend .env file not found');
  hasErrors = true;
} else {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  if (!frontendEnv.includes('VITE_RAZORPAY_KEY_ID')) {
    console.error('❌ VITE_RAZORPAY_KEY_ID not found in .env');
    hasErrors = true;
  } else {
    const match = frontendEnv.match(/VITE_RAZORPAY_KEY_ID=(.+)/);
    if (match && match[1].trim()) {
      console.log('✅ Frontend .env configured with key:', match[1].trim());
    } else {
      console.error('❌ VITE_RAZORPAY_KEY_ID is empty in .env');
      hasErrors = true;
    }
  }
}

// Check backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  console.error('❌ Backend .env file not found');
  hasErrors = true;
} else {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  
  if (!backendEnv.includes('RAZORPAY_KEY_ID')) {
    console.error('❌ RAZORPAY_KEY_ID not found in backend/.env');
    hasErrors = true;
  } else {
    const keyMatch = backendEnv.match(/RAZORPAY_KEY_ID=(.+)/);
    if (keyMatch && keyMatch[1].trim()) {
      console.log('✅ Backend RAZORPAY_KEY_ID configured:', keyMatch[1].trim());
    } else {
      console.error('❌ RAZORPAY_KEY_ID is empty in backend/.env');
      hasErrors = true;
    }
  }
  
  if (!backendEnv.includes('RAZORPAY_KEY_SECRET')) {
    console.error('❌ RAZORPAY_KEY_SECRET not found in backend/.env');
    hasErrors = true;
  } else {
    const secretMatch = backendEnv.match(/RAZORPAY_KEY_SECRET=(.+)/);
    if (secretMatch && secretMatch[1].trim()) {
      console.log('✅ Backend RAZORPAY_KEY_SECRET configured');
    } else {
      console.error('❌ RAZORPAY_KEY_SECRET is empty in backend/.env');
      hasErrors = true;
    }
  }
  
  // Check CORS
  const corsMatch = backendEnv.match(/CORS_ORIGIN=(.+)/);
  if (corsMatch) {
    const corsOrigin = corsMatch[1].trim();
    console.log('✅ CORS_ORIGIN set to:', corsOrigin);
    if (corsOrigin === 'http://localhost:8080') {
      console.warn('⚠️  CORS_ORIGIN is set to port 8080, but Vite typically runs on 5173');
      console.warn('   Consider changing to: http://localhost:5173');
    }
  }
}

// Check if keys match
if (fs.existsSync(frontendEnvPath) && fs.existsSync(backendEnvPath)) {
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  
  const frontendKey = frontendEnv.match(/VITE_RAZORPAY_KEY_ID=(.+)/)?.[1]?.trim();
  const backendKey = backendEnv.match(/RAZORPAY_KEY_ID=(.+)/)?.[1]?.trim();
  
  if (frontendKey && backendKey) {
    if (frontendKey === backendKey) {
      console.log('✅ Frontend and backend Razorpay keys match');
    } else {
      console.error('❌ Frontend and backend Razorpay keys DO NOT match!');
      console.error('   Frontend:', frontendKey);
      console.error('   Backend:', backendKey);
      hasErrors = true;
    }
  }
}

console.log('\n=== Summary ===');
if (hasErrors) {
  console.error('❌ Configuration has errors. Please fix them before proceeding.');
  console.log('\nRefer to RAZORPAY_SETUP.md for detailed setup instructions.');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Razorpay should be configured correctly.');
  console.log('\nNext steps:');
  console.log('1. Start backend: cd backend && npm run dev');
  console.log('2. Start frontend: npm run dev');
  console.log('3. Test Razorpay: node backend/test-razorpay.js');
}
