let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.createElement('select');
categoryFilter.id = 'categoryFilter';
categoryFilter.onchange = filterQuotes;

function init() {
  loadQuotes();
  setupFilter();
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  document.body.insertBefore(categoryFilter, quoteDisplay);
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
  populateCategories();
}

function setupFilter() {
  const savedFilter = localStorage.getItem(FILTER_KEY);
  populateCategories();
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = `
    <option value="all">All Categories</option>
    ${uniqueCategories.map(category => 
      `<option value="${category}">${category}</option>`
    ).join('')}
  `;
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  
  if (selectedCategory === 'all') {
    showRandomQuote();
  } else {
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <p><em>— ${quote.category}</em></p>
      `;
    } else {
      quoteDisplay.innerHTML = `<p>No quotes found in this category.</p>`;
    }
  }
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;
  
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available.</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
  `;
}

function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    </div>
  `;
  document.body.appendChild(formContainer);
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote();
  }
}

function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
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
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', init);