import { isBot } from '@deriv/shared';

const is_bot = isBot();

export const MAX_MOBILE_WIDTH = is_bot ? 1023 : 767;
export const MAX_TABLET_WIDTH = 1024;
