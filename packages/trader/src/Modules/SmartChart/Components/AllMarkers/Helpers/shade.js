import { getHexOpacity } from './colors';

export const drawShade = (ctx, start, exit, color) => {
    const is_bottom_shade = start.top < exit.top;
    const shade_height = 120;
    const transparent = 'rgba(255,255,255,0)';

    const color_with_opacity = `${color}${getHexOpacity(16)}`;
    const shade_left_point = start.left;

    const top = is_bottom_shade ? start.top : Math.max(start.top - shade_height, 0);
    const bottom = is_bottom_shade ? shade_height : start.top - top;
    const gradient = ctx.createLinearGradient(shade_left_point, top, shade_left_point, top + shade_height);

    gradient.addColorStop(0, is_bottom_shade ? color_with_opacity : transparent);
    gradient.addColorStop(1, is_bottom_shade ? transparent : color_with_opacity);
    ctx.fillStyle = gradient;
    ctx.fillRect(shade_left_point, top, exit.left - shade_left_point, bottom);
};
