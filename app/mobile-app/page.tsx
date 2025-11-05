"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/page-layout';
import { 
  Smartphone, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  QrCode,
  Apple,
  Play
} from 'lucide-react';
import { 
  generateAppLink, 
  generateUniversalLink, 
  getAppStoreLink,
  isMobileDevice,
  isIOS,
  isAndroid,
  generateShareableLink
} from '@/lib/mobile-links';

export default function MobileAppPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<'community' | 'event' | 'profile' | 'match'>('event');
  const [linkId, setLinkId] = useState('');
  const [generatedLink, setGeneratedLink] = useState<{
    webUrl: string;
    appUrl: string;
    universalLink: string;
  } | null>(null);

  const isMobile = isMobileDevice();
  const isApple = isIOS();
  const isGoogle = isAndroid();

  useEffect(() => {
    if (linkId && linkType) {
      setGeneratedLink(generateShareableLink(linkType, linkId));
    }
  }, [linkId, linkType]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareLink = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Peer Sphere Mobile App',
          text: 'Check this out on Peer Sphere!',
          url: text,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard(text, 'share');
    }
  };

  const appStoreUrl = getAppStoreLink('auto');
  const expoUrl = 'exp://expo.dev/@your-username/peer-sphere'; // Update with your Expo URL

  return (
    <PageLayout 
      title="Mobile App" 
      description="Download Peer Sphere mobile app or generate shareable links"
    >
      <div className="space-y-6">
        {/* Download Section */}
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-pink-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Download Peer Sphere Mobile</CardTitle>
                <CardDescription>
                  Get the full mobile experience with push notifications and offline access
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                onClick={() => window.open(appStoreUrl, '_blank')}
                className="w-full bg-black hover:bg-gray-800 text-white gap-2"
                disabled={!appStoreUrl.includes('appstore')}
              >
                <Apple className="h-5 w-5" />
                Download for iOS
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                onClick={() => window.open(getAppStoreLink('android'), '_blank')}
                className="w-full bg-[#3DDC84] hover:bg-[#2ECC71] text-white gap-2"
              >
                <Play className="h-5 w-5" />
                Download for Android
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </div>

            {isMobile && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  📱 You're on a mobile device! 
                  {isApple && ' Download from the App Store.'}
                  {isGoogle && ' Download from Google Play.'}
                </p>
                <Button
                  onClick={() => window.open(appStoreUrl, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Open App Store
                </Button>
              </div>
            )}

            {/* Development/Expo Link */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                For development/testing, use Expo Go:
              </p>
              <div className="flex gap-2">
                <Input
                  value={expoUrl}
                  readOnly
                  className="flex-1 font-mono text-xs"
                />
                <Button
                  onClick={() => copyToClipboard(expoUrl, 'expo')}
                  variant="outline"
                  size="sm"
                >
                  {copied === 'expo' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link Generator Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Mobile App Links</CardTitle>
            <CardDescription>
              Create shareable links that open directly in the mobile app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Link Type</label>
                <div className="flex gap-2 flex-wrap">
                  {(['community', 'event', 'profile', 'match'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => setLinkType(type)}
                      variant={linkType === type ? 'default' : 'outline'}
                      size="sm"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ID</label>
                <Input
                  placeholder="Enter ID (e.g., abc123)"
                  value={linkId}
                  onChange={(e) => setLinkId(e.target.value)}
                />
              </div>
            </div>

            {generatedLink && (
              <div className="space-y-3 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Badge variant="secondary">App Link</Badge>
                    <span className="text-xs text-muted-foreground">
                      (peersphere://...)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink.appUrl}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      onClick={() => copyToClipboard(generatedLink.appUrl, 'app')}
                      variant="outline"
                      size="sm"
                    >
                      {copied === 'app' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => shareLink(generatedLink.appUrl)}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Badge variant="secondary">Universal Link</Badge>
                    <span className="text-xs text-muted-foreground">
                      (Opens app if installed, otherwise web)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink.universalLink}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      onClick={() => copyToClipboard(generatedLink.universalLink, 'universal')}
                      variant="outline"
                      size="sm"
                    >
                      {copied === 'universal' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => shareLink(generatedLink.universalLink)}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Badge variant="secondary">Web URL</Badge>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink.webUrl}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      onClick={() => copyToClipboard(generatedLink.webUrl, 'web')}
                      variant="outline"
                      size="sm"
                    >
                      {copied === 'web' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => window.open(generatedLink.webUrl, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!linkId && (
              <div className="text-center py-8 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Enter an ID above to generate mobile app links</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick App Links</CardTitle>
            <CardDescription>Common app deep links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[
                { label: 'Home', path: '' },
                { label: 'Communities', path: '/communities' },
                { label: 'Events', path: '/events' },
                { label: 'Matches', path: '/matches' },
                { label: 'Messages', path: '/messages' },
                { label: 'Profile', path: '/profile' },
              ].map(({ label, path }) => {
                const appLink = generateAppLink(path);
                return (
                  <div key={path} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground font-mono">{appLink}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(appLink, `quick-${path}`)}
                        variant="outline"
                        size="sm"
                      >
                        {copied === `quick-${path}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => shareLink(appLink)}
                        variant="outline"
                        size="sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

