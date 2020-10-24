/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_REPOS, LOAD_PRESENTS } from 'containers/App/constants';
import {
  reposLoaded,
  repoLoadingError,
  presentsLoaded,
  presentLoadingError,
} from 'containers/App/actions';

import request from 'utils/request';
import {
  makeSelectUsername,
  makeSelectAddress,
} from 'containers/HomePage/selectors';

/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const username = yield select(makeSelectUsername());
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    yield put(reposLoaded(repos, username));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

export function* getPresents() {
  const address = yield select(makeSelectAddress());
  const requestURL = `${address}`;
  try {
    const presents = yield call(request, requestURL);
    yield put(presentsLoaded(presents, address));
  } catch (err) {
    yield put(presentLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* data() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_REPOS, getRepos);

  yield takeLatest(LOAD_PRESENTS, getPresents);
}
