/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.home || initialState;

const makeSelectUsername = () =>
  createSelector(
    selectHome,
    homeState => homeState.username,
  );

const makeSelectAddress = () =>
  createSelector(
    selectHome,
    homeState => homeState.address,
  );

export { selectHome, makeSelectUsername, makeSelectAddress };
