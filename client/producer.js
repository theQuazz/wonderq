const axios = require('axios');

axios.post('http://localhost:3000/produce', {
    text: 'Test producer.js'
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.log(error);
});
