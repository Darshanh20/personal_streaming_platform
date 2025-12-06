import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  useEffect(() => {
    // Check if prompt was already shown in this session
    const promptShown = sessionStorage.getItem('installPromptShown');
    if (promptShown) {
      setHasShownPrompt(true);
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if device is mobile or smaller screen
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Screens smaller than iPad landscape
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Stash the event for later
      setDeferredPrompt(e);
      
      // Show prompt only on mobile/smaller screens AND only if not shown yet
      if (window.innerWidth < 1024 && !promptShown) {
        // Add a slight delay to avoid overwhelming the user
        setTimeout(() => {
          setShowPrompt(true);
          setHasShownPrompt(true);
          sessionStorage.setItem('installPromptShown', 'true');
        }, 2000); // Show after 2 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installation success
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      sessionStorage.setItem('installPromptShown', 'true');
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to the install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setIsInstalled(true);
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('installPromptShown', 'true');
    // Don't clear deferredPrompt so user can install later via browser menu
  };

  // Don't show if already installed, not mobile, already shown, or no prompt available
  if (isInstalled || !isMobile || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-950 rounded-2xl border border-gray-700 shadow-2xl p-6 max-w-sm mx-4 animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src="/LOGO.png" alt="DhxMusic" className="w-16 h-16 rounded-lg" />
          <div>
            <h2 className="text-2xl font-bold text-white">DhxMusic</h2>
            <p className="text-sm text-gray-400">Music streaming platform</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6 text-center">
          Install DhxMusic on your home screen for instant access to your favorite music anytime, anywhere.
        </p>

        {/* Benefits */}
        <ul className="space-y-2 mb-6 text-sm text-gray-400">
          <li className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>Quick access from home screen</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>Works offline with cached content</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>Full-screen music experience</span>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
          >
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Not now
          </button>
        </div>

        {/* Dismiss hint */}
        <p className="text-xs text-gray-600 text-center mt-4">
          You can always install later from your browser menu
        </p>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
