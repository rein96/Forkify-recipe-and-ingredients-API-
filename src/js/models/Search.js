/*
// A model use uppercase on initial character = "Search.js"
export default 'I am an exported string.';
*/

// https://www.food2fork.com/api/search
// 139f23e4205f1286e5f384b4a852934b  //API KEY

import axios from 'axios';  //Available on package.json     // Axios > native fetch method
import { key } from '../config'  //Retrieve API Key from config.js


//Food2Fork
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {     //asynchronous Method
        // const key = '139f23e4205f1286e5f384b4a852934b'      //My own API key from Food2Fork
        //Now it's available on config.js
    
        // try {
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);    //q and key from https://www.food2fork.com/about/api
        console.log('%c Fresh data query from API:', 'color:orange; font-weight:bold;');
        console.log(res);   //Fresh Object from API 
    
        this.result = res.data.recipes;     //Array with 30 Index
        // console.log(this.result); 
        // } catch (error) {
        //     alert(error);
        // }  
    }
}

// //edamam
// export default class Search {
//     constructor(query) {
//         this.query = query;
//     }

//     async getResults() {     //asynchronous Method
//         const proxy = 'https://cors-anywhere.herokuapp.com/'
//         const key = '1536415664d9fef554b1f906b7e626b2'      //My own API key from  https://developer.edamam.com/
    
//         const res = await axios(`${proxy}https://api.edamam.com/search?app_key=${key}&q=${this.query}`);
//         console.log(res);
        
    
//         this.result = res.data.recipes;
//         // console.log(this.result); 
//         // } catch (error) {
//         //     alert(error);
//         // }  
//     }
// }