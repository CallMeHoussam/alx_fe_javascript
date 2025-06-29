let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.createElement('select');
categoryFilter.id = 'categoryFilter';

function init() {
  loadQuotes();
  setupFilter();
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  document.body.insertBefore(categoryFilter, quoteDisplay);
  categoryFilter.addEventListener('change', filterQuotes);
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem(STORAGE_KEY);
  quotes = savedQuotes ? JSON.parse(savedQuotes) : getDefaultQuotes();
  saveQuotes();
}

function getDefaultQuotes() {
  return [
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" }
  ];
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  populateCategories();
}

function setupFilter() {
  populateCategories();
  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
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
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  showRandomQuote();
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

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

document.addEventListener('DOMContentLoaded', init);