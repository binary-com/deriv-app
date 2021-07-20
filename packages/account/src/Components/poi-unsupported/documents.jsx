import React from 'react';
import { Card } from '@deriv/components';
import { CardWithArrow } from './card-with-arrow.jsx';

export const Documents = ({ toggleDetail, documents }) =>
    documents.map((item, index) => (
        <Card
            style={{
                margin: '1.6rem 0',
                height: '11.2rem',
            }}
            key={index}
            renderContent={() => <CardWithArrow onClick={() => toggleDetail(index)} {...item.card} />}
        />
    ));
