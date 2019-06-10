/*
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const ID = 23;
*/

import { elements } from './base';

export const getInput = () => elements.searchInput.value;   //value of .search__field searchbox

export const clearInput = () => {   // //clear the placeholder position
    elements.searchInput.value = ''
}


export const clearResults = () => {     
    elements.searchResList.innerHTML='';    //Clear the menu on left side
    elements.searchResPages.innerHTML='';   //Clear prev and next button (pagination)
}

//highlightSelected = become grey background bar
export const highlightSelected = id => {

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));     //get all index with class ('.results__link')
    resultsArr.forEach(val => {
        val.classList.remove('results__link--active');
    });     // remove ('results__link--active') to all index

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');   // cari yang ada href=id => +('results__link--active')

    // example :  <a class="results__link results__link--active" href="#23456">
};


/*
'Pasta with tomato and spinach'.split(' ') -> ['Pasta', 'with', 'tomato', 'and', 'spinach']
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with'] 
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato'] 
acc: 15 / acc + cur.length = 18 / false
*/

export const limitRecipeTitle = (title, limit = 17) => {   //17 is sweet spot for this table
    const newTitle=[];
    if (title.length > limit) {
        title.split(' ').reduce((acc,curr) => {
            if (acc + curr.length <= limit) {
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);  // 0 = acc (accumulator)
        return `${newTitle.join(' ')} ...`;     //Pasta with tomato ...
    }
    return title;   // Pizza Dip
}





const renderRecipe = recipe => {    //rRECI
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;

    elements.searchResList.insertAdjacentHTML('beforeend', markup); //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
}

// createButton function is deliberately not using {}
// type = 'prev' or 'next'
// data-goto = an attribute that we use to show on console
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`;


// Rendering buttons
const renderButton= (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    // Example : numResults = 30 / resPerPage = 10 | pages = 3
    // Problem : if the numResults = 45 | pages = 45/10 = 4.5, we want to have 5 pages -> Math.ceil is the solution

    let button;     //let is block scoped, so don't throw on inside curly bracket
    if ( page === 1 && pages > 1) {
        // Only a button to go the NEXT page
        button = createButton(page, 'next');

    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `

    } else if ( page === pages && pages > 1  ) {
        // Only a button to go the PREV page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}




export const renderResults = (recipes, page = 1, resPerPage = 10) => {   //renderResults is called from index.js

    //////////render results of current page
    //Pagination
    // [Array 30 index]
        // page 1 : start = 0 / end = 9
        // page 2 : start = 10 / end = 19

    const start = (page - 1) * resPerPage;
        // page 1 / start = (1-1) * 10 = 0
        // page 2 / start = (2-1) * 10 = 10
        // page 3 / start = (3-1) * 10 = 20
    const end = page * resPerPage;  // page 1 / end = 1 * 10 = 10
        // slice(begin, end) -> "end" is not included, so it ended on index 9, which the exact number for the end of the page


    recipes.slice(start, end).forEach(renderRecipe)     //Call rRECI, to access each Index
        // (index.js) searchView.renderResults(state.search.result)  
            // (Search.js) this.result = res.data.recipes; //Array with 30 Index
    // recipes = 30 array
    // [30 Array].slice(start, end).forEach(renderRecipe)


    // render pagination buttons
    renderButton(page, recipes.length, resPerPage)

}
