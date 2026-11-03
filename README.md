#📌 Overview

Nappee Diapers is an enterprise-grade, cross-platform mobile, desktop, and web application developed by Navabharath Technologies for Nappee Diapers. The application provides an end-to-end hyperlocal e-commerce and delivery ecosystem for eco-friendly, premium diapers.

The system features three dedicated role interfaces within a single unified codebase:

Customer Mobile Application: Product discovery, diaper variation selection, Mysuru PIN-code eligibility verification, interactive GPS/map address drop, coupon redemption, Razorpay checkout, and live order tracking.
Owner / Store Admin Dashboard: Catalogue maintenance, price & MRP updates, real-time stock counters, order stream processing, delivery partner assignment, coupon management, and daily/monthly revenue analytics.
Delivery Partner Portal: Real-time order manifest, customer contact information, one-click turn-by-turn navigation via Google Maps intent, and delivery status progression (OUT_FOR_DELIVERY ➔ DELIVERED).

##🚀 Key Modules & Capabilities

###1. 🛒 Customer Experience
Diaper Style Variations: Full support for both Pant-Style and Velcro-Style diapers.
Size & Pack Coverage: Newborn (NB), Small (S), Medium (M), Large (L), Extra Large (XL), XXL, and XXXL with pack counts ranging from 40 to 72 pcs.
Hyperlocal PIN-Code Filter: Validates customer postal codes against the approved Mysuru city coverage list (570001–570026). Ineligible locations display a graceful notice redirecting users to the brand website.
Precision Geolocation: Captures customer delivery points via native device GPS (expo-location), interactive pin-drop, or structured manual address entry with reverse geocoding via OpenStreetMap Nominatim.
Payment Processing: Integrated Razorpay SDK supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Netbanking, and Wallets.
Order History & Live Tracking: Real-time order status tracking with timestamps and automated Meta WhatsApp notifications.

###2. 🏢 Store Owner & Administrator Dashboard
Catalogue Management: Add, edit, or deactivate diaper products, update MRP, selling prices, discounts, and upload product imagery.
Live Inventory Controls: Monitor real-time stock counts (IN_STOCK, LOW_STOCK, OUT_OF_STOCK) with instant toggles.
Order Queue & Fulfilment: View orders as they are placed, verify payment confirmations, and assign orders to delivery personnel.
Coupon & Promotion Engine: Create and monitor fixed-value or percentage-based general discounts and influencer attribution codes.
Financial Analytics: Real-time daily and monthly gross collections, order volumes, and coupon usage figures.

###3. 🛵 Delivery Partner Workflow
Authentication: Fast, phone-based login for verified delivery personnel.
Active Deliveries Queue: Clean list of orders currently assigned to the delivery partner.
One-Click Turn-by-Turn Routing: Direct trigger launching Google Maps navigation with exact customer coordinates.
Proof of Delivery: Instant status updates marking orders as DELIVERED with backend synchronization and automated customer WhatsApp alerts.

###4. 🛡️ Legal & Brand Compliance
Standardized 3-Tab Interface (/app/legal.tsx): Houses Privacy Policy, Terms & Conditions, and About & Grievance Information.
Official Branding: Features official "Powered by Navabharath Technologies" branding with the company shield logo using hybrid cloud and local asset caching.

##📂 Project Directory Structure

