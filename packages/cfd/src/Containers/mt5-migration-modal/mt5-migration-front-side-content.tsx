import React from 'react';
import { Button, Modal, Text, HintBox, StaticUrl } from '@deriv/components';
import {
    CFD_PLATFORMS,
    Jurisdiction,
    getCFDPlatformNames,
    JURISDICTION_MARKET_TYPES,
    DBVI_COMPANY_NAMES,
    getFormattedJurisdictionMarketTypes,
    getFormattedJurisdictionCode,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import MT5MigrationAccountIcons from './mt5-migration-account-icons';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationFrontSideContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet, setMT5MigrationModalEnabled } = ui;
    const { setShowModalFrontSide } = useMT5MigrationModalContext();
    const {
        getEligibleAccountToMigrate,
        eligible_account_to_migrate_label,
        has_derived_mt5_to_migrate,
        has_derived_and_financial_mt5,
    } = useMT5SVGEligibleToMigrate();

    const getFormattedAccounts = () =>
        has_derived_and_financial_mt5
            ? {
                  platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                  type_1: getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.DERIVED),
                  type_2: getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.FINANCIAL),
                  from_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
              }
            : {
                  platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                  type: getFormattedJurisdictionMarketTypes(
                      has_derived_mt5_to_migrate
                          ? JURISDICTION_MARKET_TYPES.DERIVED
                          : JURISDICTION_MARKET_TYPES.FINANCIAL
                  ),

                  from_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
              };

    const onConfirm = () => {
        setShowModalFrontSide(false);
        setMT5MigrationModalEnabled(true);
    };

    return (
        <React.Fragment>
            <div className='mt5-migration-modal__container'>
                <div>
                    <Text as='p' size={is_mobile_or_tablet ? 'xs' : 's'} align='center'>
                        {has_derived_and_financial_mt5 ? (
                            <Localize
                                i18n_default_text='Enhance your trading experience by upgrading your <0>{{platform}} {{type_1}}</0> <1/>and <0>{{type_2}} {{from_account}}</0> account(s).'
                                values={{
                                    ...getFormattedAccounts(),
                                }}
                                components={[<strong key={0} />]}
                            />
                        ) : (
                            <Localize
                                i18n_default_text='Enhance your trading experience by upgrading your <0/><1>{{platform}} {{type}} {{from_account}} </1> account(s).'
                                values={{
                                    ...getFormattedAccounts(),
                                }}
                                components={[<br key={0} />, <strong key={1} />]}
                            />
                        )}
                    </Text>
                </div>
                <div className='mt5-migration-modal__migration_content'>
                    <div className='mt5-migration-modal__migration_content-items'>
                        <MT5MigrationAccountIcons />
                    </div>
                </div>
                <div className='mt5-migration-modal__migration_infobox'>
                    <HintBox
                        icon='IcInfoBlue'
                        message={
                            <Text as='p' size={is_mobile_or_tablet ? 'xxxs' : 'xxs'}>
                                {has_derived_and_financial_mt5 ? (
                                    <Localize
                                        i18n_default_text='Your existing <0>{{platform}} {{type_1}}</0> <1/>and <0>{{type_2}} {{from_account}}</0> account(s) will remain accessible.'
                                        values={{
                                            ...getFormattedAccounts(),
                                        }}
                                        components={[<strong key={0} />]}
                                    />
                                ) : (
                                    <Localize
                                        i18n_default_text='Your existing <0>{{platform}} {{type}} {{from_account}}</0> account(s) will remain accessible.'
                                        values={{
                                            ...getFormattedAccounts(),
                                        }}
                                        components={[<strong key={0} />]}
                                    />
                                )}
                            </Text>
                        }
                        is_info
                    />
                </div>
                <div>
                    <Text as='p' size={is_mobile_or_tablet ? 'xxs' : 'xs'} align='center'>
                        {has_derived_and_financial_mt5 ? (
                            <Localize
                                i18n_default_text='By clicking on <0>Next</0> you agree to move your {{platform}} {{type_1}} and {{type_2}} {{from_account}} account(s) under Deriv {{account_to_migrate}} Ltd’s <1>terms and conditions</1>.'
                                components={[
                                    <strong key={0} />,
                                    <StaticUrl
                                        key={1}
                                        className='link'
                                        href={DBVI_COMPANY_NAMES[getEligibleAccountToMigrate()]?.tnc_url}
                                    />,
                                ]}
                                values={{
                                    ...getFormattedAccounts(),
                                    account_to_migrate: eligible_account_to_migrate_label,
                                }}
                            />
                        ) : (
                            <Localize
                                i18n_default_text='By clicking on <0>Next</0> you agree to move your {{platform}} {{type}} {{from_account}} account(s) under <2/>Deriv {{account_to_migrate}} Ltd’s <1>terms and conditions</1>.'
                                components={[
                                    <strong key={0} />,
                                    <StaticUrl
                                        key={1}
                                        className='link'
                                        href={DBVI_COMPANY_NAMES[getEligibleAccountToMigrate()]?.tnc_url}
                                        is_document
                                    />,
                                    is_mobile_or_tablet ? null : <br key={2} />,
                                ]}
                                values={{
                                    ...getFormattedAccounts(),
                                    account_to_migrate: eligible_account_to_migrate_label,
                                }}
                            />
                        )}
                    </Text>
                </div>
            </div>
            <Modal.Footer has_separator>
                <Button type='button' has_effect large primary onClick={onConfirm}>
                    <Localize i18n_default_text='Next' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});

export default MT5MigrationFrontSideContent;
