'use strict'; // eslint-disable-line

const fs = require('fs');
const Path = require('path');
const should = require('should');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jimp = require('jimp');

const Assert = new should.Assertion(true);
const baseUrl = `localhost:${process.env.PORT}/api/v1/`;


describe('Micro-service test suite', function () { // eslint-disable-line
  const credentials = {
    username: 'user1',
    password: 'pass1',
  };
  const validToken = `Bearer ${jwt.sign(credentials, 'secret')}`;
  // const invalidToken = 'invalid-token'; // TODO:* Make use of me // eslint-disable-line
  let userDirectory = Path.join(__dirname, '../data/test'); // eslint-disable-line
  let thumbnailPath = '';
  const patchJson = {
    name: 'fullnames',
    handle: 'newHandle',
  };
  const stripFilename = function (path) { // eslint-disable-line
    return path.replace(/^(.*)\//, '');
  };


  before(function () { // eslint-disable-line
    // TODO:* login user
  });

  after(function () { // eslint-disable-line
    fs.exists(thumbnailPath, function (thumbnailExist) { // eslint-disable-line
      if (thumbnailExist) {
        fs.unlink(thumbnailPath, function (er) { // eslint-disable-line
          if (er) {
            throw new Error(er);
          }
          thumbnailPath = '';
        });
      }
    });
  });

  describe('/login User authentication', function () { // eslint-disable-line
    const invalidBodyParam = {
      invalid: 'invalid body parameter',
    };
    it('Respond with a 200 user login request', function () { // eslint-disable-line 
      axios.post(`${baseUrl}login`, credentials)
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should.exist(res.body.token);
          should(res.body.token).be.a.String();
          should(res.body.token.replace).be.eql(validToken);
          should(res.body).be.eql(validToken);
          should(res.status).be.eql(200);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with a 500 login with invalid body parameter', function () { // eslint-disable-line
      axios.post(`${baseUrl}login`, invalidBodyParam, {
        'Content-Type': 'application/json',
      })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(500);
        });
    });

    it('Respond with 500 user login request without credentails', function () { // eslint-disable-line
      axios.post(`${baseUrl}login`, {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          res.status.should.eql(500);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
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
    it('Respont with 200  authenticated request', function () { // eslint-disable-line
      axios.patch(`${baseUrl}json/patch`,
        {
          json,
          patch,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: validToken,
          },
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(200);
          should(res.body).be.eql(patchJson);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 401 unauthenticated patch request', function () { // eslint-disable-line
      axios.patch(`${baseUrl}json/patch`,
        {
          json,
          patch,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: validToken,
          },
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(401);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 401 unauthenticated with valid body', function () { // eslint-disable-line
      axios.patch(`${baseUrl}json/patch`,
        {
          json,
          patch,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(401);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 500 authenticated with invalid body parameters', function () { // eslint-disable-line
      axios.patch(`${baseUrl}json/patch`,
        {
          invalidBodyParam,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: validToken,
          },
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(500);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 500 unauthenticated without empty body parameters', function () { // eslint-disable-line
      axios.patch(`${baseUrl}json/patch`, {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(401);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
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
    it('Respond with 200 authenticated with valid body parameters', function () { // eslint-disable-line
      axios.post(`${baseUrl}thumbnail`, bodyParam,
        {
          'Content-Type': 'application/json',
          Authorization: validToken,
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          const filename = stripFilename(bodyParam.path);
          // read thumbnail
          jimp.read(`${userDirectory}/${filename}`)
            .then((thumbnail) => {
              const { width, height } = thumbnail;
              should(width).be.eql(50);
              should(height).be.eql(50);
              should(res.status).be.eql(200);
            })
            .catch((er) => {
              Assert.fail(er);
            });
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 401 unauthenticated with invalid body', function () { // eslint-disable-line
      const invalidBodyParam = {
        invalid: 'invalid body parameter object',
      };
      axios.post(`${baseUrl}thumbnail`, invalidBodyParam,
        {
          'Content-Type': 'application/json',
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(401);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 401 unauthenticated with valid body parameters', function () { // eslint-disable-line
      axios.post(`${baseUrl}thumbnail`, bodyParam,
        {
          'Content-Type': 'application/json',
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(401);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });

    it('Respond with 500 authenticated with invalid body parameters', function () { // eslint-disable-line
      const invalidBodyParam = {
        invalid: 'invalid body parameter object',
      };
      axios.post(`${baseUrl}thumbnail`, invalidBodyParam,
        {
          'Content-Type': 'application/json',
          Authorization: validToken,
        })
        .then(function (res) { // eslint-disable-line
          should.exist(res);
          should(res.status).be.eql(500);
        })
        .catch(function (er) { // eslint-disable-line
          Assert.fail(er);
        });
    });
  });

  it('Respond with 401 unauthenticated with invalid body', function () { // eslint-disable-line
    const invalidBodyParam = {
      invalid: 'invalid body parameter object',
    };
    axios.post(`${baseUrl}thumbnail`, invalidBodyParam,
      {
        'Content-Type': 'application/json',
        Authorization: validToken,
      })
      .then(function (res) { // eslint-disable-line
        should.exist(res);
        should(res.status).be.eql(500);
      })
      .catch(function (er) { // eslint-disable-line
        Assert.fail(er);
      });
  });

  it('Respond with 500 authenticated with empty body parameters', function () { // eslint-disable-line
    axios.post(`${baseUrl}thumbnail`, {},
      {
        'Content-Type': 'application/json',
        Authorization: validToken,
      })
      .then(function (res) { // eslint-disable-line
        should.exist(res);
        should(res.status).be.eql(500);
      })
      .catch(function (er) { // eslint-disable-line
        Assert.fail(er);
      });
  });
});
