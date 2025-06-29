let quotes = [];
const STORAGE_KEY = 'quoteGeneratorData';
const FILTER_KEY = 'quoteGeneratorFilter';

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.createElement('select');
categoryFilter.id = 'categoryFilter';

// Initialize the application
function init() {
  loadQuotes();
  setupCategoryFilter();
  showRandomQuote();
  setupEventListeners();
  document.body.insertBefore(categoryFilter, quoteDisplay);
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
  updateCategoryFilter();
}

function setupCategoryFilter() {
  updateCategoryFilter();
  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter && categoryFilter.querySelector(`option[value="${savedFilter}"]`)) {
    categoryFilter.value = savedFilter;
  }
}

function updateCategoryFilter() {
  // Clear existing options
  while (categoryFilter.firstChild) {
    categoryFilter.removeChild(categoryFilter.firstChild);
  }

  // Add 'All' option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.appendChild(allOption);

  // Add category options
  getUniqueCategories().forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function getUniqueCategories() {
  return [...new Set(quotes.map(quote => quote.category))];
}

function setupEventListeners() {
  newQuoteBtn.addEventListener('click', showRandomQuote);
  categoryFilter.addEventListener('change', handleCategoryFilterChange);
}

function handleCategoryFilterChange() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(FILTER_KEY, selectedCategory);
  showRandomQuote();
}

function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available${categoryFilter.value === 'all' ? '' : ' in this category'}.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  displayQuote(filteredQuotes[randomIndex]);
}

function getFilteredQuotes() {
  return categoryFilter.value === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === categoryFilter.value);
}

function displayQuote(quote) {
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
  `;
}

function addQuote() {
  const textElement = document.getElementById('newQuoteText');
  const categoryElement = document.getElementById('newQuoteCategory');
  
  const text = textElement.value.trim();
  const category = categoryElement.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    textElement.value = '';
    categoryElement.value = '';
    showRandomQuote();
  }
}
document.addEventListener('DOMContentLoaded', init);