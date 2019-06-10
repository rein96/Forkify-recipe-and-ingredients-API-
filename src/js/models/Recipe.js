import axios from 'axios';
import { key } from '../config'  //Retrieve API Key from config.js

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`)  //id example = 46956
            //res = fresh Object and contain data.recipe.ingredients (etc)
            console.log('%c Fresh Object and contain data.recipe.ingredients (etc)', 'color:orange; font-weight:bold;');
            console.log(res);

            this.title = res.data.recipe.title; //get title of the recipe
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert(`
            Something went wrong on getRecipe() :(
            Maybe the API key?`);
        }
    }

    calcTime() {
        
        // Assuming every 3 ingredients = 15 minutes
        const numIng = this.ingredients.length;     //get how many ingredients on a recipe
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce','teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(val => {

            // ingredient : "1-1/3 cup Shortening (may Substitute Butter)"
            
            // 1. Uniform Units
            let ingredient =  val.toLowerCase();    // 'Tablespoons' - > 'tablespoons'
            // ingredient : "1-1/3 cup shortening (may substitute butter)"

            unitsLong.forEach((unit, i) => {    //unit = variable yang kita buat
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            /*
                ['tablespoons', 'tablespoon', 'ounces', 'ounce','teaspoons', 'teaspoon', 'cups', 'pounds'].forEach((unit, i))
                unit = tablespoons | i = 0
                ingredient = ingredient.replace('tablespoons','tbsp')
                unit = cups | i = 6
                 ingredient = ingredient.replace('cups','cup')

                ingredient = "1-1/3 cup shortening (may substitute butter)"
            */

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            // Regex / *\([^)]*\) */g
                //Select space in front and after parentheses
                // "Hello, this is Mike (example)" -> "Hello, this is Mike"
                // https://stackoverflow.com/questions/4292468/javascript-regex-remove-text-between-parentheses
            /* 
                ingredient = "1-1/3 cup shortening " (yes there is a space on the end)
            */
            

            // 3. Parse Ingredients into count, unit, and ingredient
            const arrIng = ingredient.split(' ');   //split between space
            const unitIndex = arrIng.findIndex(val2 => units.includes(val2));
            // .findIndex = returns an index that true at the first place
            // ['tbsp','tbsp','oz','oz', 'tsp', 'tsp', 'cup', 'pound'].includes()

            /*
                arrIng = ["1-1/3", "cup", "shortening", ""]
                unitIndex = ["1-1/3", "cup", "shortening", ""].findIndex
                    ['tbsp','tbsp','oz','oz', 'tsp', 'tsp', 'cup', 'pound', 'kg', 'g'].includes(val2)
                unitIndex = 1 (should be ?)
            */

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex)
                /* Example : arrIng = ['4', '1/2', 'cup']
                    unitIndex = 2
                    arrCount = ['4', '1/2']

                    Example : 4 cups
                    arrCount = ['4']

                    Problem example:
                    '1-1/3 cup shortening '
                    unitIndex = 1
                    arrCount = ['1-1/3']  -> length = 1
                */

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                    // Problem example :
                    // arrIng = ["1-1/3", "cup", "shortening", ""]
                    // count = eval('1+1/3') = 1.3333333333333333
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                    // count = eval(['4','1/2'].join('+'))
                    // count = eval('4+1/2')
                    // count = 4.5
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };


            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is Number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }


            } else if (unitIndex === -1) {
                // There is NO unit, and NO Number
                objIng = {
                    count: 1,   // 'tomato sauce' -> 1 tomato sauce
                    unit: '',
                    ingredient : ingredient,
                }
            }

            return objIng;


        });
        this.ingredients = newIngredients;
    }


    updateServings(type) {  // type = increase or decrease ('inc' or 'dec')
        // Servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1 



        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        })
        // If we press 'dec' type
        // ing.count = 1.333 * (3/4) = 0.9975

        this.servings = newServings;        // 3

    }



}


/*
Total Recipe properties

Recipe = {
    this.id = id;
    this.title = res.data.recipe.title; //get title of the recipe
    this.author = res.data.recipe.publisher;
    this.img = res.data.recipe.image_url;
    this.url = res.data.recipe.source_url;
    this.ingredients = res.data.recipe.ingredients;3
    this.time = periods * 15;
    this.servings = 4;
    this.ingredients = newIngredients;
         this.ingredients = {
            count,      (1.333)
            unit,       (cup)
            ingredient  (shortening)
        } 
        (objIng return to newIngredients, and belongs to "ingredients")
}

*/