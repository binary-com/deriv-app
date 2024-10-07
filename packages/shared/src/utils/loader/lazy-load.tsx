import React from 'react';
import Loadable from 'react-loadable';

export const makeLazyLoader =
    (importFn: () => Promise<unknown>, loaderFn: () => JSX.Element) => (component_name?: string) =>
        Loadable.Map({
            loader: {
                ComponentModule: importFn,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render(loaded: { [key: string]: any }, props: object) {
                const ComponentLazy = component_name
                    ? loaded.ComponentModule.default[component_name]
                    : loaded.ComponentModule.default;
                return <ComponentLazy {...props} />;
            },
            loading: loaderFn,
        });
