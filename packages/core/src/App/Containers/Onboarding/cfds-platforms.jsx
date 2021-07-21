import React from 'react';
import { useHistory } from 'react-router';
import { Button, Text, Table, Icon, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes, isMobile } from '@deriv/shared';

const data = [
    {
        title: localize('Operating Systems'),
        dmt5: [
            { title: localize('iOS'), icon: 'IcIos' },
            { title: localize('Android'), icon: 'IcAndroid' },
            { title: localize('Windows'), icon: 'IcWindowsGray' },
            { title: localize('macOS'), icon: 'IcMacos2' },
            { title: localize('Linux'), icon: 'IcLinux2' },
            { title: localize('Browser'), icon: 'IcBrowser' },
        ],
        derivx: [
            { title: localize('iOS'), icon: 'IcIos' },
            { title: localize('Android'), icon: 'IcAndroid' },
            { title: localize('Browser'), icon: 'IcBrowser' },
        ],
        has_items: true,
    },
    {
        title: localize('Asset classes'),
        dmt5: [
            {
                title: localize('Synthetics'),
                icon: 'IcMt5Synthetics',
            },
            {
                title: localize('Cryptos'),
                icon: 'IcMt5Cryptos',
            },
            {
                title: localize('Indices'),
                icon: 'IcMt5Indices',
            },
            {
                title: localize('Stocks'),
                icon: 'IcMt5Stocks',
            },
            {
                title: localize('Forex'),
                icon: 'IcMt5Forex',
            },
            {
                title: localize('Commodities'),
                icon: 'IcMt5Commodities',
            },
        ],
        derivx: [
            {
                title: localize('Synthetics'),
                icon: 'IcMt5Synthetics',
            },
            {
                title: localize('Cryptos'),
                icon: 'IcMt5Cryptos',
            },
            {
                title: localize('Indices'),
                icon: 'IcMt5Indices',
            },
            {
                title: localize('Forex'),
                icon: 'IcMt5Forex',
            },
            {
                title: localize('Commodities'),
                icon: 'IcMt5Commodities',
            },
        ],
        has_items: true,
    },
    {
        title: localize('Assets'),
        dmt5: localize('190+'),
        derivx: localize('190+'),
        has_items: false,
    },
    {
        title: localize('Leverage'),
        dmt5: localize('Up to 1:1000'),
        derivx: localize('Up to 1:1000'),
        has_items: false,
    },
    {
        title: localize('Trading signals'),
        dmt5: localize('Yes'),
        derivx: localize('No'),
        has_items: false,
    },
    {
        title: localize('Customisability'),
        dmt5: localize('Moderate'),
        derivx: localize('High'),
        has_items: false,
    },
];

const Items = ({ items }) =>
    items.map(({ title, icon }) => (
        <div key={title} className='platform-item'>
            <Icon icon={icon} size={isMobile() ? 16 : 24} />
            <Text
                as='p'
                align='center'
                color='prominent'
                size={isMobile() ? 'xxxxs' : 'xxxs'}
                className='platform-item__text'
            >
                {title}
            </Text>
        </div>
    ));

const Row = ({ title, dmt5, derivx, has_items }) => (
    <>
        <Table.Row className={has_items ? 'platform-table-row-items' : 'platform-table-row'}>
            <Table.Cell className='platform-table-col'>
                <Text as='p' weight='bold' align='center' color='prominent' size='xs'>
                    {title}
                </Text>
            </Table.Cell>

            <Table.Cell className='platform-table-col'>
                {Array.isArray(dmt5) ? (
                    <Items items={dmt5} />
                ) : (
                    <Text as='p' weight='bold' align='center' color='prominent' size='s'>
                        {dmt5}
                    </Text>
                )}
            </Table.Cell>
            <Table.Cell className='platform-table-col'>
                {Array.isArray(derivx) ? (
                    <Items items={derivx} />
                ) : (
                    <Text as='p' weight='bold' align='center' color='prominent' size='s'>
                        {derivx}
                    </Text>
                )}
            </Table.Cell>
        </Table.Row>
    </>
);

const Platforms = () => {
    const history = useHistory();

    return (
        <section className='platform-onboarding'>
            <MobileWrapper>
                <Text
                    as='h2'
                    weight='bold'
                    align='center'
                    color='prominent'
                    size='xsm'
                    className='platform-onbordering-title'
                >
                    {localize('Platforms')}
                </Text>
            </MobileWrapper>
            <DesktopWrapper>
                <Text
                    as='h2'
                    weight='bold'
                    align='center'
                    color='prominent'
                    size='m'
                    className='platform-onbordering-title'
                >
                    {localize('Platforms')}
                </Text>
            </DesktopWrapper>
            <Table>
                <Table.Header>
                    <DesktopWrapper>
                        <Table.Head />
                    </DesktopWrapper>
                    <Table.Head>
                        <MobileWrapper>
                            <Icon icon='IcBrandDmt5' size={32} />
                            <Text as='h3' weight='bold' align='center' color='prominent' size='xsm'>
                                {localize('DMT5')}
                            </Text>
                        </MobileWrapper>
                        <DesktopWrapper>
                            <Icon icon='IcBrandDmt5' size={48} />
                            <Text as='h3' weight='bold' align='center' color='prominent' size='m'>
                                {localize('DMT5')}
                            </Text>
                        </DesktopWrapper>
                    </Table.Head>
                    <Table.Head>
                        <MobileWrapper>
                            <Icon icon='IcBrandDxtrade' size={32} />
                            <Text as='h3' weight='bold' align='center' color='prominent' size='xsm'>
                                {localize('Deriv X')}
                            </Text>
                        </MobileWrapper>
                        <DesktopWrapper>
                            <Icon icon='IcBrandDxtrade' size={48} />
                            <Text as='h3' weight='bold' align='center' color='prominent' size='m'>
                                {localize('Deriv X')}
                            </Text>
                        </DesktopWrapper>
                    </Table.Head>
                </Table.Header>
                <Table.Body>
                    {data.map(item => (
                        <Row key={item.title} {...item} />
                    ))}
                </Table.Body>
                <Table.Footer>
                    <Table.Row className='platform-table-row'>
                        <DesktopWrapper>
                            <Table.Cell className='platform-table-col' />
                        </DesktopWrapper>
                        <Table.Cell className='platform-table-col'>
                            <Button
                                type='button'
                                secondary
                                onClick={() => {
                                    history.push(routes.mt5);
                                }}
                            >
                                {localize('Choose DMT5')}
                            </Button>
                        </Table.Cell>
                        <Table.Cell className='platform-table-col'>
                            <Button
                                type='button'
                                secondary
                                onClick={() => {
                                    history.push(routes.dxtrade);
                                }}
                            >
                                {localize('Choose Deriv X')}
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </section>
    );
};

export default Platforms;
