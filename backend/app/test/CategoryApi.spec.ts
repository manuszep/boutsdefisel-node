require('./env.ts');
const async = require("async");

const chai = require('chai');
const chaiHttp = require('chai-http');
const mochaLog = require('mocha-report-log');
import { it } from 'mocha';
import { cleanDb, getSecurityToken } from './_tools';
import App from '../index';
import CategoryModel from '../api/models/CategoryModel';

let should = chai.should();
chai.use(chaiHttp);

let token = getSecurityToken();
let category1: CategoryModel;
let category2: CategoryModel;

describe('CategoryApi Testing', () => {
  before(() => {
    return cleanDb()
    .catch(() => {
      mochaLog("Could not clean the DB or get a token.");
    });
  });

  describe('/POST category', () => {
    it('it should create a category', (done) => {
      let category = {
        "title": "Category 1",
        "parent": 1
      };

      chai.request(App)
        .post(`/categories`)
        .set('x-access-token', token)
        .send(category)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql("Category 1");
          res.body.should.have.property('parent').eql(1);
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('id');

          category1 = new CategoryModel(res.body);
          done();
        });
    });
  });

  describe('/GET category', () => {
    it('it should retreive a category', (done) => {
      chai.request(App)
      .get(`/categories/${category1.id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title').eql("Category 1");
        res.body.should.have.property('parent').eql(1);
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        res.body.should.have.property('id').eql(category1.id);
        done();
      });
    });
  });

  describe('/PUT category', () => {
    it('it should update a category', (done) => {
      let category = {
        "title": "Category 2"
      };

      async.series([
        function(cb) {
          chai.request(App)
            .put(`/categories/${category1.id}`)
            .set('x-access-token', token)
            .send(category)
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

              cb()
            })
        },
        function(cb) {
          chai.request(App)
          .get(`/categories/${category1.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql("Category 2");
            done();
          })
        }
      ]);
    });
  });

  describe('/PUT category (move)', () => {
    it('it should update and move a category', (done) => {
      let category2_data = {
        "title": "Category 3",
        "parent": 1
      };

      async.series([
        function(cb) {
          chai.request(App)
            .post(`/categories`)
            .set('x-access-token', token)
            .send(category2_data)
            .end((err, res) => {
              res.should.have.status(200);
              category2 = new CategoryModel(res.body);

              cb();
            });
        },
        function(cb) {
          let category = {
            "title": "Moved",
            "parent": category1.id
          };

          chai.request(App)
          .put(`/categories/${category2.id}`)
          .set('x-access-token', token)
          .send(category)
          .end((err, res) => {
            res.should.have.status(200);

            cb();
          });
        },
        function() {
          chai.request(App)
          .get(`/categories/${category1.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.children[0].should.have.property('title').eql("Moved");

            done();
          });
        }
      ]);
    });
  });

  describe('/GET categories', () => {
    it('it should retreive all categories', (done) => {
      chai.request(App)
      .get(`/categories`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.title.should.be.eql("root");
        res.body.children.should.be.a("array");
        res.body.children.length.should.be.eql(1);
        res.body.children[0].title.should.be.eql("Category 2");
        res.body.children[0].children[0].title.should.be.eql("Moved");
        done();
      });
    });
  });

  describe('/DELETE category', () => {
    it('it should delete a category', (done) => {
      async.series([
        function(cb) {
          chai.request(App)
            .delete(`/categories/${category1.id}`)
            .set('x-access-token', token)
            .end((err, res) => {
              res.should.have.status(200);

              cb();
            });
        },
        function(cb) {
          chai.request(App)
          .get(`/categories/${category1.id}`)
          .end((err, res) => {
            res.should.have.status(404);

            cb();
          });
        },
        function() {
          chai.request(App)
          .get(`/categories/${category2.id}`)
          .end((err, res) => {
            res.should.have.status(404);

            done();
          });
        }
      ]);
    });
  });

  describe('/POST without token', () => {
    it('it should send an error without token', (done) => {
      let category = {
        "title": "Category 1",
        "lvl": 0
      };

      chai.request(App)
        .post(`/categories`)
        .send(category)
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
      let category = {
        "title": "Category 1"
      };

      chai.request(App)
        .put(`/categories/${category1.id}`)
        .send(category)
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
        .delete(`/categories/${category1.id}`)
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
