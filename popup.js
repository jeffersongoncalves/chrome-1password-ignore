const listEl = document.getElementById('list');
const toggleEl = document.getElementById('toggle');
let currentHost = '';

function render(sites) {
  listEl.innerHTML = '';
  sites.forEach((d) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = d;
    const btn = document.createElement('button');
    btn.textContent = 'remove';
    btn.onclick = () => removeSite(d);
    li.append(span, btn);
    listEl.appendChild(li);
  });
  toggleEl.checked = sites.includes(currentHost);
}

function load() {
  chrome.storage.sync.get({ sites: [] }, (data) => render(data.sites));
}

function removeSite(domain) {
  chrome.storage.sync.get({ sites: [] }, (data) => {
    const sites = data.sites.filter((d) => d !== domain);
    chrome.storage.sync.set({ sites }, load);
  });
}

toggleEl.addEventListener('change', () => {
  chrome.storage.sync.get({ sites: [] }, (data) => {
    let sites = data.sites;
    if (toggleEl.checked) {
      if (!sites.includes(currentHost)) sites = [...sites, currentHost];
    } else {
      sites = sites.filter((d) => d !== currentHost);
    }
    chrome.storage.sync.set({ sites }, load);
  });
});

document.getElementById('manage').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  try {
    currentHost = new URL(tabs[0].url).hostname;
  } catch (e) {
    currentHost = '';
  }
  document.getElementById('current').textContent = currentHost || '(n/a)';
  toggleEl.disabled = !currentHost;
  load();
});
