
import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string;
}

export const SeoHead = ({ title, description, keywords }: SeoHeadProps) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;
    
    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Update Keywords (optional but good for some engines)
    if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);

  return null;
};
