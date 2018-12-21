'use strict'; // eslint-disable-line

const fs = require('fs');
const Path = require('path');
const should = require('should');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const jimp = require('jimp');
const Server = require('../app');
const authHelper = require('../authHelper');

const PORT = process.env.PORT || 3000;
const baseUrl = `/api/v1/`;
let app;
let server;

describe('Micro-service test cases\n ', function () { // eslint-disable-line
  before(function (done) { // eslint-disable-line
    // start server
    Server().then((App) => { // eslint-disable-line
      // Start listening
      server = App.listen(PORT, function (er) { // eslint-disable-line
        app = App;
        return done();
      });
    });
  });

  after(function (done) { // eslint-disable-line
    return done();
  });

  describe('\n \n', function () { // eslint-disable-line
    const credentials = {
      username: 'testuser',
      password: 'pass1',
    };
    const validToken = `Bearer ${jwt.sign(credentials, 'secret')}`;
    // const invalidToken = 'invalid-token'; // TODO:* Make use of me // eslint-disable-line
    let userDirectory = Path.join(__dirname, '../data/test'); // eslint-disable-line
    const patchJson = {
      name: 'fullnames',
      handle: 'newHandle',
    };
    const stripFilename = function (path) { // eslint-disable-line
      return path.replace(/^(.*)\//, '');
    };

    after(function () { // eslint-disable-line
      fs.readdir(userDirectory, (err, files) => { // eslint-disable-line
        if (err) throw err;

        for (const file of files) {
          fs.unlink(Path.join(userDirectory, file), err => { // eslint-disable-line
            if (err) throw err;
          });
        }
      });
    });

    describe('/login User authentication', function () { // eslint-disable-line
      const invalidBodyParam = {
        invalid: 'invalid body parameter',
      };
      it('Respond with a 200 login request', function (done) { // eslint-disable-line 

        request(app)
          .post(`${baseUrl}login`)
          .send(credentials)
          .expect(200, done);
      });

      it('Respond with a 400 login with invalid body parameter', function (done) { // eslint-disable-line
        request(app)
          .post(`${baseUrl}login`)
          .send(invalidBodyParam)
          .expect(400, done);
      });

      it('Respond with 400 login request with empty body', function (done) { // eslint-disable-line
        request(app)
          .post(`${baseUrl}login`)
          .send({})
          .expect(400, done);
      });
    });


    describe('/json/patch  Json Patching', function () { // eslint-disable-line
      const json = {
        name: 'fullnames',
        handle: 'handle',
      };
      const patch = {
        op: 'replace',
        path: '/handle',
        value: 'newHandle',
      };
      const invalidBodyParam = {
        json,
        obj: {
          value: 'unexpected obejct',
        },
      };
      it('Respond with 200 authenticated json patch request', function (done) { // eslint-disable-line
        request(app)
          .patch(`${baseUrl}json/patch`)
          .set({
            'Content-Type': 'application/json',
            Authorization: validToken,
          })
          .send({ json, patch, })
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(200);
              should(res.body).be.eql(patchJson);
              done();
            }
          });
      });

      it('Respond with 401 unauthenticated json patch request', function (done) { // eslint-disable-line
        request(app)
          .patch(`${baseUrl}json/patch`)
          .set({
            'Content-Type': 'application/json',
          })
          .send({ json, patch, })
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(401);
              done();
            }
          });
      });

      it('Respond with 401 unauthenticated json patch with valid body', function (done) { // eslint-disable-line
        request(app)
          .patch(`${baseUrl}json/patch`)
          .set({
            'Content-Type': 'application/json',
          })
          .send({ json, patch, })
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(401);
              done();
            }
          });
      });

      it('Respond with 500 authenticated json patch with invalid body parameters', function (done) { // eslint-disable-line
        request(app)
          .patch(`${baseUrl}json/patch`)
          .set({
            'Content-Type': 'application/json',
            Authorization: validToken,
          })
          .send(invalidBodyParam)
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(500);
              done();
            }
          });
      });

      it('Respond with 500 unauthenticated json patch without empty body parameters', function (done) { // eslint-disable-line
        request(app)
          .patch(`${baseUrl}json/patch`)
          .set({
            'Content-Type': 'application/json',
          })
          .send(invalidBodyParam)
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(401);
              done();
            }
          });
      });
    });


    describe('/thumbnail thumbnail resizing', function () { // eslint-disable-line
      const bodyParam = {
        path: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        size: {
          unit: 'pixel',
          dimentions: {
            width: '50',
            height: '50',
          },
        },
      };
      it('Respond with 200 authenticated thumbnail resize with valid body parameters', function (done) { // eslint-disable-line
        request(app)
          .post(`${baseUrl}thumbnail`)
          .set({
            'Content-Type': 'application/json',
            Authorization: validToken,
          })
          .send(bodyParam)
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              const filename = stripFilename(bodyParam.path);
              const path = `${userDirectory}/new-${filename}`;
              console.log(path);
              // read thumbnail
              jimp.read(path)
                .then((thumbnail) => {
                  const width = thumbnail.getWidth();
                  const height = thumbnail.getHeight();
                  should.exist(thumbnail);
                  should.exist(thumbnail.getWidth());
                  should.exist(thumbnail.getHeight());
                  should.exist(res.status);
                  should(width).be.eql(50);
                  should(height).be.eql(50);
                  should(res.status).be.eql(200);
                  done();
                })
                .catch((er) => {
                  done(er);
                });
            }
          });
      }).timeout(4500);

      it('Respond with 401 unauthenticated thumbnail resize with valid body parameters', function (done) { // eslint-disable-line
        request(app)
          .post(`${baseUrl}thumbnail`)
          .set({
            'Content-Type': 'application/json',
          })
          .send(bodyParam)
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(401);
              done();
            }
          });
      });

      it('Respond with 500 authenticated thumbnail resize with invalid body parameters', function (done) { // eslint-disable-line
        const invalidBodyParam = {
          invalid: 'invalid body parameter object',
        };
        request(app)
          .post(`${baseUrl}thumbnail`)
          .set({
            'Content-Type': 'application/json',
            Authorization: validToken,
          })
          .send(invalidBodyParam)
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(500);
              done();
            }
          });
      });

      it('Respond with 500 unauthenticated thumbnail resize with invalid body', function (done) { // eslint-disable-line
        const invalidBodyParam = {
          invalid: 'invalid body parameter object',
        };
        request(app)
          .post(`${baseUrl}thumbnail`)
          .set({
            'Content-Type': 'application/json',
            Authorization: validToken,
          })
          .send(invalidBodyParam)
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(500);
              done();
            }
          });
      });

      it('Respond with 500 authenticated thumbnail resize with empty body parameters', function (done) { // eslint-disable-line
        request(app)
          .post(`${baseUrl}thumbnail`)
          .set({
            'Content-Type': 'application/json',
            Authorization: validToken,
          })
          .send({})
          .end((er, res) => {
            if (er) {
              done(er);
            } else {
              should.exist(res);
              should(res.status).be.eql(500);
              done();
            }
          });
      });
    });
  });
});
