require('./env.ts');

const chai = require('chai');
const chaiHttp = require('chai-http');
const mochaLog = require('mocha-report-log');
import { it } from 'mocha';
import { cleanDb, getSecurityToken, logKeys } from './_tools';
import App from '../index';
import ExchangeModel from '../api/models/ExchangeModel';
import UserModel from '../api/models/UserModel';

let should = chai.should();
chai.use(chaiHttp);

let user1 = new UserModel({
  username: "User 1",
  email: "user1@test.com",
  password: "user1"
});
let user2 = new UserModel({
  username: "User 2",
  email: "user2@test.com",
  password: "user2"
});
let exchange1: ExchangeModel;
let token = getSecurityToken();

describe('ServiceApi Testing', () => {
  before(() => {
    return cleanDb()
    .then(() => {
      return user1.persist();
    })
    .then(() => {
      return user2.persist();
    })
    .catch((err) => {
      mochaLog("Could not clean the DB or get a token.");
    });
  });

  describe('/POST exchange', () => {
    it('it should create an exchange', (done) => {
      let exchange = {
        title: "Exchange 1",
        creditUser: user1.id,
        debitUser: user2.id,
        message: "Testing",
        amount: 10
      };

      chai.request(App)
        .post(`/exchanges`)
        .set('x-access-token', token)
        .send(exchange)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql("Exchange 1");
          res.body.should.have.property('creditUser');
          res.body.creditUser.should.have.property('id').eql(user1.id);
          res.body.should.have.property('debitUser');
          res.body.debitUser.should.have.property('id').eql(user2.id);
          res.body.should.have.property('message').eql("Testing");
          res.body.should.have.property('amount').eql(10);
          res.body.should.have.property('hidden').eql(false);
          res.body.should.have.property('id');

          exchange1 = new ExchangeModel(res.body);
          done();
        });
    });
  });

  describe('/GET exchange', () => {
    it('it should retreive an exchange', (done) => {
      chai.request(App)
      .get(`/exchanges/${exchange1.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title').eql("Exchange 1");
        res.body.should.have.property('creditUser').eql(user1.id);
        res.body.should.have.property('debitUser').eql(user2.id);
        res.body.should.have.property('message').eql("Testing");
        res.body.should.have.property('amount').eql(10);
        res.body.should.have.property('hidden').eql(0);
        res.body.should.have.property('id');
        done();
      });
    });
  });

  describe('/PUT exchange', () => {
    it('it should update an exchange', (done) => {
      let exchange = {
        "title": "Exchange 2"
      };

      chai.request(App)
      .put(`/exchanges/${exchange1.id}`)
      .set('x-access-token', token)
      .send(exchange)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title').eql("Exchange 2");
        res.body.should.have.property('creditUser');
        res.body.creditUser.should.have.property('id').eql(user1.id);
        res.body.should.have.property('debitUser');
        res.body.debitUser.should.have.property('id').eql(user2.id);
        res.body.should.have.property('message').eql("Testing");
        res.body.should.have.property('amount').eql(10);
        res.body.should.have.property('hidden').eql(0);
        res.body.should.have.property('id');
        done();
      });
    });
  });

  describe('/GET exchanges', () => {
    it('it should retreive all exchanges', (done) => {
      chai.request(App)
      .get(`/exchanges`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
    });
  });

  describe('/DELETE exchange', () => {
    it('it should delete an exchange', (done) => {
      chai.request(App)
        .delete(`/exchanges/${exchange1.id}`)
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
        .get(`/exchanges/${exchange1.id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('deletedAt');
          done();
        });
    });
  });

  describe('/POST without token', () => {
    it('it should send an error without token', (done) => {
      let exchange = {
        title: "Exchange 1",
        creditUser: user1.id,
        debitUser: user2.id,
        message: "Testing",
        amount: 10
      };

      chai.request(App)
        .post(`/exchanges`)
        .send(exchange)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
  });

  describe('/PUT without token', () => {
    it('it should send an error without token', (done) => {
      let exchange = {
        "title": "Exchange 2"
      };

      chai.request(App)
        .put(`/exchanges/${exchange1.id}`)
        .send(exchange)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
  });

  describe('/DELETE without token', () => {
    it('it should send an error without token', (done) => {
      chai.request(App)
        .delete(`/exchanges/${exchange1.id}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql("No token");
          done();
        });
    });
  });
});
