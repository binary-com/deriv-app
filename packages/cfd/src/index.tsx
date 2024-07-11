import React from 'react';
import { makeLazyLoader } from '@deriv-lib/shared';
import { Loading } from '@deriv-lib/components';

const App = makeLazyLoader(
    () => import(/* webpackChunkName: "cfd-app", webpackPreload: true */ './app'),
    () => <Loading />
)();

export default App;
