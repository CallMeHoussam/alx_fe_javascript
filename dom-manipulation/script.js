let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "inspiration" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "life" },
  { text: "The way to get started is to quit talking and begin doing.", category: "motivation" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "motivation" }
];
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryButtons = document.getElementById('categoryButtons');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const quoteFormContainer = document.getElementById('quoteFormContainer');

let currentCategory = null;

function init() {
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', showAddForm);
  
  generateCategoryButtons();
}

function showRandomQuote() {
  let filteredQuotes = currentCategory 
    ? quotes.filter(quote => quote.category === currentCategory)
    : quotes;
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found in this category. Try another one!</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>— ${quote.category}</em></p>
  `;
}
function generateCategoryButtons() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  const allButton = document.createElement('button');
  allButton.textContent = 'All';
  allButton.addEventListener('click', () => {
    currentCategory = null;
    showRandomQuote();
    highlightCurrentCategoryButton();
  });
  categoryButtons.appendChild(allButton);
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.addEventListener('click', () => {
      currentCategory = category;
      showRandomQuote();
      highlightCurrentCategoryButton();
    });
    categoryButtons.appendChild(button);
  });
  
  highlightCurrentCategoryButton();
}

function highlightCurrentCategoryButton() {
  const buttons = categoryButtons.querySelectorAll('button');
  buttons.forEach(button => {
    if ((button.textContent === 'All' && currentCategory === null) || 
        (button.textContent === currentCategory)) {
      button.style.backgroundColor = '#2E7D32';
    } else {
      button.style.backgroundColor = '#4CAF50';
    }
  });
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
  
  const newQuote = { text, category };
  quotes.push(newQuote);
  hideAddForm();
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const existingButtons = [...categoryButtons.querySelectorAll('button')]
    .map(button => button.textContent);
  
  if (!existingButtons.includes(category)) {
    const button = document.createElement('button');
    button.textContent = category;
    button.addEventListener('click', () => {
      currentCategory = category;
      showRandomQuote();
      highlightCurrentCategoryButton();
    });
    categoryButtons.appendChild(button);
  }
  
  currentCategory = category;
  showRandomQuote();
  highlightCurrentCategoryButton();
}
document.addEventListener('DOMContentLoaded', init);