import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

const REVIEW_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Safe localStorage wrapper for sandboxed contexts
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access denied:', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage write denied:', e);
    }
  },
};

export default function ReviewForm() {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [canReview, setCanReview] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const maxChars = 300;
  const charCount = comment.length;

  // Check if user can review
  useEffect(() => {
    const lastReviewTime = safeLocalStorage.getItem('lastReviewTime');
    
    if (lastReviewTime) {
      const lastReview = parseInt(lastReviewTime);
      const now = Date.now();
      const timeSinceLastReview = now - lastReview;

      if (timeSinceLastReview < REVIEW_COOLDOWN) {
        setCanReview(false);
        const remaining = REVIEW_COOLDOWN - timeSinceLastReview;
        setTimeRemaining(remaining);

        // Update remaining time every minute
        const interval = setInterval(() => {
          const updatedRemaining = REVIEW_COOLDOWN - (Date.now() - lastReview);
          if (updatedRemaining <= 0) {
            setCanReview(true);
            setTimeRemaining(null);
            clearInterval(interval);
          } else {
            setTimeRemaining(updatedRemaining);
          }
        }, 60000);

        return () => clearInterval(interval);
      }
    }
  }, []);

  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    if (comment.length > maxChars) {
      setError(`Comment must be ${maxChars} characters or less`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous',
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Store the current time as the last review time
      safeLocalStorage.setItem('lastReviewTime', Date.now().toString());

      setSuccess(true);
      setName('');
      setComment('');
      setCanReview(false);
      setTimeRemaining(REVIEW_COOLDOWN);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-950 rounded-xl shadow-xl border border-gray-800 hover:border-gray-700 transition-colors duration-300">
      <h3 className="text-2xl font-bold text-white mb-2">Share Your Review</h3>
      <p className="text-gray-400 mb-6">What do you think about my music?</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Your Name <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name or leave blank"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-colors duration-300"
            maxLength={100}
          />
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, maxChars))}
            placeholder="Share your thoughts... (max 300 characters)"
            rows={4}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none transition-colors duration-300"
          />
          <div className="mt-1 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {charCount} / {maxChars} characters
            </span>
            {charCount > maxChars * 0.8 && (
              <span className={`text-xs font-medium ${charCount === maxChars ? 'text-red-400' : 'text-orange-400'}`}>
                {maxChars - charCount} remaining
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Cooldown Message */}
        {!canReview && timeRemaining !== null && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-400">
              ⏱ You can submit another review in {formatTimeRemaining(timeRemaining)}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-sm text-green-400">✓ Thank you for your review! Pending approval.</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !comment.trim() || !canReview}
          className="w-full px-4 py-2 bg-black text-white font-medium rounded-lg border border-white hover:bg-white hover:text-black disabled:bg-gray-700 disabled:border-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          {loading ? 'Submitting...' : !canReview ? 'Come back in 24h' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
