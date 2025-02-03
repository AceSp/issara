import { setContext } from '@apollo/client/link/context'
import { InMemoryCache } from '@apollo/client/cache';
import { 
  toIdValue,
  getMainDefinition
} from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import CookieManager from '@react-native-cookies/cookies';
import  { 
  ApolloClient,
  createHttpLink,
  ApolloLink,
  split,
}  from '@apollo/client';

import { 
  getAccessToken,
  storage
} from './store';

// export const HOST = `10.0.2.2`;
// export const HOST = `192.168.1.33`;

export const HOST = 'localhost';
// const HTTP_URL = `https://issara.app/api/`;
const HTTP_URL = `http://${HOST}:3000/dev/`;
// const WS_URL = "wss://wm4mpgo8q7.execute-api.ap-southeast-1.amazonaws.com/dev/";
const WS_URL = `ws://${HOST}:3001/`;
// export const VIDEO_URL = 'https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/';
export const VIDEO_URL = 'http://localhost:3004/';
// export const UPLOAD_URL = "https://services.issara.app/media/";
export const UPLOAD_URL = 'http://localhost:3004/';
// const REST_URL = `http://${HOST}:3000/dev/rest/`
// const REST_URL = `https://${API_GATEWAY}/rest/`;

const wsClient = new SubscriptionClient(
  WS_URL, { 
    reconnect: true,
  }
);
  
  // const wsLink = new WebSocketLink({
  //   uri: `ws://${HOST}:3001`,
  //   options: {
  //     reconnect: true,
  //     connectionParams: async () => {
  //       const token = getAccessToken();
  // console.log(token)
  // console.log("**********ws")
  //       return {
  //         authorization: token ? `Bearer ${token}` : ''
  //       }
  //     }
  //   }
  // });
  
  wsClient.use([
    {
      applyMiddleware(operationOptions, next) {
        operationOptions['authorization'] = "Bearer " + getAccessToken();
        next();
      }
    }
  ]);

  const httplink = createHttpLink({
    uri: HTTP_URL,
    credentials: "same-origin"
  });
  
  const authLink = setContext(async(req, { headers }) => {
    const token = getAccessToken();
    return {
      ...headers,
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  });
  
  const errorlink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map((res) =>
        console.log(`[GraphQL error]: Message: ${res.message}, Location: ${res.locations}, Path: ${res.path}`,
        console.log('-------------errorLink--------------'),
        console.log(res.path)
        ),
      );
  
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });
  
  //const linkConcated = authLink.concat(httpLink, errorlink);
  
  const linkConcated = ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: async () => {
        const token = getAccessToken();
  
        if(!token) return true;
  
        try {
          const { exp } = jwtDecode(token);
          if(Date.now() >= exp * 1000) return false;
          else return true;
        } catch (err) {
          return false;
        };
      },
      fetchAccessToken: async () => {
        const [res1, cookies] = await Promise.all([
          CookieManager.clearAll(), 
          storage.getString(REFRESH_TOKEN)
        ]);
        return fetch(`${HTTP_URL}/refresh_token`, { 
              method: "POST",
              credentials: "same-origin",
              headers: {
                "cookie": `rt=${cookies}`
              }
            });  
      },
      handleFetch: accessToken => {
        setAccessToken(accessToken);
      },
      handleError: err => {
          // full control over handling token fetch Error
          console.warn('Your refresh token is invalid. Try to relogin');
          console.error(err);
  
          // your custom action here
      }
    }),
    authLink,
    errorlink,
    httplink
  ]);
  
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsClient,
    linkConcated,
  );
  
  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        getProducts: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'PreviewProduct', id })),
        getProduct: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Product', id })),
        getPosts: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Post', id })),
        getGroupPosts: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Post', id })),
        getNewsPosts: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Post', id })),
        getPost: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Post', id })),
      },
    },
  });
  
  export const client = new ApolloClient({
    link,
    cache
  });

  export {
    // HOST,
    HTTP_URL,
    WS_URL,
  }