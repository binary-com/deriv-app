import clsx from 'clsx';
import React from 'react';

type TSkeletonProps = {
    animated?: boolean;
    className?: string;
    paragraph?: {
        gap?: string | number;
        rows: number;
        width?: string | number;
    };
    variant?: typeof VARIANT[keyof typeof VARIANT];
} & React.CSSProperties;

export const VARIANT = {
    ICON: 'icon',
    TEXT: 'text',
} as const;

const Skeleton = ({
    animated = true,
    className,
    height,
    paragraph,
    width,
    variant,
    ...css_properties
}: TSkeletonProps) => {
    const getDefaultSize = () => (variant === VARIANT.ICON ? 32 : '100%');

    const style: React.CSSProperties = {
        width: width ?? getDefaultSize(),
        height: height ?? getDefaultSize(),
        ...css_properties,
    };

    if (paragraph?.rows) {
        return (
            <div className='skeleton-paragraph' style={{ gap: paragraph.gap ?? 8 }}>
                {Array.from(new Array(paragraph.rows)).map((_, idx) => {
                    return (
                        <div
                            key={idx}
                            className={clsx(className, 'skeleton', animated && 'animated')}
                            style={{
                                width: idx === paragraph.rows - 1 ? 96 : paragraph.width ?? style.width,
                                height: style.height,
                            }}
                        />
                    );
                })}
            </div>
        );
    }
    return <div className={clsx(className, 'skeleton', animated && 'animated', variant)} style={style} />;
};

export default Skeleton;
