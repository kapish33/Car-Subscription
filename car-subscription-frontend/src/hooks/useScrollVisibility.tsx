import { useState, useEffect } from 'react';

const useScrollVisibility = (threshold: number = 100): boolean => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY < scrollY || currentScrollY < threshold);
    setScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollY, threshold]);

  return isVisible;
};

export default useScrollVisibility;
