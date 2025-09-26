# Firebase Setup Instructions for Email Verification

## आपको यह steps follow करने होंगे:

### 1. Firebase Console में Authentication Enable करें:

1. https://console.firebase.google.com पर जाएं
2. "inner-spring" project select करें
3. Left sidebar में "Authentication" पर click करें
4. "Get started" button पर click करें
5. "Sign-in method" tab में जाएं
6. "Email/Password" को enable करें (दोनों toggles on करें)

### 2. Web App Register करें:

1. Firebase console में "Project Settings" (gear icon) पर जाएं
2. "Your apps" section में जाएं
3. "Add app" पर click करें और "Web" select करें
4. App nickname: "WebCrafters" रखें
5. "Register app" करें
6. Configuration object को copy करें जो इस तरह दिखेगा:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "inner-spring.firebaseapp.com",
  projectId: "inner-spring",
  storageBucket: "inner-spring.appspot.com",
  messagingSenderId: "136212333806",
  appId: "your-actual-app-id",
};
```

### 3. Email Templates Configure करें:

1. Authentication section में "Templates" tab पर जाएं
2. "Email address verification" को select करें
3. "Edit template" पर click करें
4. Subject: "Verify your email for WebCrafters"
5. Email body में proper message add करें
6. Action URL को check करें कि वो सही है
7. "Save" करें

### 4. Authorized Domains Add करें:

1. Authentication section में "Settings" tab पर जाएं
2. "Authorized domains" section में जाएं
3. "localhost" already होगा
4. अगर आपको production domain add करना है तो "Add domain" करें

### 5. Critical Step - Gmail Settings:

अगर आप Gmail का इस्तेमाल कर रहे हैं तो:

1. Gmail में Spam folder भी check करें
2. Firebase के emails को "Not Spam" mark करें
3. Firebase से आने वाले emails को "Always allow" करें

## Troubleshooting:

अगर अभी भी email नहीं आ रहा:

1. Firebase console में "Usage" tab check करें कि emails send हो रहे हैं
2. Logs में error check करें
3. Email address सही type किया है ना
4. Spam folder check करें
5. अगर Gmail है तो "All Mail" folder भी check करें

## After Setup:

इन steps के बाद:

1. नया firebase config client/src/lib/firebase.ts में update करें
2. npm run dev करके test करें
3. Signup करके email check करें
