const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Message} = require('./models/message');

var app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/admin', (req, res) => {
    Message.find().then((messages) => {
        res.send({messages});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/produce', (req, res) => {
    let message = new Message({
      text: req.body.text,
      updatedAt: new Date().getTime()
    });

    message.save().then((message) => {
        res.send(message);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/consume', (req, res) => {
    Message.find({'status':'NEW'}).then((messages) => {
        messages.forEach((message) => {
            Message.findByIdAndUpdate(message._id, {
                $set: {
                    status: 'PENDING',
                    updatedAt: new Date().getTime()
                }
            }).then((message) => {});
        });
        res.send({messages});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/consume/:id', (req, res) => {
    Message.findById(req.params.id).then((message) => {
        if (message['status'] != 'PENDING') {
          return res.status(404).send();
        }

        message['status'] = 'DONE';
        message['updatedAt'] = new Date().getTime();
        message.save().then((message) => {
            if (!message) {
                return res.status(404).send();
            }
            res.send({message});
        }).catch((e) => {
            res.status(400).send();
        });
    });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
module.exports.app = app;
