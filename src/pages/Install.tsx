import { useState, useEffect } from 'react';
import { Zap, Download, Smartphone, Monitor, Check, Share, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl">
            <Zap className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">SpeedNet</h1>
            <p className="text-muted-foreground mt-1">Internet Speed Test</p>
          </div>
        </div>

        {/* Status */}
        {isInstalled ? (
          <div className="card-glass p-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">App Installed!</h2>
            <p className="text-muted-foreground">
              SpeedNet is installed on your device. Open it from your home screen.
            </p>
            <Button variant="start" onClick={() => window.location.href = '/'}>
              Open App
            </Button>
          </div>
        ) : isIOS ? (
          <div className="card-glass p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Install on iOS</h2>
            <p className="text-muted-foreground">
              Add SpeedNet to your home screen for the best experience:
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Share className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">Tap the Share button in Safari</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Download className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">Scroll down and tap "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Check className="w-5 h-5 text-success shrink-0" />
                <span className="text-sm text-foreground">Tap "Add" to install</span>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="card-glass p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Install SpeedNet</h2>
            <p className="text-muted-foreground">
              Install the app for quick access and offline support.
            </p>
            <Button variant="start" size="xl" onClick={handleInstall} className="w-full">
              <Download className="w-5 h-5" />
              Install App
            </Button>
          </div>
        ) : (
          <div className="card-glass p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Install on Android</h2>
            <p className="text-muted-foreground">
              Add SpeedNet to your home screen:
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <MoreVertical className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">Tap the menu (⋮) in your browser</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Smartphone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">Tap "Add to Home Screen" or "Install App"</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Check className="w-5 h-5 text-success shrink-0" />
                <span className="text-sm text-foreground">Confirm to install</span>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Works Offline</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Fast & Light</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Monitor className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">All Devices</span>
          </div>
        </div>

        {/* Back link */}
        <a href="/" className="text-sm text-primary hover:underline inline-block">
          ← Back to Speed Test
        </a>
      </div>
    </div>
  );
};

export default Install;