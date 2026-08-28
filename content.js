(function () {
  function hostMatches(host, list) {
    return list.some((d) => host === d || host.endsWith('.' + d));
  }

  function setIgnore() {
    document.body.setAttribute('data-1p-ignore', '');
    document.body.setAttribute('data-op-ignore', '');
  }

  function apply(list) {
    if (!hostMatches(location.hostname, list)) return;
    if (document.body) {
      setIgnore();
      return;
    }
    // body not parsed yet (document_start) — wait for it
    const observer = new MutationObserver(() => {
      if (document.body) {
        setIgnore();
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }

  chrome.storage.sync.get({ sites: [] }, (data) => apply(data.sites));
})();
