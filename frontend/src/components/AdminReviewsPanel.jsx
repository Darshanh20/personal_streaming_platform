import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';
import { formatDistanceToNow } from 'date-fns';

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
        headers: { 'x-admin-key': adminKey || '' },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Approve a review
  const handleApprove = async (id) => {
    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}/approve`, {
        method: 'PUT',
        headers: { 'x-admin-key': adminKey || '' },
      });

      if (response.ok) {
        setReviews(
          reviews.map((r) =>
            r.id === id ? { ...r, approved: true } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  // Reject a review
  const handleReject = async (id) => {
    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}/reject`, {
        method: 'PUT',
        headers: { 'x-admin-key': adminKey || '' },
      });

      if (response.ok) {
        setReviews(
          reviews.map((r) =>
            r.id === id ? { ...r, approved: false } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  // Delete a review
  const handleDelete = async (id) => {
    try {
      const adminKey = import.meta.env.VITE_ADMIN_KEY;
      const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey || '' },
      });

      if (response.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Categorize reviews
  const pendingReviews = reviews.filter((r) => !r.approved);
  const approvedReviews = reviews.filter((r) => r.approved);
  const rejectedReviews = reviews.filter((r) => r.approved === false);

  if (loading) {
    return (
      <div className="p-6 bg-gray-950 rounded-lg shadow-lg border border-gray-800">
        <p className="text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  const ReviewCard = ({ review }) => (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors duration-200">
      {/* Header */}
      <div className="mb-3">
        <h4 className="font-semibold text-white truncate">{review.name}</h4>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-3 min-h-12">
        "{review.comment}"
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {!review.approved && (
          <button
            onClick={() => handleApprove(review.id)}
            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-semibold cursor-pointer"
          >
            ✓ Approve
          </button>
        )}
        {review.approved && (
          <button
            onClick={() => handleReject(review.id)}
            className="w-full px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-xs font-semibold cursor-pointer"
          >
            ↩ Reject
          </button>
        )}
        <button
          onClick={() => setDeleteConfirm(review.id)}
          className="w-full px-3 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition text-xs font-semibold cursor-pointer"
        >
          🗑 Delete
        </button>

        {/* Delete Confirmation */}
        {deleteConfirm === review.id && (
          <div className="mt-2 p-2 bg-red-900/30 rounded-lg border border-red-800">
            <p className="text-xs text-red-400 mb-2">Confirm delete?</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(review.id)}
                className="flex-1 px-2 py-1 bg-red-700 text-white rounded text-xs font-medium hover:bg-red-800 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-2 py-1 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-600 cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Reviews Kanban Board</h2>
        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800">
          <p className="text-sm text-purple-400 font-medium">Pending</p>
          <p className="text-3xl font-bold text-purple-300 mt-2">{pendingReviews.length}</p>
        </div>
        <div className="p-4 bg-green-900/20 rounded-lg border border-green-800">
          <p className="text-sm text-green-400 font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-300 mt-2">{approvedReviews.length}</p>
        </div>
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
          <p className="text-sm text-blue-400 font-medium">Total Reviews</p>
          <p className="text-3xl font-bold text-blue-300 mt-2">{reviews.length}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Pending Column */}
        <div className="bg-gray-900/50 rounded-xl border-2 border-purple-800/30 p-4">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-purple-800/30">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <h3 className="text-lg font-bold text-white">Pending ({pendingReviews.length})</h3>
          </div>
          <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
            {pendingReviews.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 text-sm">No pending reviews</p>
              </div>
            ) : (
              pendingReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>

        {/* Approved Column */}
        <div className="bg-gray-900/50 rounded-xl border-2 border-green-800/30 p-4">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-green-800/30">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-white">Approved ({approvedReviews.length})</h3>
          </div>
          <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
            {approvedReviews.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 text-sm">No approved reviews yet</p>
              </div>
            ) : (
              approvedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
