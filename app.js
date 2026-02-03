const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  /* ================= RECIPES ================= */
  const recipes = [
    {
      id: 1,
      title: "Classic Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
      category: "pasta",
      ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black pepper", "Salt"],
      steps: [
        "Boil water and cook spaghetti",
        {
          text: "Prepare sauce",
          substeps: [
            "Whisk eggs and cheese",
            "Fry pancetta until crisp",
            "Mix pasta with egg mixture"
          ]
        },
        "Season and serve"
      ]
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      time: 45,
      difficulty: "medium",
      description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
      category: "curry",
      ingredients: ["Chicken", "Yogurt", "Tomatoes", "Cream", "Garlic", "Garam masala"],
      steps: [
        {
          text: "Marinate chicken",
          substeps: ["Mix yogurt and spices", "Coat chicken", "Rest 30 minutes"]
        },
        {
          text: "Cook masala",
          substeps: [
            "Sauté onions",
            "Add tomatoes and spices",
            {
              text: "Finish sauce",
              substeps: ["Add cream", "Simmer gently"]
            }
          ]
        },
        "Add chicken and cook through"
      ]
    },
    {
      id: 3,
      title: "Homemade Croissants",
      time: 180,
      difficulty: "hard",
      description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
      category: "baking",
      ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar", "Salt"],
      steps: [
        "Prepare dough",
        "Chill dough",
        "Fold butter into dough",
        "Roll and shape croissants",
        "Bake until golden"
      ]
    },
    {
      id: 4,
      title: "Greek Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
      category: "salad",
      ingredients: ["Cucumber", "Tomato", "Feta", "Olives", "Olive oil", "Oregano"],
      steps: ["Chop vegetables", "Mix ingredients", "Add feta and olives", "Drizzle olive oil"]
    },
    {
      id: 5,
      title: "Beef Wellington",
      time: 120,
      difficulty: "hard",
      description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
      category: "meat",
      ingredients: ["Beef fillet", "Mushrooms", "Puff pastry", "Mustard", "Egg yolk"],
      steps: ["Sear beef", "Prepare mushrooms", "Wrap in pastry", "Bake until done"]
    },
    {
      id: 6,
      title: "Vegetable Stir Fry",
      time: 20,
      difficulty: "easy",
      description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
      category: "vegetarian",
      ingredients: ["Broccoli", "Carrots", "Bell peppers", "Soy sauce", "Garlic", "Oil"],
      steps: ["Heat oil", "Add vegetables", "Stir fry", "Add sauce and serve"]
    },
    {
      id: 7,
      title: "Pad Thai",
      time: 30,
      difficulty: "medium",
      description: "Thai stir-fried rice noodles with shrimp, peanuts, and tamarind sauce.",
      category: "noodles",
      ingredients: ["Rice noodles", "Shrimp", "Eggs", "Peanuts", "Tamarind sauce"],
      steps: ["Soak noodles", "Cook shrimp", "Add noodles and sauce", "Top with peanuts"]
    },
    {
      id: 8,
      title: "Margherita Pizza",
      time: 60,
      difficulty: "medium",
      description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
      category: "pizza",
      ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil", "Olive oil"],
      steps: ["Prepare dough", "Add sauce", "Add cheese", "Bake pizza", "Add basil"]
    }
  ];

  let currentFilter = "all";
  let currentSort = "none";

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");

  /* ================= FILTER & SORT ================= */
  const applyFilter = (list) => {
    if (currentFilter === "quick") return list.filter(r => r.time < 30);
    if (currentFilter === "all") return list;
    return list.filter(r => r.difficulty === currentFilter);
  };

  const applySort = (list) => {
    if (currentSort === "name") return [...list].sort((a,b)=>a.title.localeCompare(b.title));
    if (currentSort === "time") return [...list].sort((a,b)=>a.time-b.time);
    return list;
  };

  /* ================= RECURSION ================= */
  const renderSteps = (steps) => `
    <ol class="steps-list">
      ${steps.map(step =>
        typeof step === "string"
          ? `<li>${step}</li>`
          : `<li>${step.text}${renderSteps(step.substeps)}</li>`
      ).join("")}
    </ol>
  `;

  /* ================= CARD ================= */
  const createRecipeCard = (recipe) => `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>
      <div class="recipe-meta">
        <span>⏱ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
      </div>
      <p>${recipe.description}</p>

      <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>
      <div class="ingredients-container">
        <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>

      <button class="toggle-btn" data-toggle="steps">Show Steps</button>
      <div class="steps-container">${renderSteps(recipe.steps)}</div>
    </div>
  `;

  /* ================= RENDER ================= */
  const updateDisplay = () => {
    let list = applyFilter(recipes);
    list = applySort(list);
    recipeContainer.innerHTML = list.map(createRecipeCard).join("");
  };

  /* ================= EVENTS ================= */
  const setupEvents = () => {
    filterButtons.forEach(btn => {
      btn.onclick = () => {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateDisplay();
      };
    });

    sortButtons.forEach(btn => {
      btn.onclick = () => {
        currentSort = btn.dataset.sort;
        sortButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateDisplay();
      };
    });

    recipeContainer.addEventListener("click", e => {
      if (!e.target.classList.contains("toggle-btn")) return;
      const container = e.target.nextElementSibling;
      container.classList.toggle("visible");
      e.target.textContent = container.classList.contains("visible")
        ? `Hide ${e.target.dataset.toggle}`
        : `Show ${e.target.dataset.toggle}`;
    });
  };

  const init = () => {
    setupEvents();
    updateDisplay();
    console.log("RecipeApp ready!");
  };

  return { init };
})();

RecipeApp.init();
