declare module '*.png';

declare module '*.svg' {
    const content: React.ComponentType<React.SVGAttributes<SVGElement>>;
    export default content;
}
