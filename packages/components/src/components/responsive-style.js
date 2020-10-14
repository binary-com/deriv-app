import { css } from 'styled-components';
import { Margins, Paddings } from './function';

export const size = {
    mobileS: 320,
    mobileM: 375,
    mobileL: 425,
    tabletS: 576,
    tablet: 768,
    tabletL: 992,
    laptop: 1024,
    laptopM: 1200,
    laptopL: 1440,
    desktopS: 1680,
    desktop: 1980,
};
export const mediaqueries = Object.keys(size)
    .sort(function(a, b) {
        return size[b] - size[a];
    })
    .reduce((accumulator, label) => {
        accumulator[label] = (...args) => css`
            @media (max-width: ${size[label]}px) {
                ${css(...args)};
            }
        `;
        return accumulator;
    }, {});

export const generateResponsiveStyles = stylesGenerator => props => {
    return Object.keys(mediaqueries).reduce((rules, mq) => {
        if (!props[mq]) return rules;
        const styles = mediaqueries[mq]`        
        ${stylesGenerator(props[mq])}
        `;
        return [...rules, styles];
    }, []);
};

export const baseStyles = ({
    margin,
    margin_top,
    margin_left,
    margin_right,
    margin_bottom,
    padding,
    padding_top,
    padding_left,
    padding_right,
    padding_bottom,
    width,
    max_width,
    min_width,
    height,
    max_height,
    min_height,
    color,
    text_align,
}) => css`
    width: ${width};
    max-width: ${max_width};
    min-width: ${min_width};
    height: ${height};
    max_height: ${max_height};
    min_height: ${min_height};
    color: ${color};
    text-align: ${text_align};
    ${Margins({ margin, margin_top, margin_left, margin_right, margin_bottom })}
    ${Paddings({ padding, padding_top, padding_left, padding_right, padding_bottom })}
`;

export const responsiveStyles = generateResponsiveStyles(baseStyles);
