// Things to do before touching this file :P
// 1- Please read https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
// 2- Please read RawMarker.jsx in https://github.com/binary-com/SmartCharts
// 3- Please read contract-store.js & trade.jsx carefully
import React         from 'react';
import CurrencyUtils from 'deriv-shared/utils/currency';
import { RawMarker } from 'Modules/SmartChart';
import * as ICONS    from './icons';

const is_firefox = (navigator.userAgent.search('Firefox') > 0);

const RawMarkerMaker = (draw_callback) => {
    const Marker = ({ epoch_array, price_array, ...rest }) => (
        <RawMarker
            epoch_array={epoch_array}
            price_array={price_array}
            draw_callback={args => draw_callback({ ...args, ...rest })}
        />
    );
    return Marker;
};

function get_color({ status, profit, is_dark_theme }) {
    const colors = is_dark_theme ? {
        open: '#377cfc',
        won : '#00a79e',
        lost: '#cc2e3d',
        sold: '#ffad3a',
        fg  : '#ffffff',
        bg  : '#0e0e0e',
    } : {
        open: '#377cfc',
        won : '#4bb4b3',
        lost: '#ec3f3f',
        sold: '#ffad3a',
        fg  : '#333333',
        bg  : '#ffffff',
    };
    let color = colors[status || 'open'];
    if (status === 'open' && profit) {
        color = colors[profit > 0 ? 'won' : 'lost'];
    }
    return color;
}

const calc_scale = (zoom) => {
    return zoom ? Math.max(Math.min(Math.sqrt(zoom / 18), 1.2),  0.8) : 1;
};

const hex_map = [];
const calc_opacity = (from, to) => {
    if (hex_map.length === 0) {
        for (let i = 255; i >= 0; --i) {
            hex_map[i] = (i < 16 ? '0' : '') + i.toString(16);
        }
    }
    const opacity = Math.floor(
        Math.min(
            Math.max(to - from - 10, 0) / 6,
            1
        ) * 255
    );
    return hex_map[opacity];
};

/** @param {CanvasRenderingContext2D} ctx */
const draw_path = (ctx, { zoom, top, left, icon }) => {
    ctx.save();
    const scale = calc_scale(zoom);

    ctx.translate(
        left - icon.width * scale / 2,
        top - icon.height * scale / 2 ,
    );

    ctx.scale(scale, scale);

    icon.paths.forEach(({ points, fill, stroke }) => {
        if (fill) { ctx.fillStyle = fill; }
        if (stroke) { ctx.strokeStyle = stroke; }
        ctx.beginPath();
        let prev_x, prev_y;
        for (let idx = 0; idx < points.length; idx++) {
            let x, y, cx1, cx2, cy1, cy2, r;
            if (points[idx] === 'M') {
                x = points[++idx];
                y = points[++idx];
                ctx.moveTo(x, y);
            } else if (points[idx] === 'L') {
                x = points[++idx];
                y = points[++idx];
                ctx.lineTo(x, y);
            } else if (points[idx] === 'V') {
                y = points[++idx];
                ctx.lineTo(prev_x, y);
            } else if (points[idx] === 'H') {
                x = points[++idx];
                ctx.lineTo(x, prev_y);
            } else if (points[idx] === 'Q') {
                cx1 = points[++idx];
                cy1 = points[++idx];
                x = points[++idx];
                y = points[++idx];
                ctx.quadraticCurveTo(cx1, cy1, x, y);
            } else if (points[idx] === 'C') {
                cx1 = points[++idx];
                cy1 = points[++idx];
                cx2 = points[++idx];
                cy2 = points[++idx];
                x = points[++idx];
                y = points[++idx];
                ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
            } else if (points[idx] === 'A') {
                x = points[++idx];
                y = points[++idx];
                r = points[++idx];
                const start_a = points[++idx];
                const end_a = points[++idx];
                ctx.arc(x, y, r, start_a, end_a);
            }
            prev_x = x;
            prev_y = y;
        }
        ctx.closePath();
        if (fill) { ctx.fill(); }
        if (stroke) { ctx.stroke(); }
    });
    ctx.scale(1, 1);
    ctx.restore();
};
/**
    label {
        icon: icon,
        text: ['list'],
    }
 */
const render_label = ({
    ctx,
    text,
    tick: {
        zoom,
        left,
        top,
    },
    icon,
}) => {
    const scale = calc_scale(zoom);
    const font_size = Math.floor(scale * 3 + 5);

    if (icon) {
        draw_path(ctx, {
            left: left - 5 - icon.width,
            top : top - 15,
            zoom,
            icon,
        });
    }

    ctx.font = `${font_size}px Roboto`;
    text.split(/\n/).forEach((line, idx) => {
        const text_width = Math.ceil(ctx.measureText(line).width);
        ctx.fillText(
            line,
            left - 5 - text_width ,
            top + idx * font_size + 1);
    });
};

