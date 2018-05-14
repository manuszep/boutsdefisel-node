import CategoryModel from './CategoryModel';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import { it } from 'mocha';

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
    "id": 2,
    "title": "category 1",
    "lvl": 1,
    "parent": 1,
    "slug": "category-1",
    "createdAt": "2018-05-13T21:21:17.000Z",
    "updatedAt": "2018-05-13T21:21:17.000Z",
    "deletedAt": null
  },
  {
    "id": 3,
    "title": "category 2",
    "lvl": 1,
    "parent": 1,
    "slug": "category-2",
    "createdAt": "2018-05-13T21:21:21.000Z",
    "updatedAt": "2018-05-13T21:21:21.000Z",
    "deletedAt": null
  },
  {
    "id": 4,
    "title": "category 3",
    "lvl": 1,
    "parent": 1,
    "slug": "category-3",
    "createdAt": "2018-05-13T21:21:24.000Z",
    "updatedAt": "2018-05-13T21:21:24.000Z",
    "deletedAt": null
  }
];

const hydrateObjects = (rows:{[key:string]:any}[]):CategoryModel[] => {
  const data = [];
  rows.forEach(row => {
    if (typeof row.children !== 'undefined' && row.children !== null) {
      row.children = hydrateObjects(row.children);
    }

    data.push(new CategoryModel(row));
  });

  return data;
}

describe('Category Setters', () => {
  it('should generate slug from title', () => {
    const category = new CategoryModel();
    category.title = title;
    chai.expect(category.slug).to.equal('title-1');
  });
});

describe('Category Serialise', () => {
  it('should populate object properties and fields with constructor', () => {
    const category = {
      id,
      title,
      lvl,
      parent,
      slug,
      children
    };

    const h = hydrateObjects([category]);

    console.log("parent", h);
    console.log("children", h[0].children);
  });
});
