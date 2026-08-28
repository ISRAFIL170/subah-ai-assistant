# 📱 মোবাইল দিয়ে GitHub Actions ব্যবহার করে APK বানানোর সহজ নিয়ম

## ১) GitHub অ্যাকাউন্ট
GitHub অ্যাপ বা ব্রাউজারে একটি অ্যাকাউন্ট খুলুন/লগইন করুন।

## ২) নতুন Repository
- `New repository` চাপুন
- নাম দিন: `subah-ai-assistant`
- Public বা Private যেকোনোটি নির্বাচন করতে পারেন
- `Create repository` চাপুন

## ৩) এই ZIP-এর সব ফাইল Upload করুন
ZIP extract করে ভেতরের সব ফাইল ও `.github` ফোল্ডারসহ repository-তে upload করুন।

> গুরুত্বপূর্ণ: `.github/workflows/build-apk.yml` ফাইলটি অবশ্যই upload হতে হবে। এটিই APK auto-build করবে।

## ৪) Actions চালু করুন
Repository খুলে `Actions` ট্যাবে যান।
তারপর `Build Subah AI APK` workflow নির্বাচন করুন এবং `Run workflow` চাপুন।

## ৫) APK Download করুন
Build শেষ হলে:
- `Actions` → সর্বশেষ successful run খুলুন
- নিচের `Artifacts` থেকে `Subah-AI-Assistant-debug-APK` download করুন
- ZIP extract করলে `app-debug.apk` পাবেন

## ৬) APK Install
`app-debug.apk`-এ চাপুন। Android যদি permission চায়, `Allow from this source` চালু করুন, তারপর Install দিন।

## ⚠️ গুরুত্বপূর্ণ
এই APK build করার জন্য GitHub cloud server ব্যবহার হবে। API key কখনো repository-তে `.env` ফাইল হিসেবে upload করবেন না। বাস্তব AI API ব্যবহারের জন্য backend/secret configuration ব্যবহার করুন।
