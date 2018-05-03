/* global describe beforeEach it */

const chai = require('chai');

const { assert, expect } = chai;
const chaiAsPromised = require('chai-as-promised');
const db = require('../index');

chai.use(chaiAsPromised);
const User = db.model('user');
const { ValidationError } = require('sequelize');

describe('User model', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  describe('validations', () => {
    beforeEach(() => {
      return db.sync({ force: true });
    });

    it('throws an error if email is undefined', () => {
      return assert.isRejected(User.create(), ValidationError);
    });

    it('throws an error if displayName is undefined', () => {
      return assert.isRejected(User.create({ email: 'yahoo@yahoo.com' }), ValidationError);
    });

    it('throws an error if displayName is empty', () => {
      return assert.isRejected(User.create({ email: 'yahoo@yahoo.com', displayName: '' }), ValidationError);
    });

    it('throws an error if description is empty', () => {
      return assert.isRejected(User.create({ email: 'yahoo@yahoo.com' }), ValidationError);
    });
  });

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let cody;

      beforeEach(() => {
        return User.create({
          email: 'cody@puppybook.com',
          password: 'bones',
          displayName: 'cody',
        })
          .then((user) => {
            cody = user;
          });
      });

      it('returns true if the password is correct', () => {
        expect(cody.correctPassword('bones')).to.be.equal(true);
      });

      it('returns false if the password is incorrect', () => {
        expect(cody.correctPassword('bonez')).to.be.equal(false);
      });
    });
  });
});
