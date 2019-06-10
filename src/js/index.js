/*
// // Global app controller
// import num from './test';
// const x = 23;
// console.log(`I imported ${num} from another module called test.js! Variable x is ${x}`);

import str from './models/Search';        //Don't need specify '.js'

// 1st way
// import { add as a, multiply as m, ID } from './view/seachView';    //Omit the '.js'
// must use the exact same names from the export (add, multiply, ID)
// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. And then ${str} is the string from exported module `);

// 2nd way
import * as searchView  from './view/seachView';      // * = everything
console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. And then ${str} is the string from exported module `);
*/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './view/seachView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import { elements, renderLoader, clearLoader } from './view/base';


// Redux is an open-source JavaScript library for managing application state.
// Global State of the app
    //Search object
    //Current recipe object
    //Shopping list object
    // Liked recipes


const state = {};   //Store here
window.state = state;   
// Can be tested to the console
// Should be deleted in order to not leak our state data

/*
State object = {
    search: new Search('pizza'),
                search.getResults();
    recipe: new Recipe(id),
    list: new List()
    likes: new Likes()

}
*/


//////////////////////////////////////////////
/* SEARCH CONTROLLER */

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput()      //To get VALUE from search box, example = 'pizza'
    // console.log(query);
    

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();    //clear the placeholder position
        searchView.clearResults();  //clear whole LIST <li> + clear next and prev button
        renderLoader(elements.searchRes);     //from base.js | the spinning loader

        try {
            // 4. Search for recipes
            await state.search.getResults();    //returns a promise, get [Array 30 Index]

            // 5. Render results on UI
            clearLoader();      //Remove spinning loader icon
            searchView.renderResults(state.search.result)   
            // 1. Creating start and end of page (halaman)
            // 2. Render recipes (1 to 10 recipes are printed) (renderRecipe)
            // 3. Creating next and prev button (renderButton)

        } catch (error) {
            alert(`
            Oh, the error is the SEARCH function!
            Maybe the API ?`);
            clearLoader();
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    //Class Search = form, reload automatically when hit the button
    e.preventDefault();     //To prevent reload automatically in form

    controlSearch();    //When 'submit' it begins to process controlSearch()

});

elements.searchResPages.addEventListener('click', e => {
    // closest = if we click the child element (span, or svg in a <button>), we include all of these into only <button> ('.btn-inline')
    const btn = e.target.closest('.btn-inline');
    // console.log(btn);

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);    //If we are in page 2, goToPage = 1 or 3 (depends on the button)
        // Dataset = read/write to all the custom data attributes (data-*) -> data-goto (value 1,2,3)
        // string -> parseInt / 10 -> maximum range (0-9)
        console.log(`goToPage= ${goToPage}`);
        
        searchView.clearResults();  //clear whole LIST <li>
        searchView.renderResults(state.search.result, goToPage);
        // 1. Creating start and end of page (depends on goToPage)
        // 2. Render recipes (1 to 10 recipes are printed) (renderRecipe)
        // 3. Creating next and prev button (renderButton)
    }
})

//////////////////////////////////////////////
/* RECIPE CONTROLLER */

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    //window.location = entire URL
    // .replace -> #46956 -> 46956
    console.log(`id = ${id} controlRecipe()`);

    if (id) {   //If there is an id

        // Prepare UI for changes
        recipeView.clearRecipe();   // clear middle menu
        renderLoader(elements.recipe)   // Spinning loading icon on middle menu

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);     // pake if = Kalo ada input Search (kalo ada hash (query) di url) bisa jalan

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();     //return a promise from API
            console.log('%c state.recipe :', 'color:orange; font-weight:bold;');
            console.log(state.recipe);

            console.log('%c (Before) state.recipe :', 'color:orange; font-weight:bold;');
            console.log(state.recipe.ingredients)   //[Array 17 index only ingredients from API] 
            state.recipe.parseIngredients();    //return a nice ingredient format
            console.log('%c ( After parseIngredients() ) state.recipe :', 'color:orange; font-weight:bold;');
            console.log(state.recipe.ingredients) 

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();

            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );  //isLiked = to keep the full-heart if we had already liked


        } catch (error) {
            console.log(error);
            alert(`
            Oh, the error is the controlRecipe() !`)
        }
        
    }

}

['hashchange', 'load'].forEach(val => window.addEventListener(val, controlRecipe));

/*
    // If we have many window.addEventListener, then put in array is a best solution

    window.addEventListener('hashchange', controlRecipe);
    //whenever hash is changed -> call controlRecipe
    //Problem when someone bookmark the page with specific id (example: localhost:8080/#47746), then the render is gone because hash doesn't change

    window.addEventListener('load', controlRecipe);
    // It fires whenever the page is loaded
*/


//////////////////////////////////////////////
/* LIST CONTROLLER or SHOPPING LIST CONTROLLER */
const controlList = () => {
    //  Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list 
    state.recipe.ingredients.forEach(val => {
        const item = state.list.addItem(val.count, val.unit, val.ingredient);

        listView.renderItem(item);

    });
}


// Handle delete and update list item events (the count)
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // dataset.itemid = data-itemid=${item.id}
    // when click the delete button, or number, or text = it will go to the closest shoping__item, and then read the ID 

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // update the count (list)
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10); //read the count on number rectangle input
        if (val >= 0) {
            state.list.updateCount(id, val);    // val = newCount
        }
        
    }


    // matches return true or false
})


//////////////////////////////////////////////
/* LIKE CONTROLLER */

// TESTING = when we reload the recipe, state.likes will automatically created to prevent error
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    // If we hit controlLike button but we don't have state.likes, it make new Likes() object

    const currentID = state.recipe.id;
    console.log(`Current ID = ${currentID}  controlLike()`)

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );  //Untuk ngepush ke Likes object

        // Toggle the like button   (become full-heart)
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes);

    // User HAS already liked current recipe   
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        
        // Toggle the like button   (become empty-heart) 
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
        console.log('%c state.likes :', 'color:orange; font-weight:bold;');
        console.log(state.likes);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore liked recipe on page load (localStorage method on likes.js)
window.addEventListener('load', () => {     //when the page 'load'
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();


    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach( like => likesView.renderLike(like));
    //likes(object).likes(array).forEach
})










// Control DECrease or INCrease servings button + add SHOPPING LIST
// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // * (asterisk) = universal selector, inside of (.btn-decrease) parent element
    if (e.target.matches('btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {    //To prevent this.servings negative value
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);  //call to render to UI
        }

    } else if (e.target.matches('btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);    //call to render to UI


    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {    //add to shopping list (the ingredients)
        // Add ingredients to shopping list
        controlList();

    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }

    console.log('%c state.recipe (servings and count have been changed) :', 'color:orange; font-weight:bold;');
    console.log(state.recipe);  //servings and count have been changed
    
});

// window.list = new List();       //test to the console
/*
    0: {id: "jwgichb8", count: 2, unit: "cup", ingredient: "Earl grey Tea"}
    1: {id: "jwgid0ho", count: 5, unit: "kg", ingredient: "tomatoes"}   
*/



