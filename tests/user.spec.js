'use strict';

const should = require('should');
const request = require('request');

describe('When I ask if 2 equals 2', function () {
  it('should return true', function () {
    (2 === 2).should.equal(true);
  });
});
