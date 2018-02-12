const axios = require('axios');

// axios.get('http://localhost:3000/consume').then(response => {
//     console.log(response.data);
// }).catch(error => {
//     console.log(error);
// });

axios.delete('http://localhost:3000/consume/46f09ab0-1033-11e8-ad96-49e5bd5d5714').then(response => {
    console.log(response.data);
}).catch(error => {
    console.log(error);
});
