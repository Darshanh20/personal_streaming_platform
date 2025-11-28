import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HeroImageDisplay() {
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/hero`);
      const data = await response.json();

      if (data.success && data.data) {
        setHeroImage(data.data);
      }
    } catch (err) {
      console.error('Error fetching hero image:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Return null if loading, error, or no hero image
  if (loading || error || !heroImage || !heroImage.imageUrl) {
    return null;
  }

  // Build CSS filter string
  const filters = [
    `blur(${heroImage.blur || 0}px)`,
    `brightness(${heroImage.brightness || 1})`,
    `contrast(${heroImage.contrast || 1})`,
  ].join(' ');

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `url('${heroImage.imageUrl}')`,
        backgroundSize: heroImage.objectFit || 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        opacity: heroImage.opacity || 1,
        filter: filters,
        zIndex: 0,
      }}
      aria-label="Hero banner image"
    />
  );
}
