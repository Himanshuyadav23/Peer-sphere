#!/bin/bash

# Script to build APK and create GitHub release
# You need to run: eas login once before using this

echo "🚀 Building Peer Sphere Mobile App..."

cd PeerSphereMobile

# Check if user is logged in
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS"
    echo "Please run: eas login"
    exit 1
fi

# Configure EAS if not already done
if [ ! -f "eas.json" ]; then
    echo "📝 Configuring EAS..."
    eas build:configure
fi

# Build the APK
echo "🔨 Building Android APK (this takes 15-30 minutes)..."
eas build --platform android --profile preview

echo "✅ Build complete!"
echo "📥 Download APK from: https://expo.dev/builds"
echo "📦 Then create release at: https://github.com/Himanshuyadav23/Peer-sphere/releases/new"

