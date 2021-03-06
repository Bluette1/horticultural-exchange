import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import axios from 'axios';
import history from '../helpers/history';
import CategoryForm from '../components/CategoryForm';

import configureTestStore from '../testutils/ConfigureStore';
import { httpProtocol, host, port } from '../env.variables';

const realLocation = window.location;
beforeEach(() => {
  delete window.location;
  window.location = { reload: jest.fn() };
  history.push = jest.fn();
  delete window.alert;
  window.alert = jest.fn();
});

afterEach(() => {
  window.location = realLocation;
  jest.clearAllMocks();
});

jest.mock('axios');
const store = configureTestStore();
const CategoryFormWithStore = () => (
  <Provider store={store}>
    <>
      <Router history={history}>
        <CategoryForm history={history} />
      </Router>
    </>
  </Provider>
);
test('renders the CategoryForm and functions correctly', async () => {
  axios.post.mockImplementation((url) => {
    switch (url) {
      case `${httpProtocol}://${host}:${port}/api/categories`:
        return Promise.resolve({ data: {}, status: 201 });
      default:
        return Promise.resolve({ data: {} });
    }
  });
  render(<CategoryFormWithStore />);
  await waitFor(() => {
    const categoryFormContainer = screen.getByTestId('categoryform-container');
    const input = categoryFormContainer.querySelector('.form-control');
    input.value = 'Some New Category';
    ReactTestUtils.Simulate.change(input);
    fireEvent.click(screen.getByTestId('submit-btn'));
    const historySpy = history.push;
    expect(historySpy).toHaveBeenCalled();
    expect(historySpy).toHaveBeenCalledTimes(1);
    expect(historySpy).toHaveBeenCalledWith('/');
  });
});
