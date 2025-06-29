let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let lastSyncTime = null;
let syncInterval = 30000; // 30 seconds

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
}

function setupSync() {
  syncWithServer();
  setInterval(syncWithServer, syncInterval);
}

async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error('Server error');
    
    const serverQuotes = await response.json();
    const formattedServerQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: 'server',
      id: post.id,
      serverVersion: true
    }));
    
    const localQuotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const mergedQuotes = mergeQuotes(localQuotes, formattedServerQuotes);
    
    if (JSON.stringify(quotes) !== JSON.stringify(mergedQuotes)) {
      quotes = mergedQuotes;
      saveQuotes();
      showSyncNotification('Data updated from server');
    }
    
    lastSyncTime = new Date();
  } catch (error) {
    console.error('Sync failed:', error);
    showSyncNotification('Sync failed: ' + error.message, true);
  }
}

function mergeQuotes(localQuotes, serverQuotes) {
  const localMap = new Map(localQuotes.map(q => [q.id || q.text, q]));
  const serverMap = new Map(serverQuotes.map(q => [q.id || q.text, q]));
  
  const merged = [];
  
  // Add all server quotes (server takes precedence)
  serverMap.forEach((quote, key) => {
    merged.push({...quote});
  });
  
  // Add local quotes that don't exist on server
  localMap.forEach((quote, key) => {
    if (!serverMap.has(key) {
      merged.push({...quote});
    }
  });
  
  return merged;
}

function showSyncNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
  notification.style.color = 'white';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '1000';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 1s';
    setTimeout(() => document.body.removeChild(notification), 1000);
  }, 3000);
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
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  populateCategories();
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  const currentValue = categoryFilter.value;
  
  categoryFilter.innerHTML = '';
  
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.appendChild(allOption);
  
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  if (currentValue && uniqueCategories.includes(currentValue)) {
    categoryFilter.value = currentValue;
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  
  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
    ${quote.serverVersion ? '<p class="server-indicator">(From server)</p>' : ''}
  `;
}

function showRandomQuote() {
  filterQuotes();
}

function showAddForm() {
  quoteFormContainer.style.display = 'block';
}

function hideAddForm() {
  quoteFormContainer.style.display = 'none';
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (!text || !category) {
    alert('Please enter both quote text and category');
    return;
  }
  
  quotes.push({ text, category });
  saveQuotes();
  hideAddForm();
  showRandomQuote();
}

function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'quotes.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
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