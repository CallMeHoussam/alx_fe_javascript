let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';

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
  
  categoryFilter.innerHTML = `
    <option value="all">All Categories</option>
    ${uniqueCategories.map(category => 
      `<option value="${category}">${category}</option>`
    ).join('')}
  `;
  
  if (currentValue && uniqueCategories.includes(currentValue)) {
    categoryFilter.value = currentValue;
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  showRandomQuote();
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
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
  `;
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
    localStorage.removeItem(FILTER_KEY);
    loadQuotes();
    showRandomQuote();
    alert('All data has been cleared and reset to default quotes.');
  }
}

document.addEventListener('DOMContentLoaded', init);