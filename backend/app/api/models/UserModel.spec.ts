import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { it } from 'mocha';
import UserModel from './UserModel';
import { ROLE_USER, ROLE_COCO } from '../../lib/roles';

before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

const username = 'TestUser1';
const email = 'TestUser1@test.com';
const salt = 'ThisIsASalt';
const password = 'ThisIsAPassword';
const lastLogin = new Date();
const confirmationToken = 'thisIsAConfirmationToken';
const passwordRequestedAt = new Date();
const role = ROLE_COCO;
const street = 'Javascript street';
const streetNumber = '1A';
const streetBox = 'C';
const city = 'TypescriptVille';
const zip = 1000;
const phone = '02 123 45 67';
const mobile = '0477 12 34 56';
const mobile2 = '0477 78 90 12';
const balance = 10.55;
const picture = 'pic.jpg';

const createFullUser = () => new UserModel({
  username,
  email,
  enabled: true,
  locked: true,
  salt,
  password,
  lastLogin,
  confirmationToken,
  passwordRequestedAt,
  role,
  street,
  streetNumber,
  streetBox,
  city,
  zip,
  phone,
  mobile,
  mobile2,
  balance,
  picture
});

describe('User Constructor', () => {
  it('should return the very basic UserModel object', () => {
    const user = new UserModel();
    chai.expect(user.enabled).to.equal(false);
    chai.expect(user.locked).to.equal(false);
    chai.expect(user.role).to.equal(ROLE_USER);
    chai.expect(user.salt).to.not.be.undefined;
  });
});

describe('User Canonical', () => {
  it('should generate usernameCanonical', () => {
    const user = new UserModel();
    user.username = username;
    chai.expect(user.username).to.equal(username);
    chai.expect(user.usernameCanonical).to.equal(username.toLowerCase());
  });

  it('should generate emailCanonical', () => {
    const user = new UserModel();
    user.email = email;
    chai.expect(user.email).to.equal(email);
    chai.expect(user.emailCanonical).to.equal(email.toLowerCase());
  });
});

describe('User Phones', () => {
  it('should transform phone number', () => {
    const user = new UserModel();
    user.phone = phone;
    chai.expect(user.phone).to.equal('+3221234567');
  });

  it('should transform mobile number', () => {
    const user = new UserModel();
    user.mobile = mobile;
    chai.expect(user.mobile).to.equal('+32477123456');
  });

  it('should transform mobile2 number', () => {
    const user = new UserModel();
    user.mobile2 = mobile2;
    chai.expect(user.mobile2).to.equal('+32477789012');
  });
});

describe('User Password', () => {
  it('should generate salt and encrypt a password', () => {
    const user = new UserModel();
    const currentSalt = user.salt;
    user.plainPassword = password;

    chai.expect(user.salt).to.not.be.undefined;
    chai.expect(user.salt).to.not.equal(currentSalt); // Make sure a new salt is made
    chai.expect(user.password.length).to.equal(128);
  });

  it('should authenticate a user against password and return token', () => {
    const user = new UserModel();
    user.plainPassword = password;

    chai.expect(() => user.authenticate('wrongPassword')).to.throw();

    const auth = user.authenticate(password);
    chai.expect(auth.length).to.equal(153);
    chai.expect(auth.indexOf('.')).to.equal(36);
  });
});

describe('User Serialise', () => {
  it('should populate object properties and fields with constructor', () => {
    const user = createFullUser();

    chai.expect(user.username).to.equal(username);
    chai.expect(user.usernameCanonical).to.equal(username.toLowerCase());
    chai.expect(user.email).to.equal(email);
    chai.expect(user.emailCanonical).to.equal(email.toLowerCase());
    chai.expect(user.enabled).to.equal(true);
    chai.expect(user.locked).to.equal(true);
    chai.expect(user.salt).to.equal(salt);
    chai.expect(user.password).to.equal(password);
    chai.expect(user.lastLogin).to.equal(lastLogin);
    chai.expect(user.confirmationToken).to.equal(confirmationToken);
    chai.expect(user.passwordRequestedAt).to.equal(passwordRequestedAt);
    chai.expect(user.role).to.equal(role);
    chai.expect(user.street).to.equal(street);
    chai.expect(user.streetNumber).to.equal(streetNumber);
    chai.expect(user.streetBox).to.equal(streetBox);
    chai.expect(user.city).to.equal(city);
    chai.expect(user.zip).to.equal(zip);
    chai.expect(user.phone).to.equal('+3221234567');
    chai.expect(user.mobile).to.equal('+32477123456');
    chai.expect(user.mobile2).to.equal('+32477789012');
    chai.expect(user.balance).to.equal(balance);
    chai.expect(user.picture).to.equal(picture);
  });

  it('should serialize data', () => {
    const user = createFullUser();

    const serialised = user.serialize();

    chai.expect(serialised.username).to.not.be.undefined;
    chai.expect(serialised.usernameCanonical).to.not.be.undefined;
    chai.expect(serialised.email).to.not.be.undefined;
    chai.expect(serialised.emailCanonical).to.not.be.undefined;
    chai.expect(serialised.enabled).to.not.be.undefined;
    chai.expect(serialised.locked).to.not.be.undefined;
    chai.expect(serialised.salt).to.not.be.undefined;
    chai.expect(serialised.password).to.not.be.undefined;
    chai.expect(serialised.lastLogin).to.not.be.undefined;
    chai.expect(serialised.confirmationToken).to.not.be.undefined;
    chai.expect(serialised.passwordRequestedAt).to.not.be.undefined;
    chai.expect(serialised.role).to.not.be.undefined;
    chai.expect(serialised.street).to.not.be.undefined;
    chai.expect(serialised.streetNumber).to.not.be.undefined;
    chai.expect(serialised.streetBox).to.not.be.undefined;
    chai.expect(serialised.city).to.not.be.undefined;
    chai.expect(serialised.zip).to.not.be.undefined;
    chai.expect(serialised.phone).to.not.be.undefined;
    chai.expect(serialised.mobile).to.not.be.undefined;
    chai.expect(serialised.mobile2).to.not.be.undefined;
    chai.expect(serialised.balance).to.not.be.undefined;
    chai.expect(serialised.picture).to.not.be.undefined;
  });
});
