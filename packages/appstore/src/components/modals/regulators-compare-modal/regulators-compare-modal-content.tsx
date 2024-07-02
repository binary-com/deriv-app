import React from 'react';
import { Table, Div100vhContainer, Text, ThemedScrollbars } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared';
import {
    getCFDContents,
    getOptionsContents,
    TRegulatorsContentProps,
    TRowItem,
} from 'Constants/regulators-modal-content';

const Row = ({ attribute, content, id }: TRegulatorsContentProps) => {
    return (
        <Table.Row className='regulators-compare-table__table-row'>
            <Table.Cell fixed>
                <Text as='p' weight='bold' align='left' color='prominent' size={isMobile() ? 'xxxs' : 'xxs'}>
                    {attribute}
                </Text>
            </Table.Cell>
            {Object.keys(content).map(rowKey => (
                <Table.Cell key={rowKey} className='regulators-compare-table__table-row-item'>
                    {Array.isArray(content[rowKey]) ? (
                        (content[rowKey] as TRowItem[])?.map(item => (
                            <Text
                                key={`${id}_${rowKey}_${item?.text}`}
                                as='p'
                                color={item?.options?.color ?? 'prominent'}
                                weight={item?.options?.weight ?? 'normal'}
                                align={item?.options?.align ?? 'center'}
                                size={isMobile() ? 'xxxxs' : 'xxxs'}
                            >
                                {item?.text}
                                {item?.options?.should_show_asterick_at_end && (
                                    <Text color={'loss-danger'} size={'xxxs'}>
                                        *
                                    </Text>
                                )}
                            </Text>
                        ))
                    ) : (
                        <Text
                            as='p'
                            align={(content[rowKey] as TRowItem)?.options?.align ?? 'center'}
                            size={isMobile() ? 'xxxxs' : 'xxxs'}
                            color={(content[rowKey] as TRowItem)?.options?.color ?? 'prominent'}
                            weight={(content[rowKey] as TRowItem)?.options?.weight ?? 'normal'}
                        >
                            {(content[rowKey] as TRowItem)?.text}
                        </Text>
                    )}
                </Table.Cell>
            ))}
        </Table.Row>
    );
};

const RegulatorsCompareModalContent = () => {
    return (
        <Div100vhContainer height_offset='40px' is_bypassed={isDesktop()}>
            <ThemedScrollbars is_bypassed={isMobile()}>
                <div className='regulators-compare-table'>
                    <Table className='regulators-compare-table__table'>
                        <Table.Header>
                            <Table.Row className={'regulators-compare-table__table-header'}>
                                <Table.Head fixed className='regulators-compare-table__table-empty-cell' />
                                <Table.Head className='regulators-compare-table__table-header-item'>
                                    <Localize i18n_default_text='Non-EU regulation' />
                                </Table.Head>
                                <Table.Head className='regulators-compare-table__table-header-item'>
                                    <Localize i18n_default_text='EU regulation' />
                                </Table.Head>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            <div className='regulators-compare-table__table-row-wrapper'>
                                {getCFDContents().map(row => (
                                    <Row key={row.id} {...row} />
                                ))}
                            </div>
                            <div className='regulators-compare-table__table-row-wrapper'>
                                {getOptionsContents().map(row => (
                                    <Row key={row.id} {...row} />
                                ))}
                            </div>
                        </Table.Body>
                    </Table>
                </div>
            </ThemedScrollbars>
        </Div100vhContainer>
    );
};

export default RegulatorsCompareModalContent;
