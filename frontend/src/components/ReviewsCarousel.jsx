import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../api';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews/approved`);
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

    fetchReviews();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (reviews.length === 0) return;

    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 400; // Width of card + gap
        
        // Smooth scroll
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });

        // Reset to beginning when reaching end
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 10
        ) {
          setTimeout(() => {
            container.scrollLeft = 0;
          }, 500);
        }
      }
    }, 5000); // Scroll every 5 seconds

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [reviews]);

  if (loading) {
    return (
      <div className="w-full py-12 bg-linear-to-br from-gray-950 via-gray-900 to-black border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What People Are Saying
          </h2>
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500">Loading reviews...</div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="w-full py-12 bg-linear-to-br from-gray-950 via-gray-900 to-black border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What People Are Saying
          </h2>
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500 text-center">
              <p>No reviews yet. Be the first to share your thoughts!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-linear-to-br from-gray-950 via-gray-900 to-black border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            What People Are Saying
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real feedback from listeners like you
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="shrink-0 w-80 md:w-96 bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-900/30 transition-all duration-300 p-6 border border-gray-800 hover:border-purple-700"
              >
                {/* Quote Icon */}
                <div className="text-4xl text-purple-500 mb-3 opacity-40">
                  "
                </div>

                {/* Review Text */}
                <p className="text-gray-300 leading-relaxed mb-4 h-24 overflow-y-auto">
                  {review.comment}
                </p>

                {/* Divider */}
                <div className="h-0.5 bg-linear-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30 mb-4"></div>

                {/* Author & Date */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-semibold text-white">{review.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  {/* Star Rating (static for now) */}
                  <div className="text-purple-400 text-sm">★★★★★</div>
                </div>
              </div>
            ))}


          </div>
        </div>

        {/* Review Count */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} from our
            community
          </p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
