import React, { HTMLProps, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type TCardProps = HTMLProps<HTMLDivElement>;

export const Card = ({ children, className, ...props }: PropsWithChildren<TCardProps>) => {
    return (
        <div
            className={twMerge(
                'p-16 rounded-xs border-solid-grey-5 flex flex-col justify-between h-auto border-1 border-solid w-full',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
