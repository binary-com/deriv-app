import React, { CSSProperties } from 'react';
import './watermark.scss';

type TProps = {
    image: CSSProperties['backgroundImage'];
    opacity?: CSSProperties['opacity'];
};

const Watermark: React.FC<React.PropsWithChildren<TProps>> = ({ image, opacity = 0.16 }) => (
    <div className='watermark' style={{ backgroundImage: image, opacity }} />
);

export default Watermark;
