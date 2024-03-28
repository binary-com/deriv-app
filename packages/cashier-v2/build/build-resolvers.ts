import path from 'path';
import { ResolveOptions } from 'webpack';

export const buildResolvers = (): ResolveOptions => ({
    alias: {
        '@deriv-lib/account-v2-lib': path.resolve(__dirname, '../../account-v2/src/modules'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
