let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let syncInterval = 30000;

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const quoteFormContainer = document.getElementById('quoteFormContainer');
const categoryFilter = document.getElementById('categoryFilter');

function init() {
  loadQuotes();
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', showAddForm);
  categoryFilter.addEventListener('change', filterQuotes);
  setupSync();

  // Add export and import buttons if not present
  if (!document.getElementById('exportQuotesBtn')) {
    const exportBtn = document.createElement('button');
    exportBtn.id = 'exportQuotesBtn';
    exportBtn.textContent = 'Export Quotes';
    exportBtn.onclick = exportToJsonFile;
    document.body.appendChild(exportBtn);
  }
  if (!document.getElementById('importQuotesBtn')) {
    const importBtn = document.createElement('button');
    importBtn.id = 'importQuotesBtn';
    importBtn.textContent = 'Import Quotes';
    importBtn.onclick = triggerImportQuotes;
    document.body.appendChild(importBtn);
  }
}

function setupSync() {
  syncQuotes();
  setInterval(syncQuotes, syncInterval);
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error('Server error');
    return await response.json();
  } catch (error) {
    showNotification('Failed to fetch from server: ' + error.message, true);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    showNotification('Failed to post to server: ' + error.message, true);
    return null;
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const formattedServerQuotes = serverQuotes.map(post => ({
    text: post.title,
    category: post.body || 'server',
    id: post.id,
    serverVersion: true
  }));

  const localQuotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const mergedQuotes = mergeQuotes(localQuotes, formattedServerQuotes);

  if (JSON.stringify(quotes) !== JSON.stringify(mergedQuotes)) {
    quotes = mergedQuotes;
    saveQuotes();
    showNotification('Quotes synced with server!');
    showRandomQuote();
  }
}

function mergeQuotes(localQuotes, serverQuotes) {
  const merged = [...serverQuotes];
  localQuotes.forEach(localQuote => {
    if (!serverQuotes.some(serverQuote => 
      serverQuote.text === localQuote.text && 
      serverQuote.category === localQuote.category
    )) {
      merged.push(localQuote);
    }
  });
  return merged;
}

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.className = 'sync-notification';
  notification.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem(STORAGE_KEY);
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "inspiration" },
      { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" },
      { text: "Life is what happens when you're busy making other plans.", category: "life" }
    ];
    saveQuotes();
  }
  populateCategories();
  
  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) categoryFilter.value = savedFilter;
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  populateCategories();
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  const currentValue = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  if (currentValue) categoryFilter.value = currentValue;
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  let filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available in this category.</p>';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<blockquote>"${quote.text}"</blockquote><p><em>— ${quote.category}</em></p>`;
}

function showRandomQuote() {
  filterQuotes();
}

function createAddQuoteForm() {
  if (document.getElementById('dynamicAddQuoteForm')) return;
  const form = document.createElement('form');
  form.id = 'dynamicAddQuoteForm';
  form.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Quote text" required>
    <input type="text" id="newQuoteCategory" placeholder="Category" required>
    <button type="submit">Add Quote</button>
    <button type="button" id="cancelAddQuote">Cancel</button>
  `;
  form.style.marginTop = '10px';
  quoteFormContainer.appendChild(form);
  form.onsubmit = async function(e) {
    e.preventDefault();
    await addQuote();
  };
  document.getElementById('cancelAddQuote').onclick = function() {
    hideAddForm();
  };
  quoteFormContainer.style.display = 'block';
}

function showAddForm() {
  createAddQuoteForm();
  quoteFormContainer.style.display = 'block';
}

function hideAddForm() {
  quoteFormContainer.style.display = 'none';
  const form = document.getElementById('dynamicAddQuoteForm');
  if (form) form.remove();
}

async function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput ? textInput.value.trim() : '';
  const category = categoryInput ? categoryInput.value.trim() : '';
  if (!text || !category) {
    alert('Please enter both quote text and category');
    return;
  }
  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  await postQuoteToServer(newQuote);
  hideAddForm();
  showRandomQuote();
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', url);
  linkElement.setAttribute('download', 'quotes.json');
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
  URL.revokeObjectURL(url);
}

function addImportQuotesInput() {
  if (document.getElementById('importQuotesInput')) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.id = 'importQuotesInput';
  input.style.display = 'none';
  input.addEventListener('change', importFromJsonFile);
  document.body.appendChild(input);
}

function triggerImportQuotes() {
  addImportQuotesInput();
  document.getElementById('importQuotesInput').click();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const fileReader = new FileReader();
  fileReader.onload = async function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = mergeQuotes(quotes, importedQuotes);
        saveQuotes();
        showRandomQuote();
        alert(`Successfully imported ${importedQuotes.length} quotes!`);
      } else {
        alert('Invalid format: Expected an array of quotes');
      }
    } catch (error) {
      alert('Error parsing JSON file: ' + error.message);
    }
    event.target.value = '';
  };
  fileReader.readAsText(file);
}

function clearStorage() {
  if (confirm('Are you sure you want to clear all quotes and reset to default?')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FILTER_KEY);
    loadQuotes();
    showRandomQuote();
    alert('All data has been cleared and reset to default quotes.');
  }
}

document.addEventListener('DOMContentLoaded', init);