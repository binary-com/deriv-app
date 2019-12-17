// THIS FILE CONTAINS THE ICONS RENDERED IN CANVAS2D CONTEXT.

// All path commands *MUST* be absolute (MCLVQZ).
// Use figma.com which by default exports paths as absolute.
// Only <path /> tags is supported.
const parse_svg = (markup) => {
    // make tests pass
    if (!window.DOMParser) { return null; }

    const parser = new window.DOMParser();
    const svg = parser.parseFromString(markup, 'image/svg+xml').children[0];
    let { width, height } = svg.attributes;
    width = width.value * 1;
    height = height.value * 1;

    const paths = [];
    [].forEach.call(svg.children, p => {
        const { d, fill, stroke } = p.attributes;
        paths.push({
            points: d.value.match(/M|C|H|A|L|V|-?\d*(\.\d+)?/g)
                .filter(e => e)
                .map(e => 'MCHALV'.indexOf(e) === -1 ? e * 1 : e),
            fill  : fill && fill.value,
            stroke: stroke && stroke.value,
        });
    });
    function with_color(color, bg_color = 'white') {
        return {
            width,
            height,
            paths: paths
                .map(({ points, fill, stroke }) => ({
                    points,
                    stroke,
                    fill: fill !== 'white' ? color : bg_color,
                })),
        };
    }

    return {
        width,
        height,
        paths,
        with_color,
    };
};

export const START = parse_svg(`
<svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7,20 C11.2,14.4 14,10.8659932 14,7 C14,3.13400675 10.8659932,0 7,0 C3.13400675,0 0,3.13400675 0,7 C0,10.8659932 2.8,14.4 7,20 Z" fill="#333333"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="A7 7 4.2 0 6.283185307179586" fill="white" />
</svg>`); // Old gps icon

export const BUY_SELL_TIME = parse_svg(`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="white"/>
    <path d="M8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0V0ZM8 1.143C6.18141 1.143 4.43731 1.86543 3.15137 3.15137C1.86543 4.43731 1.143 6.18141 1.143 8C1.143 9.81859 1.86543 11.5627 3.15137 12.8486C4.43731 14.1346 6.18141 14.857 8 14.857C9.81859 14.857 11.5627 14.1346 12.8486 12.8486C14.1346 11.5627 14.857 9.81859 14.857 8C14.857 6.18141 14.1346 4.43731 12.8486 3.15137C11.5627 1.86543 9.81859 1.143 8 1.143V1.143ZM6.5 2.5H9.5C9.62495 2.49977 9.74545 2.54633 9.83778 2.63051C9.93012 2.71469 9.98759 2.83039 9.99888 2.95482C10.0102 3.07926 9.97446 3.20341 9.89878 3.30283C9.8231 3.40225 9.71295 3.46974 9.59 3.492L9.5 3.5H8.5V4.528C9.64301 4.65579 10.6937 5.21639 11.4363 6.09465C12.1789 6.97291 12.557 8.10218 12.493 9.25052C12.429 10.3989 11.9278 11.4791 11.0922 12.2694C10.2566 13.0598 9.15013 13.5001 8 13.5001C6.84987 13.5001 5.7434 13.0598 4.90781 12.2694C4.07223 11.4791 3.57097 10.3989 3.50697 9.25052C3.44298 8.10218 3.82111 6.97291 4.5637 6.09465C5.3063 5.21639 6.35699 4.65579 7.5 4.528V3.5H6.5C6.38297 3.50004 6.26964 3.45903 6.17974 3.38411C6.08984 3.30919 6.02906 3.20511 6.008 3.09L6 3C5.99996 2.88297 6.04097 2.76964 6.11589 2.67974C6.19081 2.58984 6.29489 2.52906 6.41 2.508L6.5 2.5H9.5H6.5ZM8 5.5C7.54037 5.5 7.08525 5.59053 6.66061 5.76642C6.23597 5.94231 5.85013 6.20012 5.52513 6.52513C5.20012 6.85013 4.94231 7.23597 4.76642 7.66061C4.59053 8.08525 4.5 8.54037 4.5 9C4.5 9.45963 4.59053 9.91475 4.76642 10.3394C4.94231 10.764 5.20012 11.1499 5.52513 11.4749C5.85013 11.7999 6.23597 12.0577 6.66061 12.2336C7.08525 12.4095 7.54037 12.5 8 12.5C8.92826 12.5 9.8185 12.1313 10.4749 11.4749C11.1313 10.8185 11.5 9.92826 11.5 9C11.5 8.07174 11.1313 7.1815 10.4749 6.52513C9.8185 5.86875 8.92826 5.5 8 5.5V5.5ZM9.95 7.149C10.0322 7.23223 10.0827 7.34165 10.0925 7.45822C10.1024 7.5748 10.0711 7.69114 10.004 7.787L9.946 7.856L8.35 9.429C8.26101 9.51596 8.1428 9.56661 8.01846 9.57107C7.89412 9.57552 7.77259 9.53346 7.67761 9.4531C7.58262 9.37274 7.52101 9.25985 7.50481 9.13649C7.48861 9.01313 7.51899 8.88816 7.59 8.786L7.648 8.717L9.242 7.144C9.33642 7.05092 9.46395 6.99916 9.59654 7.0001C9.72912 7.00104 9.8559 7.0546 9.949 7.149H9.95Z" fill="#333333"/>
</svg>
`);

