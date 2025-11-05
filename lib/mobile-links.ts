/**
 * Mobile App Link Utilities
 * 
 * Generates mobile app deep links and app store links
 */

// App Store URLs (update these when your app is published)
const APP_STORE_URLS = {
  ios: 'https://apps.apple.com/app/peer-sphere/idXXXXXXXXX', // Update with your App Store ID
  android: 'https://play.google.com/store/apps/details?id=com.peersphere.mobile', // Update with your Play Store URL
  expo: 'exp://expo.dev/@your-username/peer-sphere', // Update with your Expo username/project
};

// Custom URL scheme
const APP_SCHEME = 'peersphere://';

/**
 * Generate a deep link to open the mobile app
 */
export function generateAppLink(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${APP_SCHEME}${cleanPath}`;
}

/**
 * Generate a universal link (web URL that opens app if installed)
 * Replace 'yourdomain.com' with your actual domain
 */
export function generateUniversalLink(path: string = ''): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://yourdomain.com'; // Update with your domain
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/app${cleanPath}`;
}

/**
 * Generate a shareable link that works on both web and mobile
 */
export function generateShareableLink(type: 'community' | 'event' | 'profile' | 'match', id: string): {
  webUrl: string;
  appUrl: string;
  universalLink: string;
} {
  const paths = {
    community: `/communities/${id}`,
    event: `/events/${id}`,
    profile: `/profile/${id}`,
    match: `/matches/${id}`,
  };

  const path = paths[type];
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://yourdomain.com'; // Update with your domain

  return {
    webUrl: `${baseUrl}${path}`,
    appUrl: generateAppLink(path),
    universalLink: generateUniversalLink(path),
  };
}

/**
 * Get app store link based on platform
 */
export function getAppStoreLink(platform: 'ios' | 'android' | 'auto' = 'auto'): string {
  if (platform === 'auto') {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        return APP_STORE_URLS.ios;
      } else if (/android/.test(userAgent)) {
        return APP_STORE_URLS.android;
      }
    }
    return APP_STORE_URLS.android; // Default
  }
  return APP_STORE_URLS[platform];
}

/**
 * Check if user is on mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

/**
 * Check if user is on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

/**
 * Check if user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/i.test(window.navigator.userAgent);
}

/**
 * Try to open the app, fallback to app store if not installed
 */
export function openAppOrStore(path: string = ''): void {
  if (typeof window === 'undefined') return;

  const appLink = generateAppLink(path);
  const storeLink = getAppStoreLink('auto');

  // Try to open app first
  window.location.href = appLink;

  // Fallback to app store after a short delay
  setTimeout(() => {
    window.location.href = storeLink;
  }, 500);
}

