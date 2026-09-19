(() => {
  const pixelId = window.RELEASE_CONFIG?.metaPixelId;
  let pixelReady = false;

  function hasValidPixelId() {
    return pixelId && pixelId !== "YOUR_META_PIXEL_ID";
  }

  function loadMetaPixel() {
    if (pixelReady || !hasValidPixelId()) return;

    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;
      n=f.fbq=function(){
        n.callMethod
          ? n.callMethod.apply(n,arguments)
          : n.queue.push(arguments)
      };
      if(!f._fbq)f._fbq=n;
      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];
      t=b.createElement(e);
      t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    fbq('init', pixelId);

    fbq('track', 'PageView');

    fbq('track', 'ViewContent', {
      content_name: window.RELEASE_CONFIG?.title || document.title,
      content_category: 'music_release_page'
    });

    pixelReady = true;
  }

  function trackMetaStreamClick(platform) {
    if (!pixelReady || typeof fbq !== "function") return;

    fbq('trackCustom', 'StreamingClick', {
      platform,
      content_type: 'music',
      content_name: window.RELEASE_CONFIG?.title || document.title
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadMetaPixel();

    document.querySelectorAll(".platform-button").forEach(button => {
      button.addEventListener("click", () => {
        trackMetaStreamClick(
          button.dataset.platform || "unknown"
        );
      });
    });
  });
})();