const RecipeApp = (() => {

    console.log("RecipeApp initializing...");

    // ================= DATA =================
    const recipes = [
        {
            id: 1,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables with feta.",
            ingredients: ["Tomato", "Cucumber", "Feta", "Olives"],
            steps: [
                "Chop vegetables",
                {
                    text: "Prepare dressing",
                    substeps: ["Mix olive oil", "Add lemon", "Season"]
                },
                "Combine and serve"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Creamy spiced curry.",
            ingredients: ["Chicken", "Tomato", "Cream", "Spices"],
            steps: [
                "Marinate chicken",
                {
                    text: "Make sauce",
                    substeps: [
                        "Heat pan",
                        "Add spices",
                        {
                            text: "Simmer",
                            substeps: ["Lower heat", "Stir occasionally"]
                        }
                    ]
                },
                "Combine chicken and sauce"
            ]
        }
    ];

    // ================= STATE =================
    let currentFilter = "all";
    let currentSort = "none";

    // ================= DOM =================
    const container = document.querySelector("#recipe-container");

    // ================= RECURSION =================
    const renderSteps = (steps) => {
        return `
            <ul>
                ${steps.map(step => {
                    if (typeof step === "string") {
                        return `<li>${step}</li>`;
                    }
                    return `
                        <li>
                            ${step.text}
                            ${renderSteps(step.substeps)}
                        </li>
                    `;
                }).join("")}
            </ul>
        `;
    };

    // ================= CARD =================
    const createRecipeCard = (recipe) => `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>

            <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>
            <div class="ingredients-container">
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
            </div>

            <button class="toggle-btn" data-toggle="steps">Show Steps</button>
            <div class="steps-container steps">
                ${renderSteps(recipe.steps)}
            </div>
        </div>
    `;

    // ================= RENDER =================
    const renderRecipes = (list) => {
        container.innerHTML = list.map(createRecipeCard).join("");
    };

    // ================= TOGGLE (EVENT DELEGATION) =================
    const handleToggle = (e) => {
        if (!e.target.classList.contains("toggle-btn")) return;

        const card = e.target.closest(".recipe-card");
        const type = e.target.dataset.toggle;
        const target = card.querySelector(`.${type}-container`);

        target.classList.toggle("visible");
        e.target.textContent =
            target.classList.contains("visible")
                ? `Hide ${type}`
                : `Show ${type}`;
    };

    // ================= INIT =================
    const init = () => {
        renderRecipes(recipes);
        container.addEventListener("click", handleToggle);
        console.log("RecipeApp ready!");
    };

    return { init };

})();

RecipeApp.init();
