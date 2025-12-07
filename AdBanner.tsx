import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: { push: (params?: any) => void }[];
  }
}

type AdBannerProps = {
  style?: React.CSSProperties;
};

export function AdBanner({ style }: AdBannerProps) {
  useEffect(() => {
    try {
      // Tell AdSense to render an ad in this <ins>
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // It can throw in dev / before script load – safe to ignore
      console.error(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: "block", width: "100%", minHeight: 90 }}
      data-ad-client="ca-pub-2587782641982436"  // from your code
      data-ad-slot="1029125143"                 // from your code
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
