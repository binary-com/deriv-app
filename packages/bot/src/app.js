import Bot               from './app.jsx';
import { preloadSprite } from './components/Icons.jsx';

const getUrlBase = (path = '') => {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
};

export function setBotPublicPath(path) {
    __webpack_public_path__ = path; // eslint-disable-line
}

setBotPublicPath(getUrlBase('/js/bot/'));
preloadSprite();

export default Bot;
