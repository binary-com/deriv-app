declare module '*.png';

declare module '*.svg' {
    const content: React.SVGAttributes<SVGElement>;
    export default content;
}

declare module '@deriv/components';
declare module '@deriv/shared';
declare module '@deriv/account';

declare module '@binary-com/binary-document-uploader';