Nappee_Diapers/
├── android/                   # Native Android project (Gradle, build configs, native icons)
│   ├── app/
│   │   ├── build.gradle       # App-level build file (Namespace: com.tejashwini_s.Nappee_Diapers)
│   │   └── src/main/res/      # Native icons, drawables, and splash screens
│   └── gradle.properties      # JVM memory tuning (-Xmx4096m -XX:MaxMetaspaceSize=1536m)
├── app/                       # File-based routing (Expo Router)
│   ├── customer/              # Customer ordering journey
│   │   ├── address-form.tsx   # Structured manual delivery address form
│   │   ├── index.tsx          # Main catalogue, cart, and chat interface
│   │   ├── location.tsx       # Interactive GPS pin drop & map selection
│   │   ├── orders.tsx         # Order history & receipt view
│   │   └── tracking.tsx       # Live status tracking timeline
│   ├── delivery/              # Delivery partner portal
│   │   ├── index.tsx          # Active deliveries queue
│   │   ├── login.tsx          # Delivery partner authentication
│   │   └── order/[id].tsx     # Delivery details & Google Maps routing
│   ├── owner/                 # Owner / Admin operations dashboard
│   │   ├── coupons.tsx        # Promotional & influencer coupon management
│   │   ├── customers.tsx      # Customer directory and order history
│   │   ├── delivery.tsx       # Delivery partner onboarding & status
│   │   ├── index.tsx          # Real-time collections & KPI dashboard
│   │   ├── orders.tsx         # Master orders management stream
│   │   ├── products.tsx       # Diaper catalogue & stock adjustment
│   │   └── order/[id].tsx     # Order detail, payment status & assignment
│   ├── _layout.tsx            # Global stack layout & navigation bar
│   ├── index.tsx              # Welcome splash & role selection screen
│   ├── legal.tsx              # Standard 3-tab legal compliance screen
│   └── owner-login.tsx        # Administrative authentication screen
├── assets/                    # Static branding, logo, and app icons
├── electron/                  # Electron wrapper for Windows desktop builds
│   ├── main.js                # Electron main process
│   └── package.json           # Desktop packaging configuration
├── src/                       # Shared state and presentation components
│   ├── components/            # Reusable UI components (Map.native.tsx, Map.web.tsx)
│   ├── store/                 # Zustand store & business logic
│   │   ├── types.ts           # TypeScript interfaces (Product, Order, Customer, etc.)
│   │   ├── mockData.ts        # Serviceable PIN codes list (570001 - 570026)
│   │   └── useStore.ts        # Zustand state store with Azure backend sync
│   └── theme/                 # Global color palettes & typography tokens
├── app.json                   # Expo application manifest & bundle configuration
├── eas.json                   # Expo Application Services (EAS) build & update profiles
├── package.json               # Dependencies and development scripts
└── tsconfig.json              # TypeScript compilation configuration
The frontend dynamically communicates with the production Azure cloud backend:

Official Website: https://www.nappeediapers.in/
Target SDK: 36 (Android 15 ready)
Minimum SDK: 24 (Android 7.0+)

The API connection is managed centrally in src/store/useStore.ts via getApiUrl():

typescript
export const getApiUrl = (storeType: 'diapers' | 'DIAPERS' = 'diapers') => {
  return 'https://nappee-cmfab8eyb3d9f0cf.centralindia-01.azurewebsites.net';
};

##💻 Getting Started (Development Setup)

###Prerequisites

1. Node.js: v20.x or higher (LTS recommended)
2. npm: v10.x or higher
3. Java Development Kit (JDK): JDK 17 (Required for Android native builds)
4. Android Studio: Android SDK Platform 36 and Android Build-Tools 36.0.0
5. Expo CLI: Installed globally or invoked via npx expo

###Installation

1. Clone the repository:

bash
git clone https://github.com/Navabharth-Technologies/Nappee_Diapers_Frontend.git
cd Nappee_Diapers_Frontend

2. Install dependencies:

bash
npm install

###Running the Application

1. Start Expo Metro Bundler:

bash
npx expo start

2. Run on Android Emulator / Physical Device:

bash
npm run android
# or
npx expo run:android

3. Run on Web Browser:

bash
npm run web
# or
npx expo start --web

4. Run Desktop Client (Electron Development):

bash
cd electron
npm install
npm start

##📦 Building for Production

###1. Standalone Android APK (.apk)

To compile a standalone release APK for direct sideloading or internal QA:

bash
cd android
./gradlew assembleRelease
Output Artifact: android/app/build/outputs/apk/release/app-release.apk
Root Artifact: Nappee_Diapers_Release.apk (~114 MB)

###2. Google Play Production App Bundle (.aab)

To build an optimized, signed release bundle for the Google Play Store:

bash
cd android
./gradlew bundleRelease
Output Artifact: android/app/build/outputs/bundle/release/app-release.aab
Root Artifact: Nappee_Diapers_Release.aab (~80 MB raw / ~29.9 MB install size)

###3. Windows Desktop Executable (.exe)

To package the desktop store management application for 64-bit Windows:

bash

# 1. Build web production bundle
npx expo export:web

# 2. Package with Electron Builder
cd electron
npm run build
Output Artifacts: electron-dist/Nappee Diapers Setup 1.0.0.exe and portable Nappee_Diapers.exe.

###4. Over-The-Air (OTA) Updates

To push instant JavaScript/asset updates to installed user apps without rebuilding binaries:

bash
npx eas update --branch production --message "Production patch update"

##🛡️ Security, Privacy & Compliance

###Payment Security: Raw payment card and UPI credentials are handled exclusively within the secure Razorpay PCI-DSS Level 1 compliant modal. Order confirmation is verified using server-side HMAC-SHA256 signatures.
###Scoped Location Access: Precise user coordinates are gathered only with runtime user authorization (ACCESS_FINE_LOCATION) and used strictly for delivery routing.
###Google Play Policy Compliance: Includes live hosted Privacy Policy and Terms of Service endpoints
