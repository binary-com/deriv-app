import { HTMLAttributes } from 'react';

const GridContainer = ({ children }: HTMLAttributes<HTMLDivElement>) => {
    return <div className='listing-container__content'>{children}</div>;
};

export default GridContainer;
