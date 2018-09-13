require('./env.ts');

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { it } from 'mocha';
import CategoryModel from '../api/models/CategoryModel';
import ServiceModel from '../api/models/ServiceModel';

before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

const id = 2;
const title = 'Title 1';
const parent = 1;
const children = [
  {
    id: 3,
    title: 'category 1',
    parent: 2,
    slug: 'category-1',
    createdAt: '2018-05-13T21:21:17.000Z',
    updatedAt: '2018-05-13T21:21:17.000Z'
  },
  {
    id: 4,
    title: 'category 2',
    parent: 2,
    createdAt: '2018-05-13T21:21:21.000Z',
    updatedAt: '2018-05-13T21:21:21.000Z'
  },
  {
    id: 5,
    title: 'category 3',
    parent: 2,
    createdAt: '2018-05-13T21:21:24.000Z',
    updatedAt: '2018-05-13T21:21:24.000Z'
  }
];

describe('Category Serialise', () => {
  it('should populate object properties and fields with constructor', () => {
    const category = new CategoryModel({
      id,
      title,
      parent,
      children
    });

    chai.expect(category.id).to.equal(id);
    chai.expect(category.title).to.equal(title);
    chai.expect(category.parent).to.equal(parent);
    chai.expect(category.children).to.equal(children);
  });
});

describe('Category Getters and Setters', () => {
  const category = new CategoryModel();
  const parent = new CategoryModel({id: 1});
  const services = [
    new ServiceModel({id: 1}),
    new ServiceModel({id: 2}),
    new ServiceModel({id: 3})
  ];
  const children = [
    new CategoryModel({id: 1}),
    new CategoryModel({id: 2}),
    new CategoryModel({id: 3})
  ]

  it('should set and get the title', () => {
    category.title = "test";

    chai.expect(category.title).to.equal("test");
  });

  it('should set and get the parent', () => {
    category.parent = parent;

    chai.expect(category.parent).to.equal(parent);
  });

  it('should set and get the services', () => {
    category.services = services;

    chai.expect(category.services).to.equal(services);
    chai.expect(category.services.length).to.equal(3);
  });

  it('should set and get the children', () => {
    category.children = children;

    chai.expect(category.children).to.equal(children);
    chai.expect(category.children.length).to.equal(3);
  });
});

describe('Category add services or children', () => {
  const category = new CategoryModel();
  const services = [
    new ServiceModel({id: 1}),
    new ServiceModel({id: 2}),
    new ServiceModel({id: 3})
  ];
  const children = [
    new CategoryModel({id: 1}),
    new CategoryModel({id: 2}),
    new CategoryModel({id: 3})
  ]

  category.services = services;
  category.children = children;

  it('should add a service', () => {
    category.addService(new ServiceModel({id: 4}));

    chai.expect(category.services.length).to.equal(4);
  });

  it('should add a child', () => {
    category.addChild(new CategoryModel({id: 4}));

    chai.expect(category.children.length).to.equal(4);
  });
});

/*describe('Category setParent', () => {
  it('setParent should set the parent value and adapt lvl accordingly', () => {
    const parentCategory = new CategoryModel({
      id: 3,
      title: "parent",
    });

    const childCategory = new CategoryModel({
      id: 4,
      title: "child",
    });

    childCategory.setParent(parentCategory);

    chai.expect(childCategory.parent).to.equal(3);
    chai.expect(childCategory.lvl).to.equal(1);
  });
});

describe('Category setParent', () => {
  it('setParent should set the parent value and adapt lvl accordingly', () => {
    const parentCategory = new CategoryModel({
      id: 3,
      title: "parent",
      lvl: 0
    });

    const childCategory = new CategoryModel({
      id: 4,
      title: "child",
      lvl: 0
    });

    childCategory.setParent(parentCategory);

    chai.expect(childCategory.parent).to.equal(3);
    chai.expect(childCategory.lvl).to.equal(1);
  });
});*/
