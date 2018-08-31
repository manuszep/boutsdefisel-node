require('./env.ts');

const chai = require('chai');
const chaiHttp = require('chai-http');
const mochaLog = require('mocha-report-log');
import { it } from 'mocha';
import { cleanDb, logKeys } from './_tools';
import App from '../index';
import UserManager from '../api/models/UserManager';
import UserModel from '../api/models/UserModel';
import { ROLE_ADMIN, ROLE_USER } from '../lib/roles';

let should = chai.should();
chai.use(chaiHttp);

let admin: UserModel;
let user1: UserModel;
let token;

describe('UserApi testing', () => {
  before(() => {
    return cleanDb()
    .then(() => {
      return UserManager.findOneByUsername("admin");
    })
    .then(user => {
      mochaLog(user.id);
      admin = user;
    })
    .catch(() => {
      mochaLog("Could not retreive admin user.");
    });
  });

  describe('/POST authenticate', () => {
    it('it should get an authentification token', (done) => {
      let user = {
        "username": "admin",
        "password": "admin"
      };

      chai.request(App)
        .post('/authenticate')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });
  });

  describe('/GET user', () => {
    it('it should get an individual user', (done) => {
      chai.request(App)
        .get(`/users/${admin.id}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('enabled').eql(1);
          res.body.should.have.property('locked').eql(0);
          res.body.should.have.property('role').eql(ROLE_ADMIN);
          res.body.should.have.property('balance').eql(0);
          res.body.should.have.property('id').eql(admin.id);
          res.body.should.have.property('username').eql('admin');
          res.body.should.have.property('usernameCanonical').eql('admin');
          res.body.should.have.property('email').eql('admin@test.com');
          res.body.should.have.property('emailCanonical').eql('admin@test.com');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          done();
        });
    });
  });

  describe('/POST user', () => {
    it('it should create a user', (done) => {
      let user = {
        "username": "User1",
        "email": "user1@test.com",
        "password": "user1"
      };

      chai.request(App)
        .post(`/users`)
        .set('x-access-token', token)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('enabled').eql(false);
          res.body.should.have.property('locked').eql(false);
          res.body.should.have.property('role').eql(ROLE_USER);
          res.body.should.have.property('balance').eql(0);
          res.body.should.have.property('username').eql('User1');
          res.body.should.have.property('usernameCanonical').eql('user1');
          res.body.should.have.property('email').eql('user1@test.com');
          res.body.should.have.property('emailCanonical').eql('user1@test.com');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('id');

          user1 = new UserModel(res.body);
          done();
        });
    });
  });

  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(App)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        })
    });
  });

  describe('/PUT user', () => {
    it('it should update a user', (done) => {
      let user = {
        "enabled": true
      };

      chai.request(App)
        .put(`/users/${user1.id}`)
        .set('x-access-token', token)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('fieldCount').eql(0);
          res.body.should.have.property('affectedRows').eql(1);
          res.body.should.have.property('insertId').eql(0);
          res.body.should.have.property('serverStatus').eql(2);
          res.body.should.have.property('warningCount').eql(0);
          res.body.should.have.property('message');
          res.body.should.have.property('protocol41').eql(true);
          res.body.should.have.property('changedRows').eql(1);
          done();
        });
    });
  });

  describe('/DELETE user', () => {
    it('it should delete a user', (done) => {
      chai.request(App)
        .delete(`/users/${user1.id}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('fieldCount').eql(0);
          res.body.should.have.property('affectedRows').eql(1);
          res.body.should.have.property('insertId').eql(0);
          res.body.should.have.property('serverStatus');
          res.body.should.have.property('warningCount').eql(0);
          res.body.should.have.property('message');
          res.body.should.have.property('protocol41').eql(true);
          res.body.should.have.property('changedRows').eql(1);
          done();
        });
    });

    it('it should have a deletedAt field', (done) => {
      chai.request(App)
        .get(`/users/${user1.id}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('deletedAt');
          done();
        });
    });
  });

  describe('/GET user without token or with wrong token', () => {
    it('it should send an error without token', (done) => {
      chai.request(App)
        .get(`/users/${admin.id}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
    it('it should send an error with wrong token', (done) => {
      chai.request(App)
        .get(`/users/${admin.id}`)
        .set('x-access-token', "a")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("Invalid token");
          done();
        });
    });
  });

  describe('/POST user without token', () => {
    it('it should send an error without token', (done) => {
      let user = {
        "username": "User1",
        "email": "user1@test.com",
        "password": "user1"
      };

      chai.request(App)
        .post(`/users`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
  });

  describe('/PUT user without token', () => {
    it('it should send an error without token', (done) => {
      let user = {
        "enabled": true
      };

      chai.request(App)
        .put(`/users/${user1.id}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
  });

  describe('/DELETE user without token', () => {
    it('it should send an error without token', (done) => {
      chai.request(App)
        .delete(`/users/${admin.id}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
  });

  describe('/POST user without data', () => {
    it('it should send an error', (done) => {
      chai.request(App)
        .post(`/users`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('code').eql('ER_NO_DEFAULT_FOR_FIELD');
          done();
        });
    });
  });

  describe('/PUT user without data', () => {
    it('it should send an error', (done) => {
      chai.request(App)
        .put(`/users/${user1.id}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('code').eql('NO_CHANGES');
          done();
        });
    });
  });

  describe('/POST authenticate without data', () => {
    it('it should send an error', (done) => {
      let user = {
        "username": "admin"
      };

      chai.request(App)
        .post('/authenticate')
        .send(user)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('code').eql('NO_AUTH');
          done();
        });
    });
  });
});
