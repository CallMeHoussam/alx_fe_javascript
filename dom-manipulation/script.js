document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const addQuoteForm = document.getElementById('addQuoteForm');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const submitQuoteBtn = document.getElementById('submitQuoteBtn');
    
    // Create and insert category filter dropdown
    const categoryFilter = document.createElement('select');
    categoryFilter.id = 'categoryFilter';
    document.body.insertBefore(categoryFilter, quoteDisplay);

    // Storage keys
    const STORAGE_KEY = 'quoteGeneratorData';
    const FILTER_KEY = 'quoteGeneratorFilter';
    
    let quotes = [];

    // Initialize the application
    function init() {
        loadQuotes();
        setupFilter();
        showRandomQuote();
        setupEventListeners();
    }

    // Load quotes from local storage or initialize with default quotes
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

    // Save quotes to local storage and update categories
    function saveQuotes() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        populateCategories();
    }

    // Set up the category filter with saved preference
    function setupFilter() {
        const savedFilter = localStorage.getItem(FILTER_KEY);
        populateCategories();
        if (savedFilter) {
            categoryFilter.value = savedFilter;
        }
    }

    // Populate the category dropdown with unique categories
    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = `
            <option value="all">All Categories</option>
            ${uniqueCategories.map(category => 
                `<option value="${category}">${category}</option>`
            ).join('')}
        `;
        
        // Add event listener after populating
        categoryFilter.addEventListener('change', filterQuotes);
    }

    // Filter quotes based on selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem(FILTER_KEY, selectedCategory);
        showRandomQuote();
    }

    // Display a random quote (filtered if category is selected)
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
        displayQuote(filteredQuotes[randomIndex]);
    }

    // Display a single quote
    function displayQuote(quote) {
        quoteDisplay.innerHTML = `
            <blockquote>"${quote.text}"</blockquote>
            <p><em>— ${quote.category}</em></p>
        `;
    }

    // Set up all event listeners
    function setupEventListeners() {
        newQuoteBtn.addEventListener('click', showRandomQuote);
        
        addQuoteBtn.addEventListener('click', function() {
            addQuoteForm.style.display = addQuoteForm.style.display === 'none' ? 'block' : 'none';
        });
        
        submitQuoteBtn.addEventListener('click', function() {
            const text = newQuoteText.value.trim();
            const category = newQuoteCategory.value.trim();
            
            if (text && category) {
                quotes.push({ text, category });
                saveQuotes();
                newQuoteText.value = '';
                newQuoteCategory.value = '';
                addQuoteForm.style.display = 'none';
                showRandomQuote();
            }
        });
        
        exportBtn.addEventListener('click', exportToJson);
        
        importBtn.addEventListener('click', function() {
            importFile.click();
        });
        
        importFile.addEventListener('change', importFromJsonFile);
    }

    // Export quotes to JSON file
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

    // Import quotes from JSON file
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

    // Initialize the application
    init();
});