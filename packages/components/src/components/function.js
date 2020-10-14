import { css } from 'styled-components';

export const Margins = ({ margin, margin_top, margin_left, margin_right, margin_bottom }) => css`
    margin: ${margin || null};
    margin-top: ${margin_top || null};
    margin-right: ${margin_right || null};
    margin-bottom: ${margin_bottom || null};
    margin-left: ${margin_left || null};
`;

export const Paddings = ({ padding, padding_top, padding_left, padding_right, padding_bottom }) => css`
    padding: ${padding || null};
    padding-top: ${padding_top || null};
    padding-bottom: ${padding_bottom || null};
    padding-right: ${padding_right || null};
    padding-left: ${padding_left || null};
`;
