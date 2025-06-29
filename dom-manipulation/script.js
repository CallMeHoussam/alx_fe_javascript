let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const quoteFormContainer = document.getElementById('quoteFormContainer');

function init() {
  loadQuotes();
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', showAddForm);
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
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  sessionStorage.setItem('lastUpdate', new Date().toISOString());
}

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available. Add some quotes first!</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
  `;
  
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
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
  linkElement.click();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
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
    sessionStorage.clear();
    loadQuotes();
    showRandomQuote();
    alert('All data has been cleared and reset to default quotes.');
  }
}

document.addEventListener('DOMContentLoaded', init);