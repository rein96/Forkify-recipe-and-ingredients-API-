
export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {   // id = hash on url
        const like = {
            id,
            title,
            author,
            img,
        };

        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(val => val.id === id)
        this.likes.splice(index, 1);    // Delete index yang mau di delete

         // Persist data in localStorage
         this.persistData();


    }
    
    isLiked(id) {   //isLiked = true or false
        return this.likes.findIndex(val => val.id === id ) !== -1;  //return true or false
        /*
            If we cannot find any item with the ID -> this.likes.findIndex(val => val.id === id) = -1
            -1 !== -1 -> false

            if there is a specified id -> true
        */
    }

    /*      //ALTERNATIVE
        isLiked(id) {
            // not liked item / find index return -1
            if (this.likes.findIndex(el =>  el.id === id) !== -1) {
                return true;
            } else {
                return false;
            }
        }
    */

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
        // localStorage must be a string data
        // 'likes' = key (become a property of Storage object)
        // this.likes = array
        // JSON.stringify = convert to string
    }


    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // localStorage.getItem('likes') = string
        // JSON.parse = convert everything back to previous data structures
        // if there's nothing in the localStorage (never store any 'likes' key, it will return 'null' because localStorage doesn't have the 'likes' key )


        // Restoring likes form the localStorage
        if (storage) this.likes = storage; 
    }

}