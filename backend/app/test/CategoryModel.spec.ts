require('./env.ts');

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { it } from 'mocha';
import CategoryModel from '../api/models/CategoryModel';

before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

const id = 2;
const title = 'Title 1';
const lvl = '0';
const parent = null;
const slug = 'title-1';
const children = [
  {
    id: 2,
    title: 'category 1',
    lvl: 1,
    parent: 1,
    slug: 'category-1',
    createdAt: '2018-05-13T21:21:17.000Z',
    updatedAt: '2018-05-13T21:21:17.000Z',
    deletedAt: null
  },
  {
    id: 3,
    title: 'category 2',
    lvl: 1,
    parent: 1,
    slug: 'category-2',
    createdAt: '2018-05-13T21:21:21.000Z',
    updatedAt: '2018-05-13T21:21:21.000Z',
    deletedAt: null
  },
  {
    id: 4,
    title: 'category 3',
    lvl: 1,
    parent: 1,
    slug: 'category-3',
    createdAt: '2018-05-13T21:21:24.000Z',
    updatedAt: '2018-05-13T21:21:24.000Z',
    deletedAt: null
  }
];

describe('Category Setters', () => {
  it('should generate slug from title', () => {
    const category = new CategoryModel();
    category.title = title;
    chai.expect(category.slug).to.equal('title-1');
  });
});

describe('Category Serialise', () => {
  it('should populate object properties and fields with constructor', () => {
    const category = new CategoryModel({
      id,
      title,
      lvl,
      parent,
      slug,
      children
    });

    chai.expect(category.id).to.equal(id);
    chai.expect(category.title).to.equal(title);
    chai.expect(category.lvl).to.equal(lvl);
    chai.expect(category.parent).to.equal(parent);
    chai.expect(category.slug).to.equal(slug);
    chai.expect(category.children).to.equal(children);
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
});
