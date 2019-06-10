//Shopping list

import uniqid from 'uniqid';    // uniqid library   // npm install uniqid --save

export default class List {
    constructor() {     //not pass parameter
        this.items = [];    //when adding to the shopping list, it will be pushed into this array
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count:count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(val => val.id === id );
        /*
            [2,4,8] splice(1,1) -> returns 4, original array is [2,8]
            [2,4,8] splice(1,2) -> returns [4, 8], original array is [2]

            [2,4,8] slice(1,1) -> returns 4, original array is [2,4,8]
         */
        this.items.splice(index, 1);    //delete the original element in original array (items)
    }

    updateCount(id, newCount) {     //only update the count 
        this.items.find(val => val.id === id).count = newCount;   //find the element
        //find(val => val.id === id) => return an object
        //object.count = newCount
    }
}