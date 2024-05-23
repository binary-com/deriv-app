import React from 'react';
import { TApiContext } from 'Types';

const ApiTokenContext = React.createContext<TApiContext>({
    api_tokens: [],
    deleteToken: () => Promise.resolve(),
});

export default ApiTokenContext;
