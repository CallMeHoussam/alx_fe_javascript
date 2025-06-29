let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
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
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    showRandomQuote();
  }
}

newQuoteBtn.addEventListener('click', showRandomQuote);
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  createAddQuoteForm();
});