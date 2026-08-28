const tbody = document.getElementById('tbody');
const empty = document.getElementById('empty');
const status = document.getElementById('status');

function normalize(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
}

function load() {
  chrome.storage.sync.get({ sites: [] }, (data) => render(data.sites));
}

function render(sites) {
  const sorted = [...sites].sort();
  tbody.innerHTML = '';
  sorted.forEach((d) => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = d;
    const tdActions = document.createElement('td');
    tdActions.className = 'actions';
    const btn = document.createElement('button');
    btn.textContent = 'Remove';
    btn.onclick = () => remove(d);
    tdActions.appendChild(btn);
    tr.append(td, tdActions);
    tbody.appendChild(tr);
  });
  empty.style.display = sorted.length ? 'none' : 'block';
}

function save(sites, message) {
  const unique = [...new Set(sites.filter(Boolean))];
  chrome.storage.sync.set({ sites: unique }, () => {
    render(unique);
    if (message) flash(message);
  });
}

function flash(message) {
  status.textContent = message;
  setTimeout(() => (status.textContent = ''), 1500);
}

function remove(domain) {
  chrome.storage.sync.get({ sites: [] }, (data) => {
    save(
      data.sites.filter((d) => d !== domain),
      'Removed'
    );
  });
}

document.getElementById('addSingle').addEventListener('click', () => {
  const input = document.getElementById('single');
  const domain = normalize(input.value);
  if (!domain) return;
  chrome.storage.sync.get({ sites: [] }, (data) => {
    save([...data.sites, domain], 'Added');
  });
  input.value = '';
});

document.getElementById('single').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('addSingle').click();
});

document.getElementById('addBulk').addEventListener('click', () => {
  const textarea = document.getElementById('bulk');
  const domains = textarea.value.split('\n').map(normalize).filter(Boolean);
  if (!domains.length) return;
  chrome.storage.sync.get({ sites: [] }, (data) => {
    save([...data.sites, ...domains], `Added ${domains.length}`);
  });
  textarea.value = '';
});

load();
