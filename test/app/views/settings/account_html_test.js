var app       = require('../../../../app'),
    User      = require('../../../../app/models/user'),
    Nightmare = require('nightmare'),
    chai      = require('chai'),
    faker     = require('faker'),
    expect    = chai.expect,
    server,
    nightmare;

describe('/settings', function() {
  this.timeout(100000);

  before(function(done) {
    server = app.listen(3001);
    done();
  });

  after(function(done) {
    server.close();
    done();
  });

  beforeEach(function() {
    nightmare = new Nightmare();
  });

  it('signed out', function(done) {
    nightmare.goto('http://localhost:3001/settings/account')
    .url(function(url) {
      expect(url).to.equal('http://localhost:3001/sign_in');
    })
    .run(done);
  });

  it('title signed in', function(done) {
    var options = {
      username: faker.internet.userName(),
      email:    faker.internet.email(),
      password: faker.internet.password()
    };
    var user = new User(options);

    user.signUp()
    .then(function(docs) {
      nightmare.goto('http://localhost:3001/sign_in')
      .type('input[name="usernameEmail"]', options.email)
      .type('input[name="password"]', options.password)
      .click('button.btn.btn-default')
      .wait('.alert-message')

      .goto('http://localhost:3001/settings/account')
      .url(function(url) {
        expect(url).to.equal('http://localhost:3001/settings/account');
      })
      .evaluate(function() {
        return document.querySelector('title').innerText.trim();
      }, function(text) {
        expect(text).to.equal('Settings - Account settings');
      })
      .run(done);
    });

  });

  it('update password', function(done) {
    var options = {
      username: faker.internet.userName(),
      email:    faker.internet.email(),
      password: faker.internet.password()
    };
    var newPassword = faker.internet.password();
    var user = new User(options);

    user.signUp()
    .then(function(docs) {
      nightmare.goto('http://localhost:3001/sign_in')
      .type('input[name="usernameEmail"]', options.email)
      .type('input[name="password"]', options.password)
      .click('button.btn.btn-default')
      .wait('.alert-message')

      .goto('http://localhost:3001/settings/account')
      .url(function(url) {
        expect(url).to.equal('http://localhost:3001/settings/account');
      })
      .type('input[name="current_password"]', options.password)
      .type('input[name="new_password"]', newPassword)
      .click('.change-password button.btn.btn-default')
      .wait('.alert-message')
      .evaluate(function() {
        return document.querySelector('.alert-message').innerText.trim();
      }, function(text) {
        expect(text).to.equal('Success! Updated the password.');
      })
      .run(done);
    });

  });

  it('change email', function(done) {
    var options = {
      username: faker.internet.userName(),
      email:    faker.internet.email(),
      password: faker.internet.password()
    };
    var newEmail = faker.internet.email();
    var user = new User(options);

    user.signUp()
    .then(function(docs) {
      nightmare.goto('http://localhost:3001/sign_in')
      .type('input[name="usernameEmail"]', options.email)
      .type('input[name="password"]', options.password)
      .click('button.btn.btn-default')
      .wait('.alert-message')

      .goto('http://localhost:3001/settings/account')
      .url(function(url) {
        expect(url).to.equal('http://localhost:3001/settings/account');
      })
      .type('input[name="new_email"]', newEmail)
      .click('.change-email button.btn.btn-default')
      .wait('.alert-message')
      .evaluate(function() {
        return document.querySelector('.alert-message').innerText.trim();
      }, function(text) {
        expect(text).to.equal('Success! Updated the email.');
      })
      .run(done);
    });
  });

  it('deactivate account', function(done) {
    var options = {
      username: faker.internet.userName(),
      email:    faker.internet.email(),
      password: faker.internet.password()
    };
    var newEmail = faker.internet.email();
    var user = new User(options);

    user.signUp()
    .then(function(docs) {
      nightmare.goto('http://localhost:3001/sign_in')
      .type('input[name="usernameEmail"]', options.email)
      .type('input[name="password"]', options.password)
      .click('button.btn.btn-default')
      .wait('.alert-message')

      .goto('http://localhost:3001/settings/account')
      .url(function(url) {
        expect(url).to.equal('http://localhost:3001/settings/account');
      })
      .type('input[name="email"]', options.email)
      .click('.deactivate-account button.btn.btn-default')
      .wait('.alert-message')
      .evaluate(function() {
        return document.querySelector('.alert-message').innerText.trim();
      }, function(text) {
        expect(text).to.equal('Sorry to see you go. We deactivated your account.');
      })
      .run(done);
    });
  });

});
