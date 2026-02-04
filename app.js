const RecipeApp = (() => {
  'use strict';

  /* ================= DATA ================= */
  const recipes = [
    {
      id: 1,
      title: "Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "Classic Italian pasta.",
      ingredients: ["pasta","egg","cheese"],
      steps: ["Boil pasta","Mix sauce","Combine"]
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      time: 45,
      difficulty: "medium",
      description: "Creamy curry.",
      ingredients: ["chicken","tomato","cream"],
      steps: ["Marinate","Cook sauce","Add chicken"]
    },
    {
      id: 3,
      title: "Croissants",
      time: 180,
      difficulty: "hard",
      description: "Flaky pastry.",
      ingredients: ["flour","butter"],
      steps: ["Prepare dough","Fold butter","Bake"]
    },
    {
      id: 4,
      title: "Greek Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh salad.",
      ingredients: ["cucumber","tomato"],
      steps: ["Chop","Mix","Serve"]
    },
    {
      id: 5,
      title: "Beef Wellington",
      time: 120,
      difficulty: "hard",
      description: "Classic beef dish.",
      ingredients: ["beef","pastry"],
      steps: ["Sear","Wrap","Bake"]
    },
    {
      id: 6,
      title: "Veg Stir Fry",
      time: 20,
      difficulty: "easy",
      description: "Quick veggies.",
      ingredients: ["vegetables","soy"],
      steps: ["Heat pan","Stir fry"]
    },
    {
      id: 7,
      title: "Pad Thai",
      time: 30,
      difficulty: "medium",
      description: "Thai noodles.",
      ingredients: ["noodles","peanuts"],
      steps: ["Soak","Cook","Mix"]
    },
    {
      id: 8,
      title: "Margherita Pizza",
      time: 60,
      difficulty: "medium",
      description: "Classic pizza.",
      ingredients: ["dough","cheese"],
      steps: ["Prepare base","Bake"]
    }
  ];

  /* ================= STATE ================= */
  let currentFilter = 'all';
  let currentSort = 'none';
  let searchQuery = '';
  let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
  let debounceTimer;

  /* ================= DOM ================= */
  const recipeContainer = document.querySelector('#recipe-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortButtons = document.querySelectorAll('.sort-btn');
  const searchInput = document.querySelector('#search-input');
  const clearSearchBtn = document.querySelector('#clear-search');
  const recipeCountDisplay = document.querySelector('#recipe-count');

  /* ================= FILTERS ================= */
  const filterBySearch = (list, query) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q))
    );
  };

  const applyFilter = (list, filter) => {
    if (filter === 'favorites')
      return list.filter(r => favorites.includes(r.id));
    if (filter === 'quick')
      return list.filter(r => r.time < 30);
    if (filter === 'all') return list;
    return list.filter(r => r.difficulty === filter);
  };

  const applySort = (list, sort) => {
    if (sort === 'name')
      return [...list].sort((a,b)=>a.title.localeCompare(b.title));
    if (sort === 'time')
      return [...list].sort((a,b)=>a.time-b.time);
    return list;
  };

  /* ================= FAVORITES ================= */
  const saveFavorites = () =>
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));

  const toggleFavorite = (id) => {
    favorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    saveFavorites();
    updateDisplay();
  };

  /* ================= UI ================= */
  const updateRecipeCounter = (showing, total) => {
    recipeCountDisplay.textContent = `Showing ${showing} of ${total} recipes`;
  };

  const createRecipeCard = (r) => `
    <div class="recipe-card">
      <button class="favorite-btn" data-id="${r.id}">
        ${favorites.includes(r.id) ? '❤️' : '🤍'}
      </button>
      <h3>${r.title}</h3>
      <p>${r.description}</p>

      <button class="toggle-btn">Show Ingredients</button>
      <div class="ingredients-container">
        <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>

      <button class="toggle-btn">Show Steps</button>
      <div class="steps-container">
        <ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      </div>
    </div>
  `;

  const updateDisplay = () => {
    let list = filterBySearch(recipes, searchQuery);
    list = applyFilter(list, currentFilter);
    list = applySort(list, currentSort);
    updateRecipeCounter(list.length, recipes.length);
    recipeContainer.innerHTML = list.map(createRecipeCard).join('');
  };

  /* ================= EVENTS ================= */
  const setupEventListeners = () => {
    filterButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        updateDisplay();
      })
    );

    sortButtons.forEach(btn =>
      btn.addEventListener('click', () => {
        currentSort = btn.dataset.sort;
        sortButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        updateDisplay();
      })
    );

    searchInput.addEventListener('input', e => {
      clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.trim();
        updateDisplay();
      }, 300);
    });

    clearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      updateDisplay();
    });

    recipeContainer.addEventListener('click', e => {
      if (e.target.classList.contains('favorite-btn'))
        toggleFavorite(Number(e.target.dataset.id));

      if (e.target.classList.contains('toggle-btn')) {
        const next = e.target.nextElementSibling;
        next.classList.toggle('visible');
      }
    });
  };

  const init = () => {
    console.log('🍳 RecipeJS initializing...');
    setupEventListeners();
    updateDisplay();
    console.log('✅ RecipeJS ready!');
  };

  return { init };
})();

RecipeApp.init();
