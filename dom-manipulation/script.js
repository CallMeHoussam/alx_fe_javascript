let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

function init() {
  loadQuotes();
  populateCategories();
  restoreFilter();
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  categoryFilter.addEventListener('change', filterQuotes);
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem(STORAGE_KEY);
  quotes = savedQuotes ? JSON.parse(savedQuotes) : getDefaultQuotes();
}

function getDefaultQuotes() {
  return [
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" }
  ];
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

function restoreFilter() {
  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  showFilteredQuote();
}

function showFilteredQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  displayQuote(filteredQuotes[randomIndex]);
}

function displayQuote(quote) {
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
  `;
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  displayQuote(quotes[randomIndex]);
}

document.addEventListener('DOMContentLoaded', init);