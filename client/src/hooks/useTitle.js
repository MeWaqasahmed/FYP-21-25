import { useEffect } from 'react';

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | Influencer Platform` : 'Influencer Platform';

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
