import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getCategory = categoryId => categoriesFromServer
  .find(category => (category.id === categoryId))
  || null;

const getProductOwner = ownerId => usersFromServer
  .find(user => user.id === ownerId)
  || null;

const setCategory = productsFromServer.map(product => ({
  ...product,
  category: getCategory(product.categoryId),
}));

const products = setCategory.map(product => ({
  ...product,
  owner: getProductOwner(product.category.ownerId),
}));

function getPreparedProducts(
  productsCard,
  { filterByOwner },
  { filterField },
  { sortField },
  { isReversed },
) {
  let preparedProducts = [...productsCard];

  if (filterByOwner) {
    preparedProducts = preparedProducts.filter(product => (
      product.owner.name === filterByOwner));
  }

  if (filterField) {
    preparedProducts = preparedProducts.filter(product => (
      product.name.toLowerCase().includes(filterField.trim().toLowerCase())
    ));
  }

  if (sortField) {
    preparedProducts.sort((product1, product2) => {
      switch (sortField) {
        case 'product':
          return product2.name.localeCompare(product1.name);

        case 'id':
          return product2.id - product1.id;

        case 'category':
          return product2.category.title.localeCompare(product1.category.title);

        case 'user':
          return product2.owner.name.localeCompare(product1.owner.name);

        default:
          return 0;
      }
    });
  }

  if (isReversed % 2) {
    preparedProducts.reverse();
  }

  return preparedProducts;
}

export const App = () => {
  const [filterByOwner, setFilterByOwner] = useState('');
  const [filterField, setFilterField] = useState('');
  const [sortField, setSortField] = useState('');
  const [isReversed, setIsReversed] = useState(0);

  const visibleProducts = getPreparedProducts(
    products,
    { filterByOwner },
    { filterField },
    { sortField },
    { isReversed },
  );

  const reset = () => {
    setFilterByOwner('');
    setFilterField('');
    setSortField('');
    setIsReversed(0);
  };

  const reverseProd = () => {
    setIsReversed(reversed => reversed + 1);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setFilterByOwner('')}
                className={filterByOwner === ''
                  ? 'is-active'
                  : ''
                }
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setFilterByOwner(user.name)}
                  key={user.id}
                  className={filterByOwner === user.name
                    ? 'is-active'
                    : ''
                  }
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterField}
                  onChange={(event) => {
                    setFilterField(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterField !== ''
                  ? (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setFilterField('')}
                      />
                    </span>
                  )
                  : ''
                }
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length < 1
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a
                          href="#/"
                          onClick={() => {
                            setSortField('id');
                            reverseProd();
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={isReversed % 2 === 0
                                ? 'fas fa-sort-up'
                                : 'fas fa-sort-down'
                              }
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a
                          href="#/"
                          onClick={() => {
                            setSortField('product');
                            reverseProd();
                          }}
                        >
                          <span className="icon">
                            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                            <i
                              data-cy="SortIcon"
                              className={isReversed % 2 === 0
                                ? 'fas fa-sort-up'
                                : 'fas fa-sort-down'
                              }
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a
                          href="#/"
                          onClick={() => {
                            setSortField('category');
                            reverseProd();
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={isReversed % 2 === 0
                                ? 'fas fa-sort-up'
                                : 'fas fa-sort-down'
                              }
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a
                          href="#/"
                          onClick={() => {
                            setSortField('user');
                            reverseProd();
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={isReversed % 2 === 0
                                ? 'fas fa-sort-up'
                                : 'fas fa-sort-down'
                              }
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map(product => (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        <span>{product.category.icon}</span>
                        -
                        {product.category.title}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={product.owner.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                        }
                      >
                        {product.owner.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
