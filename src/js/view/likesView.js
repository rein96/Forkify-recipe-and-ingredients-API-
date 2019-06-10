import { elements } from './base';
import { limitRecipeTitle } from './seachView';


export const toggleLikeBtn = isLiked => {
    // isLiked = true or false
    // outline = not liked | remove outline = icon heart full
    /*
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart-outlined"></use>
            </svg>
        </button>
    */

    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    // use = a child element (tag) on recipe__love
    // .setAttribute to change 'href' value
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
    // Manipulate CSS style = visibility
}

export const renderLike = like => {

    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};


export const deleteLike = id => {

    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
        // or (`.likes__link[href*="#${id}"]`)
    // el = <a class="likes__link" href="#${like.id}"> ... </a>
    // We want to delete from <li> ... </li>
    // So get parentElement to get <li>

    if (el) el.parentElement.removeChild(el);

}