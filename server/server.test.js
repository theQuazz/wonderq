const request = require('supertest');
const expect = require('expect');
const uuid = require('node-uuid');
const {Message} = require('./models/message');

var app = require('./server').app;

beforeEach((done) => {
  Message.remove({}).then(() => done());
});

describe('POST /produce', () => {
    it('should create a new message', (done) => {
    var text = 'Test message';

    request(app)
        .post('/produce')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Message.find({text}).then((messages) => {
                expect(messages.length).toBe(1);
                expect(messages[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /consume', () => {
    it('should set all messages to PENDING', (done) => {

        let message = new Message({
            text: "Consume test"
        });
        message.save().then(() => {});
        request(app)
            .get('/consume')
            .expect(200)
            .expect((res) => {
                expect(res.body.messages.length).toBe(1);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Message.find().then((messages) => {
                    expect(messages.length).toBe(1);
                    expect(messages[0].text).toBe('Consume test');
                    expect(messages[0].status).toBe('PENDING')
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /consume', () => {
    it('should set a PENDING message to DONE', (done) => {
        let id = 'b5b1fb80-1018-11e8-afed-0570ed07d064';
        let message = new Message({
            text: "Consume test",
            status: 'PENDING',
            _id: id
        });
        message.save().then(() => {});
        request(app)
            .delete(`/consume/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.message._id).toBe(id);
                expect(res.body.message.text).toBe('Consume test');
                expect(res.body.message.status).toBe('DONE');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Message.find().then((messages) => {
                    expect(messages.length).toBe(1);
                    expect(messages[0].text).toBe('Consume test');
                    expect(messages[0].status).toBe('DONE')
                    done();
                }).catch((e) => done(e));
            });
    });
});
