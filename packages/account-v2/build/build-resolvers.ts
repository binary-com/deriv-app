import path from 'path';
import { ResolveOptions } from 'webpack';

export const buildResolvers = (): ResolveOptions => ({
    alias: {
        src: path.resolve(__dirname, '../src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
