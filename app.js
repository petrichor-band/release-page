(() => {
  const CONSENT_KEY = "meta_ads_consent_v1";
  const pixelId = window.RELEASE_CONFIG?.metaPixelId;
  let pixelReady = false;

  function hasValidPixelId() {
    return pixelId && pixelId !== "YOUR_META_PIXEL_ID";
  }

  function loadMetaPixel() {
    if (pixelReady || !hasValidPixelId()) return;

    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n; n.loaded=!0; n.version='2.0'; n.queue=[];
      t=b.createElement(e); t.async=!0; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', {
      content_name: window.RELEASE_CONFIG?.title || document.title,
      content_category: 'music_release_page'
    });
    pixelReady = true;
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    document.getElementById("cookieBanner").hidden = true;
    if (value === "accepted") loadMetaPixel();
  }

  function initConsent() {
    const banner = document.getElementById("cookieBanner");
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") return loadMetaPixel();
    if (consent !== "rejected") banner.hidden = false;
  }

  function trackMetaStreamClick(platform) {
    if (!pixelReady || typeof fbq !== "function") return;

    fbq('trackCustom', 'StreamingClick', {
      platform,
      content_type: 'music',
      content_name: window.RELEASE_CONFIG?.title || document.title
    });

    fbq('trackCustom', `StreamingClick_${platform}`, { platform });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initConsent();

    document.getElementById("acceptCookies")
      ?.addEventListener("click", () => setConsent("accepted"));

    document.getElementById("rejectCookies")
      ?.addEventListener("click", () => setConsent("rejected"));

    document.getElementById("manageConsent")
      ?.addEventListener("click", () => {
        document.getElementById("cookieBanner").hidden = false;
      });

    document.querySelectorAll(".platform-button").forEach(button => {
      button.addEventListener("click", () => {
        trackMetaStreamClick(button.dataset.platform || "unknown");
      });
    });
  });
})();
