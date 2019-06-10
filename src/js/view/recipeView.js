
import { elements } from './base';
import { Fraction } from 'fractional';
import { format } from 'url';

// Clear recipe (ALL FEATURES) in the middle menu 
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};



const formatCount = count => {
    if (count) {    //Some object doesnt have 'count' value;
        // count = 2.5 -> 5/2 -> 2 1/2
        // count = 0.5 -> 1/2

        const newCount = Math.round(count * 10000) / 10000; //In order to get round number (misal input: 0.3333333) (last lecture)

         //Destructuring ES6
        const [int, dec] = newCount.toString().split('.').map( val => parseInt( val, 10));
        //  int = 2, dec = 5
        //  int = 0, dec = 5
        
        if (!dec) return newCount;     
        // If there is no decimal for example int = 2, dec = 0  | count = 2
        // count still 2, return count

        if (int === 0) {    // int 0, dec = 5  | count = 0.5
            const fr = new Fraction(newCount);     //fractional library
            return `${fr.numerator}/${fr.denominator}`;     // numerator = 1, denominator = 2  | [1/2]
        } else {    //If it has some int value (not 0) | count = 2.5
            const fr = new Fraction(newCount - int);   // 2.5 - 2 = 0.5
            return `${int} ${fr.numerator}/${fr.denominator}`;  // return 2 1/2
            
        }


    }
    return '?'; //To change "undefined" in the interface to "?" if there is no 'count'
}

/*
    <div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">

        ${recipe.ingredients.map(val => createIngredient(val))}

         // here template string createIngredient function will be printed

    </ul>
*/

const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;


export const renderRecipe = (recipe, isLiked) => {
    // isLiked = in order to keep the full-heart if we had already liked

    // tambahin recipe__btn--add    =   adds all the ingredients to the list
    const markup = `
            <figure class="recipe__fig">
                <img src=${recipe.img} alt=${recipe.title} class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>



            <div class="recipe__details">
            
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>

                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>

                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>

                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked == true ? '' : '-outlined'}"></use>
                    </svg>
                </button>

            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                
                    ${recipe.ingredients.map(val => createIngredient(val)).join('')}   

                </ul>

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>




            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);


};



export const updateServingsIngredients = recipe => {
    // Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;


    // Update ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));  //get all tags with .recipe__count attribute

    countElements.forEach((val, i) => {
        val.textContent = formatCount(recipe.ingredients[i].count)
    })

}