const shadowed_text = ({ ctx, is_dark_theme, text, left, top, scale }) => {
    ctx.textAlign = 'center';
    const size = Math.floor(scale * 12);
    ctx.font = `bold ${size}px BinarySymbols, Roboto`;
    if (!is_firefox) {
        ctx.shadowColor = is_dark_theme ? 'rgba(16,19,31,1)' : 'rgba(255,255,255,1)';
        ctx.shadowBlur = 12;
    }
    // fillText once in firefox due to disabling of text shadows, for default cases where its enabled, set to 5 (to add blur intensity)
    for (let i = 0; i < (is_firefox ? 1 : 5); ++i) {
        ctx.fillText(
            text,
            left,
            top,
        );
    }
};

const drawTickBarrier = ({
    start,
    entry,
    exit,
    barrier,
    ctx,
    color,
    opacity,
}) => {
    if (start.visible || entry.visible || exit.visible) {
        // First arc
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(start.left, barrier, 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = color + opacity;
        ctx.beginPath();
        ctx.setLineDash([1, 1]);
        ctx.moveTo(start.left, barrier);
        ctx.lineTo(entry.left, barrier);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([1, 1]);
        ctx.moveTo(entry.left, barrier);
        ctx.lineTo(exit.left, barrier);
        ctx.stroke();
        ctx.strokeStyle = color;

        // Second arc
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(exit.left, barrier, 2, 0, Math.PI * 2);
        ctx.stroke();
    }
};

const TickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, reset_time, ...ticks],
    prices: [barrier, entry_tick_top], // TODO: support two barrier contracts
    is_last_contract,
    is_dark_theme,
    granularity,
    contract_info: {
        // contract_type,
        // exit_tick_time,
        status,
        profit,
        is_sold,
        is_expired,
        // tick_stream,
        tick_count,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({
        is_dark_theme,
        status,
        profit: is_sold ? profit : null,
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const scale = calc_scale(start.zoom);

    const canvas_height = (ctx.canvas.height / window.devicePixelRatio);
    if (barrier) {
        barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
    }
    if (draw_start_line) {
        render_label({
            ctx,
            text: 'Buy\nTime',
            tick: { zom: start.zoom, left: start.left - 1 * scale,  top: canvas_height - 50 },
            icon: ICONS.BUY_SELL_TIME,
        });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left - 1 * scale, 0);
        ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }

    const has_reset_time = reset_time && reset_time.epoch;
    if (has_reset_time && !is_sold) {
        render_label({
            ctx,
            text: 'Reset\nTime',
            tick: { zom: reset_time.zoom, left: reset_time.left - 1 * scale,  top: canvas_height - 50 },
            icon: ICONS.RESET,
        });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(reset_time.left - 1 * scale, 0);
        ctx.lineTo(reset_time.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }

    if (!ticks.length || !barrier) {
        ctx.restore();
        return;
    }
    const entry = ticks[0];
    const exit = ticks[ticks.length - 1];
    const opacity = is_sold ? calc_opacity(start.left, exit.left) : '';

    // barrier line
    drawTickBarrier({
        start,
        entry  : ticks[0],
        exit   : has_reset_time ? reset_time : exit,
        ctx,
        barrier: has_reset_time ? entry_tick_top : barrier,
        opacity,
        color,
    });

    if (has_reset_time) {
        ctx.beginPath();
        ctx.setLineDash([1, 1]);
        ctx.moveTo(reset_time.left, entry_tick_top);
        ctx.lineTo(reset_time.left, barrier);
        ctx.stroke();

        drawTickBarrier({
            start: reset_time,
            entry: reset_time,
            exit,
            ctx,
            barrier,
            opacity,
            color,
        });
    }

    // ticks for last contract
    if (is_last_contract && granularity === 0 && !is_sold) {
        ticks
            .filter(tick => tick.visible)
            .forEach(tick => {
                const clr = tick === exit ? color
                    : get_color({ status: 'fg', is_dark_theme });
                ctx.fillStyle = clr + opacity;
                ctx.beginPath();
                ctx.arc(tick.left - 1 * scale, tick.top, 1.5 * scale, 0, Math.PI * 2);
                ctx.fill();
            });
        ctx.fillStyle = color;
    }
    // entry & expiry markers
    if (granularity === 0) {
        [entry, is_expired ? exit : null].forEach(tick => {
            if (tick && tick.visible) {
                // Draw a line from barrier to icon.
                if (tick === exit) {
                    ctx.beginPath();
                    ctx.setLineDash([1, 1]);
                    ctx.moveTo(tick.left, tick.top);
                    ctx.lineTo(tick.left, barrier);
                    ctx.stroke();
                }

                const icon = tick === entry ? ICONS.ENTRY_SPOT : ICONS.END;
                draw_path(ctx, {
                    width : 16,
                    height: 16,
                    top   : tick.top,
                    left  : tick.left - 1,
                    zoom  : tick.zoom,
                    icon  : icon.with_color(
                        color + (is_sold ? opacity : ''),
                        get_color({ status: 'bg', is_dark_theme }) + (is_sold ? opacity : '')
                    ),
                });
            }
        });
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
    }
    // count down
    if (start.visible && !is_sold) {
        shadowed_text({
            ctx,
            scale,
            is_dark_theme,
            text: `${ticks.length - 1}/${tick_count}`,
            left: start.left,
            top : barrier - 27 * scale,
        });
    }
    // start-time marker
    if (start.visible) {
        // Draw dot at end of barrier
        ctx.beginPath();
        ctx.arc(start.left - 1 * scale, barrier.top - 9 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
    }
    // status marker
    if (exit.visible && is_sold) {
        ctx.beginPath();
        ctx.moveTo(exit.left - 1 * scale, 0);
        ctx.lineTo(exit.left - 1 * scale, barrier.top - 9 * scale);
        ctx.stroke();
    }
    ctx.restore();
});

const currency_symbols = {
    AUD: '\u0041\u0024',
    EUR: '\u20AC',
    GBP: '\u00A3',
    JPY: '\u00A5',
    USD: '\u0024',
    BTC: '\u0042',
    BCH: '\ue901',
    ETH: '\u0045',
    ETC: '\ue900',
    LTC: '\u004c',
    UST: '\ue903',
};

const NonTickContract = RawMarkerMaker(({
    ctx: context,
    points: [start, expiry, entry, exit],
    is_last_contract,
    prices: [barrier, entry_tick_top, exit_tick_top], // TODO: support two barrier contracts
    is_dark_theme,
    granularity,
    currency,
    contract_info: {
        // contract_type,
        // exit_tick_time,
        // is_expired,
        is_sold,
        status,
        profit,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    // the y value reported for candles is not accurate
    if (granularity !== 0) {
        if (entry) { entry.top = entry_tick_top; }
        if (exit) { exit.top = exit_tick_top; }
    }

    const color = get_color({ status, profit, is_dark_theme });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const show_profit = is_last_contract && !is_sold && profit && start.visible && barrier;
    const scale = calc_scale(start.zoom);
    const opacity = is_sold ? calc_opacity(start.left, expiry.left) : '';

    const canvas_height = (ctx.canvas.height / window.devicePixelRatio);
    if (barrier) {
        barrier = Math.min(Math.max(barrier, 2), canvas_height - 32); // eslint-disable-line
    }

    if (draw_start_line) {
        render_label({
            ctx,
            text: 'Start\nTime',
            tick: {
                zom : start.zoom,
                left: start.left - 1 * scale,
                top : canvas_height - 50,
            },
            icon: ICONS.BUY_SELL_TIME,
        });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left - 1 * scale, 0);
        if (barrier) {
            ctx.lineTo(start.left - 1 * scale, barrier - (show_profit ? 38 : 20) * scale);
            ctx.moveTo(start.left - 1 * scale, barrier + 4 * scale);
        }
        ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }
    // barrier line
    if ((barrier && entry) && (
        start.visible
        || expiry.visible
        || Math.sign(start.left) !== Math.sign(expiry.left)
    )) {
        ctx.strokeStyle = color + opacity;
        ctx.beginPath();
        ctx.setLineDash([1, 1]);
        ctx.moveTo(start.left, barrier);
        ctx.lineTo(entry.left, barrier);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(entry.left, barrier);
        ctx.lineTo(expiry.left, barrier);
        ctx.stroke();
        ctx.strokeStyle = color;
    }

    // entry & expiry tick markers
    [entry, exit].forEach(tick => {
        if (tick && tick.visible) {
            ctx.strokeStyle = color + opacity;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(tick.left - 1 * scale, tick.top);
            ctx.lineTo(tick.left - 1 * scale, barrier);
            ctx.stroke();

            ctx.fillStyle = color + opacity;
            ctx.beginPath();
            ctx.arc(tick.left - 1 * scale, tick.top, 3 * scale, 0, Math.PI * 2);
            ctx.fill();

            if (tick === entry) {
                ctx.beginPath();
                ctx.fillStyle = get_color({ status: 'bg', is_dark_theme }) + opacity;
                ctx.arc(tick.left - 1 * scale, tick.top, 2 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
        }
    });

    // start-time marker
    if (start.visible && barrier) {
        draw_path(ctx, {
            top : barrier - 9 * scale,
            left: start.left - 1 * scale,
            zoom: start.zoom,
            icon: ICONS.START.with_color(color + opacity),
        });
    }
    // show the profit
    if (show_profit) {
        const symbol = currency_symbols[currency] || '';
        const decimal_places = CurrencyUtils.getDecimalPlaces(currency);
        const sign = profit < 0 ? '-' : profit > 0 ? '+' : ' '; // eslint-disable-line
        const text = `${sign}${symbol}${Math.abs(profit).toFixed(decimal_places)}`;
        shadowed_text({
            ctx,
            scale,
            text,
            is_dark_theme,
            left: start.left,
            top : barrier - 28 * scale,
        });
    }
    // status marker
    if (expiry.visible) {
        draw_path(ctx, {
            top : barrier - 9 * scale,
            left: expiry.left + 8 * scale,
            zoom: expiry.zoom,
            icon: ICONS.END.with_color(color, get_color({ status: 'bg', is_dark_theme })),
        });
    }
    ctx.restore();
});

const DigitContract = RawMarkerMaker(({
    ctx: context,
    points: [start, ...ticks],
    prices: [entry_tick_top, exit_tick_top],
    is_last_contract,
    is_dark_theme,
    granularity,
    contract_info: {
        // contract_type,
        status,
        profit,
        is_sold,
        // barrier,
        tick_stream,
        tick_count,
    },
}) => {
    /** @type {CanvasRenderingContext2D} */
    const ctx = context;

    const color = get_color({
        is_dark_theme,
        status,
        profit: is_sold ? profit : null,
    });

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    const draw_start_line = is_last_contract && start.visible && !is_sold;
    const scale = calc_scale(start.zoom);

    if (granularity !== 0 && start && entry_tick_top) { start.top = entry_tick_top; }
    if (draw_start_line) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(start.left - 1 * scale, 0);
        if (ticks.length) {
            ctx.lineTo(start.left - 1 * scale, start.top - 34 * scale);
            ctx.moveTo(start.left - 1 * scale, start.top + 4 * scale);
        }
        ctx.lineTo(start.left - 1 * scale, ctx.canvas.height);
        ctx.stroke();
    }

    if (!ticks.length) {
        ctx.restore();
        return;
    }
    const expiry = ticks[ticks.length - 1];
    const opacity = is_sold ? calc_opacity(start.left, expiry.left) : '';
    if (granularity !== 0 && expiry && exit_tick_top) { expiry.top = exit_tick_top; }

    // count down
    if (start.visible && start.top && !is_sold) {
        shadowed_text({
            ctx,
            scale,
            is_dark_theme,
            text: `${ticks.length}/${tick_count}`,
            left: start.left - 1 * scale,
            top : start.top - 27 * scale,
        });
    }
    // start-time marker
    if (start.visible && (granularity === 0 || !is_sold)) {
        draw_path(ctx, {
            top : start.top - 9 * scale,
            left: start.left - 1 * scale,
            zoom: start.zoom,
            icon: ICONS.START.with_color(color + opacity, get_color({ status: 'bg', is_dark_theme }) + opacity),
        });
    }
    // remaining ticks
    ticks.forEach((tick, idx) => {
        if (tick !== expiry) { return; }
        if (!tick.visible) { return; }
        if (granularity !== 0 && tick !== expiry) { return; }
        if (granularity !== 0 && tick === expiry && !is_sold) { return; }
        const clr = tick !== expiry ?
            get_color({ status: 'fg', is_dark_theme }) : color;
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(tick.left, tick.top, 7 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = is_sold ? color : get_color({ status: 'bg', is_dark_theme });
        ctx.arc(tick.left, tick.top, 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        const last_tick = tick_stream[idx];
        const last_digit = last_tick.tick_display_value.slice(-1);
        ctx.fillStyle = is_sold ? 'white' : clr;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 0;
        ctx.font = `bold ${12 * scale}px BinarySymbols, Roboto`;
        ctx.fillText(last_digit, tick.left, tick.top);
    });
    // status marker
    if (expiry.visible && is_sold) {
        ctx.fillStyle = color;
        draw_path(ctx, {
            top : expiry.top - 16 * scale,
            left: expiry.left + 8 * scale,
            zoom: expiry.zoom,
            icon: ICONS.END.with_color(color, get_color({ status: 'bg', is_dark_theme })),
        });
    }
    ctx.restore();
});

export default {
    TickContract,
    NonTickContract,
    DigitContract,
};