export const RESET = parse_svg(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4ZM12 5.143C10.1814 5.143 8.43731 5.86543 7.15137 7.15137C5.86543 8.43731 5.143 10.1814 5.143 12C5.143 13.8186 5.86543 15.5627 7.15137 16.8486C8.43731 18.1346 10.1814 18.857 12 18.857C13.8186 18.857 15.5627 18.1346 16.8486 16.8486C18.1346 15.5627 18.857 13.8186 18.857 12C18.857 10.1814 18.1346 8.43731 16.8486 7.15137C15.5627 5.86543 13.8186 5.143 12 5.143ZM9 11.5C9.13261 11.5 9.25979 11.5527 9.35355 11.6464C9.44732 11.7402 9.5 11.8674 9.5 12C9.49981 12.4644 9.62897 12.9196 9.87298 13.3147C10.117 13.7098 10.4662 14.0291 10.8815 14.2368C11.2968 14.4446 11.7618 14.5326 12.2243 14.4909C12.6868 14.4493 13.1285 14.2796 13.5 14.001L12.5 14C12.3751 14.0002 12.2545 13.9537 12.1622 13.8695C12.0699 13.7853 12.0124 13.6696 12.0011 13.5452C11.9898 13.4207 12.0255 13.2966 12.1012 13.1972C12.1769 13.0977 12.2871 13.0303 12.41 13.008L12.5 13H14.5C14.617 13 14.7304 13.041 14.8203 13.1159C14.9102 13.1908 14.9709 13.2949 14.992 13.41L15 13.5V15.5C15.0002 15.6249 14.9537 15.7455 14.8695 15.8378C14.7853 15.9301 14.6696 15.9876 14.5452 15.9989C14.4207 16.0102 14.2966 15.9745 14.1972 15.8988C14.0977 15.8231 14.0303 15.7129 14.008 15.59L14 15.5V14.872C13.4752 15.2374 12.8603 15.4521 12.2221 15.4927C11.5839 15.5332 10.9468 15.3982 10.3799 15.1022C9.81308 14.8062 9.33815 14.3605 9.00673 13.8136C8.6753 13.2667 8.50005 12.6395 8.5 12C8.5 11.8674 8.55268 11.7402 8.64645 11.6464C8.74021 11.5527 8.86739 11.5 9 11.5ZM9.5 8C9.61703 7.99996 9.73036 8.04097 9.82026 8.11589C9.91016 8.19081 9.97093 8.29489 9.992 8.41L10 8.5V9.127C10.5249 8.76153 11.1398 8.54686 11.7781 8.50632C12.4164 8.46578 13.0536 8.60091 13.6205 8.89703C14.1874 9.19315 14.6623 9.63895 14.9937 10.186C15.325 10.733 15.5001 11.3604 15.5 12C15.5 12.1326 15.4473 12.2598 15.3536 12.3536C15.2598 12.4473 15.1326 12.5 15 12.5C14.8674 12.5 14.7402 12.4473 14.6464 12.3536C14.5527 12.2598 14.5 12.1326 14.5 12C14.5 11.5357 14.3707 11.0806 14.1266 10.6857C13.8825 10.2907 13.5333 9.97156 13.118 9.76393C12.7028 9.5563 12.2379 9.46841 11.7755 9.5101C11.3131 9.5518 10.8714 9.72143 10.5 10H11.5C11.6249 9.99977 11.7455 10.0463 11.8378 10.1305C11.9301 10.2147 11.9876 10.3304 11.9989 10.4548C12.0102 10.5793 11.9745 10.7034 11.8988 10.8028C11.8231 10.9023 11.7129 10.9697 11.59 10.992L11.5 11H9.5C9.38297 11 9.26964 10.959 9.17974 10.8841C9.08984 10.8092 9.02907 10.7051 9.008 10.59L9 10.5V8.5C9 8.36739 9.05268 8.24021 9.14645 8.14645C9.24021 8.05268 9.36739 8 9.5 8Z" fill="#C2C2C2"/>
</svg>
`);

export const ENTRY_SPOT = parse_svg(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4ZM12 5.143C10.268 5.1429 8.60006 5.79816 7.33127 6.97718C6.06247 8.15619 5.28678 9.77162 5.16 11.499H12.129L10.167 9.496C10.0724 9.39835 10.0142 9.27115 10.0021 9.1357C9.99013 9.00025 10.025 8.86478 10.101 8.752L10.167 8.671C10.2195 8.61693 10.2823 8.57395 10.3517 8.54459C10.4211 8.51524 10.4957 8.50011 10.571 8.50011C10.6463 8.50011 10.7209 8.51524 10.7903 8.54459C10.8597 8.57395 10.9225 8.61693 10.975 8.671L13.833 11.588C13.9407 11.698 14.0007 11.846 14 12L13.994 11.919C13.9964 11.9356 13.998 11.9523 13.999 11.969L14 12C14.0005 12.0275 13.9985 12.0549 13.994 12.082L13.99 12.094C13.9731 12.2141 13.918 12.3256 13.833 12.412L10.975 15.329C10.9225 15.3831 10.8597 15.4261 10.7903 15.4554C10.7209 15.4848 10.6463 15.4999 10.571 15.4999C10.4957 15.4999 10.4211 15.4848 10.3517 15.4554C10.2823 15.4261 10.2195 15.3831 10.167 15.329C10.0597 15.2185 9.99963 15.0705 9.99963 14.9165C9.99963 14.7625 10.0597 14.6145 10.167 14.504L12.131 12.499H5.161C5.25777 13.8307 5.74119 15.1053 6.55196 16.1662C7.36272 17.2271 8.46556 18.0283 9.72514 18.4714C10.9847 18.9145 12.3463 18.9802 13.6427 18.6606C14.9391 18.341 16.114 17.6498 17.0233 16.672C17.9325 15.6941 18.5365 14.4721 18.7612 13.1559C18.9859 11.8397 18.8214 10.4865 18.288 9.26244C17.7546 8.03835 16.8755 6.9966 15.7585 6.26501C14.6415 5.53342 13.3352 5.14381 12 5.144V5.143Z" fill="#C2C2C2"/>
</svg>
`);

