var expect = require('chai').expect;

var Event = require('../app/models/event');
var Intervent = require('../app/models/intervent');
var Session = require('../app/models/session');
var User = require('../app/models/user');

describe('Event model', function () {
    var e = new Event({
        title: 'Test event',
        startDate: '16/08/2017',
        endDate: '20/08/2017',
        status: 'Done',
        organizer: 'Gian',
        public: true
    });

    it('should be invalid if title is empty', function (done) {
        e.title = '';

        e.validate(function (err) {
            expect(err.errors.title).to.exist;
            done();
        });
    });

    it('should be invalid if start date is empty', function (done) {
        e.startDate = '';

        e.validate(function (err) {
            expect(err.errors.startDate).to.exist;
            done();
        });
    });

    it('should be invalid if end date is empty', function (done) {
        e.endDate = '';

        e.validate(function (err) {
            expect(err.errors.endDate).to.exist;
            done();
        });
    });

    it('should be invalid if status is empty', function (done) {
        e.status = '';

        e.validate(function (err) {
            expect(err.errors.status).to.exist;
            done();
        });
    });

    it('should be invalid if organizer is empty', function (done) {
        e.organizer = '';

        e.validate(function (err) {
            expect(err.errors.organizer).to.exist;
            done();
        });
    });

    it('should be invalid if public is empty', function (done) {
        e.public = null;

        e.validate(function (err) {
            expect(err.errors.public).to.exist;
            done();
        });
    });

    it('should be valid even if location is empty', function (done) {
        e.validate(function (err) {
            expect(err.errors.location).not.to.exist;
            done();
        });
    });

    it('should be valid even if allowed is empty', function (done) {
        e.validate(function (err) {
            expect(err.errors.allowed).not.to.exist;
            done();
        });
    });

});

describe('Intervent model', function () {

    var i = new Intervent({
        title: 'Test Intervent',
        date: '16/08/2017',
        duration: 120,
        speaker: 'Gian',
        session: 'Test Session'
    });

    it('should be invalid if title is empty', function (done) {
        i.title = '';
        i.validate(function (err) {
            expect(err.errors.title).to.exist;
            done();
        });
    });

    it('should be invalid if date is empty', function (done) {
        i.date = '';
        i.validate(function (err) {
            expect(err.errors.date).to.exist;
            done();
        });
    });

    it('should be invalid if duration is empty', function (done) {
        i.duration = null;
        i.validate(function (err) {
            expect(err.errors.duration).to.exist;
            done();
        });
    });

    it('should be invalid if speaker is empty', function (done) {
        i.speaker = '';
        i.validate(function (err) {
            expect(err.errors.speaker).to.exist;
            done();
        });
    });

    it('should be invalid if session is empty', function (done) {
        i.session = '';
        i.validate(function (err) {
            expect(err.errors.session).to.exist;
            done();
        });
    });

    it('should be valid even if text is empty', function (done) {
        i.validate(function (err) {
            expect(err.errors.text).not.to.exist;
            done();
        });
    });

    it('should be valid even if status is empty', function (done) {
        i.validate(function (err) {
            expect(err.errors.status).not.to.exist;
            done();
        });
    });

    it('should be valid even if questions is empty', function (done) {
        i.validate(function (err) {
            expect(err.errors.questions).not.to.exist;
            done();
        });
    });

    it('should be valid even if port is empty', function (done) {
        i.validate(function (err) {
            expect(err.errors.port).not.to.exist;
            done();
        });
    });

});

describe('Session model', function () {

    var s = new Session({
        title: 'Test session',
        startDate: '16/08/2017',
        endDate: '20/08/2017',
        status: 'Done'
    });

    it('should be invalid if title is empty', function (done) {
        s.title = '';
        s.validate(function (err) {
            expect(err.errors.title).to.exist;
            done();
        });
    });

    it('should be invalid if startDate is empty', function (done) {
        s.startDate = '';
        s.validate(function (err) {
            expect(err.errors.startDate).to.exist;
            done();
        });
    });

    it('should be invalid if endDate is empty', function (done) {
        s.endDate = '';
        s.validate(function (err) {
            expect(err.errors.endDate).to.exist;
            done();
        });
    });

    it('should be invalid if status is empty', function (done) {
        s.status = '';
        s.validate(function (err) {
            expect(err.errors.status).to.exist;
            done();
        });
    });

    it('should be valid even if speakers is empty', function (done) {
        s.validate(function (err) {
            expect(err.errors.speakers).not.to.exist;
            done();
        });
    });

    it('should be valid even if event is empty', function (done) {
        s.validate(function (err) {
            expect(err.errors.event).not.to.exist;
            done();
        });
    });

});

describe('User model', function () {

    var u = new User({
        name: 'Gian',
        surname: 'Cola',
        username: 'fast_luca',
        password: 'pass',
        email: 'fast@hotmail.it'
    });

    it('should be invalid if name is empty', function (done) {
        u.name = '';
        u.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if surname is empty', function (done) {
        u.surname = '';
        u.validate(function (err) {
            expect(err.errors.surname).to.exist;
            done();
        });
    });

    it('should be invalid if username is empty', function (done) {
        u.username = '';
        u.validate(function (err) {
            expect(err.errors.username).to.exist;
            done();
        });
    });

    it('should be invalid if password is empty', function (done) {
        u.password = '';
        u.validate(function (err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });

    it('should be invalid if email is empty', function (done) {
        u.email = '';
        u.validate(function (err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('should be valid even if observedEvents is empty', function (done) {
        u.validate(function (err) {
            expect(err.errors.observedEvents).not.to.exist;
            done();
        });
    });

    it('should be valid even if joinedEvents is empty', function (done) {
        u.validate(function (err) {
            expect(err.errors.joinedEvents).not.to.exist;
            done();
        });
    });

});