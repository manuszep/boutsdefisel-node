require('./env.ts');

const chai = require('chai');
const chaiHttp = require('chai-http');
const mochaLog = require('mocha-report-log');
import { it } from 'mocha';
import { cleanDb, getSecurityToken, logKeys } from './_tools';
import App from '../index';
import ServiceModel from '../api/models/ServiceModel';
import UserModel from '../api/models/UserModel';
import CategoryModel from '../api/models/CategoryModel';

let should = chai.should();
chai.use(chaiHttp);

let user1 = new UserModel({
  username: "User 1",
  email: "user1@test.com",
  password: "user1"
});
let category1 = new CategoryModel({
  title: "Category 1"
});
let service1: ServiceModel;
let token = getSecurityToken();

describe('ServiceApi Testing', () => {
  before(() => {
    return cleanDb()
    .then(() => {
      return user1.persist();
    })
    .then(() => {
      return category1.persist();
    })
    .catch((err) => {
      console.log(err);
      mochaLog("Could not clean the DB or get a token.");
    });
  });

  describe('/POST service', () => {
    it('it should create a service', (done) => {
      let service = {
        title: "Service 1",
        body: "This is the service 1",
        user: user1.id,
        type: 1,
        domain: 1,
        category: category1.id
      };

      chai.request(App)
        .post(`/services`)
        .set('x-access-token', token)
        .send(service)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql("Service 1");
          res.body.should.have.property('slug').eql("user-1-service-1");
          res.body.should.have.property('body').eql("This is the service 1");
          res.body.should.have.property('user');
          res.body.user.should.have.property('id').eql(user1.id);
          res.body.should.have.property('type').eql(1);
          res.body.should.have.property('domain').eql(1);
          res.body.should.have.property('category');
          res.body.category.should.have.property('id').eql(category1.id);

          service1 = new ServiceModel(res.body);
          done();
        });
    });
  });

  describe('/GET service', () => {
    it('it should retreive a service', (done) => {
      chai.request(App)
      .get(`/services/${service1.slug}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title').eql("Service 1");
        res.body.should.have.property('slug').eql("user-1-service-1");
        res.body.should.have.property('body').eql("This is the service 1");
        res.body.should.have.property('user').eql(user1.id);
        res.body.should.have.property('type').eql(1);
        res.body.should.have.property('domain').eql(1);
        res.body.should.have.property('category').eql(category1.id);
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        res.body.should.have.property('id');
        done();
      });
    });
  });

  describe('/PUT service', () => {
    it('it should update a service', (done) => {
      let service = {
        "title": "Service 2"
      };

      chai.request(App)
      .put(`/services/${service1.slug}`)
      .set('x-access-token', token)
      .send(service)
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

        service1.title = "Service 2";
        done();
      });
    });
  });

  describe('/GET services', () => {
    it('it should retreive all services', (done) => {
      chai.request(App)
      .get(`/services`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
    });
  });

  describe('/DELETE service', () => {
    it('it should delete a service', (done) => {
      chai.request(App)
        .delete(`/services/${service1.slug}`)
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
        .get(`/services/${service1.slug}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('deletedAt');
          done();
        });
    });
  });

  describe('/POST without token', () => {
    it('it should send an error without token', (done) => {
      let service = {
        title: "Service 1",
        body: "This is the service 1",
        user: user1.id,
        type: 1,
        domain: 1,
        category: category1.id
      };

      chai.request(App)
        .post(`/services`)
        .send(service)
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
      let service = {
        "title": "Service 1"
      };

      chai.request(App)
        .put(`/services/${service1.slug}`)
        .send(service)
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
        .delete(`/services/${service1.slug}`)
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