export const END = parse_svg(`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4C13.0774 3.99996 14.1437 4.21753 15.1349 4.63966C16.1261 5.0618 17.0219 5.6798 17.7684 6.4566C18.5149 7.23339 19.0969 8.15298 19.4793 9.16019C19.8618 10.1674 20.0368 11.2415 19.994 12.318L20 12C20 12.3292 19.9799 12.6582 19.94 12.985L19.935 13.027C19.8483 13.6976 19.677 14.3545 19.425 14.982C19.3028 15.2864 19.1618 15.583 19.003 15.87C18.2728 17.1872 17.1872 18.2728 15.87 19.003L16.123 18.857C15.1681 19.4313 14.1036 19.7995 12.998 19.938C12.7494 19.969 12.4994 19.9884 12.249 19.996L12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12V11.999L4.004 11.751L4.006 11.679L4 12C4.00075 11.3379 4.08236 10.6783 4.243 10.036C4.41103 9.37079 4.66447 8.73013 4.997 8.13C5.6442 6.96199 6.57213 5.97357 7.697 5.254L7.877 5.143C7.963 5.091 8.047 5.043 8.13 4.997L7.877 5.143C8.34372 4.86198 8.83796 4.62944 9.352 4.449L9.382 4.439C10.2238 4.14674 11.1089 3.99833 12 4ZM12 15.429H8.572V17.719C9.60712 18.341 10.7924 18.6688 12 18.667V15.429ZM17.719 15.429H15.429V17.719C16.3681 17.1544 17.1544 16.3681 17.719 15.429ZM15.429 11.999H12V15.429H15.429V11.999ZM8.572 11.999L5.333 12C5.333 13.254 5.679 14.427 6.281 15.429H8.571V11.999H8.572ZM17.719 8.571H15.429V12H18.667C18.669 10.792 18.3412 9.60641 17.719 8.571ZM11.999 8.571H8.573V12H12V8.572L11.999 8.571ZM12.001 5.333V8.571H15.429V6.281C14.3936 5.65879 13.208 5.33101 12 5.333H12.001ZM6.281 8.571H8.571V6.281C7.63189 6.84559 6.84559 7.63189 6.281 8.571Z" fill="#00A79E"/>
</svg>
`);
