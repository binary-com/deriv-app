import React, { FC, ReactElement, useState } from 'react';
import TabTitle, { TabTitleProps } from './TabTitle';
import './Tabs.scss';

type TabsProps = {
    children: ReactElement<TabTitleProps>[];
    preSelectedTab?: number;
    wrapperClassName?: string;
};

const Tabs: FC<TabsProps> = ({ children, preSelectedTab, wrapperClassName }): JSX.Element => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(preSelectedTab || 0);

    return (
        <div className={wrapperClassName}>
            <div className='wallets-tabs'>
                {children.map((item, index) => (
                    <TabTitle
                        icon={item.props.icon}
                        index={index}
                        isActive={index === selectedTabIndex}
                        key={`wallets-tab-${item.props.title}`}
                        setSelectedTab={setSelectedTabIndex}
                        title={item.props.title}
                    />
                ))}
            </div>
            {children[selectedTabIndex]}
        </div>
    );
};

export default Tabs;
