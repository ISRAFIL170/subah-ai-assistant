# 🤖 সুবাহ AI Assistant — Android Project v1.0

এটি Android Studio + Capacitor ব্যবহার করে APK বানানোর জন্য প্রস্তুত সোর্স প্রজেক্ট।

## কী আছে
- DeepSeek AI backend integration
- Claude AI backend integration
- Google Programmable Search integration
- Voice command ও voice response (WebView support অনুযায়ী)
- Task, Study, Expense, Goal, Reminder tracker
- Mobile-first UI
- Android native container তৈরির Capacitor configuration

## গুরুত্বপূর্ণ: Backend আলাদা
AI API Key নিরাপদ রাখার জন্য backend আলাদা চালাতে হবে। APK-এর মধ্যে API Key রাখবে না।

### 1. Backend চালানো
একটি VPS/Render/Railway/Cloud Run-এর মতো HTTPS hosting-এ এই backend deploy করো। `.env` ফাইলে API key রাখবে।

### 2. Android project তৈরি
কম্পিউটারে Node.js ও Android Studio ইনস্টল করে:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

তারপর Android Studio থেকে **Build > Build APK(s)** নির্বাচন করো।

## API endpoint
বর্তমান `public/index.html` একই origin-এ `/api/chat` ব্যবহার করে। Production APK-এ backend আলাদা domain হলে `API_BASE_URL`/CORS অনুযায়ী frontend পরিবর্তন বা reverse proxy করতে হবে।

## নিরাপত্তা
`.env` কখনো GitHub বা APK-এর ভিতরে দেবে না।
