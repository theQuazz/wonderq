var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Message = mongoose.model('Message', {
    _id: {
        type: String,
        default: uuid.v1
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    status: {
        type: String,
        enum: ['NEW', 'PENDING', 'DONE'],
        required: true,
        default: 'NEW'
    },
    updatedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Message}
