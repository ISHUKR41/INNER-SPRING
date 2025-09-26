# 🔥 URGENT: Complete Firebase Setup Steps

## आपको ये steps तुरंत करने होंगे:

### Step 1: Web App Register करें

1. https://console.firebase.google.com/project/inner-spring पर जाएं
2. Project Settings (gear icon) पर click करें
3. "Your apps" section में जाएं
4. **"Add app"** button पर click करें
5. **Web (</>) icon** select करें
6. App nickname: **"WebCrafters"** type करें
7. **"Also set up Firebase Hosting"** को CHECK करें
8. **"Register app"** पर click करें

### Step 2: Configuration Copy करें

Registration के बाद आपको config दिखेगा:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "inner-spring.firebaseapp.com",
  projectId: "inner-spring",
  storageBucket: "inner-spring.appspot.com",
  messagingSenderId: "136212333806",
  appId: "1:136212333806:web:ACTUAL_APP_ID_HERE",
};
```

**इस पूरे config को copy करके मुझे भेजें!**

### Step 3: Authentication Enable करें

1. Firebase console में **"Authentication"** section पर जाएं
2. **"Get started"** पर click करें
3. **"Sign-in method"** tab पर जाएं
4. **"Email/Password"** पर click करें
5. **पहला toggle "Enable"** करें
6. **"Save"** करें

### Step 4: Email Templates Setup करें

1. Authentication में **"Templates"** tab पर जाएं
2. **"Email address verification"** पर click करें
3. **"Edit template"** पर click करें
4. Action URL को check करें: `https://inner-spring.firebaseapp.com/__/auth/action`
5. **"Save"** करें

## ⚠️ Critical Steps:

- Step 1 और 2 सबसे important हैं
- बिना proper web app के emails नहीं आएंगे
- Configuration copy करके मुझे send करें

## After Setup:

जैसे ही आप config send करेंगे, मैं तुरंत:

1. Firebase config update करूंगा
2. Email verification fix करूंगा
3. Complete flow test करूंगा
