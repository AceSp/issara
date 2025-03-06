import React, {createContext, useReducer} from 'react';
import {MMKV} from 'react-native-mmkv';

const REFRESH_TOKEN = 'REFRESH_TOKEN';
const ME_DATA = 'ME_DATA';
const SHOW_COMMENT = 'SHOW_COMMENT';
const SHOW_POST = 'SHOW_POST';
const SHOW_NEWS = 'SHOW_NEWS';
const SHOW_CONTEST = 'SHOW_CONTEST';
const CATEGORY = 'CATEGORY';
const NEWS_CATEGORY = 'NEW_CATEGORY';
const CONTEST_CATEGORY = 'CONTEST_CATEGORY';
const SHOW_QUESTION = 'SHOW_QUESTION';

let refreshToken;
let accessToken = "";
let meData;
let showComment;
let showPost;
let showNews;
let showContest;
let category;
let newsCategory;
let contestCategory;
let showQuestion;

const initialState = {
  isLoading: true,
  isSignout: false,
  accessToken: null,
  me: null,
};
export const storage = new MMKV();
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            accessToken: action.token,
            me: action.me || prevState.me,
            isLoading: false,
        };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            accessToken: action.token,
            me: action.me || prevState.me,
        };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            accessToken: null,
            me: null,
        };
        case 'CHANGE_ME':
          return {
            ...prevState,
            me: action.me,
        };
        default:
          throw new Error("action not recognized");
      }
    }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }

export const setAccessToken = (str) => {
  accessToken = str;
};

export const getAccessToken = () => {
  return accessToken;
};

export const setShowCommentData = (showNewComment) => {
  showComment = showNewComment
  try {
    storage.set(SHOW_COMMENT, showNewComment);
  } catch (error) {
    throw error
  }
};

export const getShowCommentData = () => {
  if (showComment) {
    return Promise.resolve(showComment);
  }

  try {
    const showData = storage.getBoolean(SHOW_COMMENT);
    return showData;
  } catch (error) {
    throw error
  }
};

export const setShowQuestion = (show) => {
  showQuestion = show
  try {
    storage.set(SHOW_QUESTION, show);
  } catch (error) {
    throw error
  }
};

export const getShowQuestion = () => {
  if (showQuestion) {
    return Promise.resolve(showQuestion);
  }

  try {
    const showData = storage.getBoolean(SHOW_QUESTION);
    return showData;
  } catch (error) {
    throw error
  }
};

export const getToken = () => {
  if (refreshToken) {
    return Promise.resolve(refreshToken);
  }

  try {
    refreshToken = storage.getString(REFRESH_TOKEN);
    return refreshToken;
  } catch (error) {
    throw error
  }
};

export const getMeData = () => {
  if (meData) {
    return meData;
  }

  try {
    const meData = storage.getString(ME_DATA);
    const meObject = JSON.parse(meData)
    return meObject;
  } catch (error) {
    throw error
  }
};


export const signIn = (newToken, newMeData) => {
  refreshToken = newToken;
  meData = newMeData;
  try {
    storage.set(ME_DATA, JSON.stringify(newMeData));
    storage.set(REFRESH_TOKEN, newToken);
  } catch (error) {
    throw error;
  }
};

export const signOut = () => {
  refreshToken = undefined;
  meData = undefined;
  storage.delete(ME_DATA);
  return 
};
