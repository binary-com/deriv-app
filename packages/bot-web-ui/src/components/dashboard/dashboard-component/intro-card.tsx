import React from 'react';
import { TSidebarItem } from './constants';

type TIntroCard = {
    sidebar_item: TSidebarItem;
};

const Index = ({ sidebar_item }: TIntroCard) => {
    const { label, content } = sidebar_item;
    return (
        <div className='db-sidebar__card' key={label}>
            <h1>{label}</h1>
            {content?.map((text, key) => (
                <p key={`sidebar-tour${key}`}>{text}</p>
            ))}
        </div>
    );
};

export default Index;
