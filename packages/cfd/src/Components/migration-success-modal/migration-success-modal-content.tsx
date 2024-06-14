import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { InlineMessage, Text, Button, Modal, Icon } from '@deriv/components';
import { Jurisdiction, CFD_PLATFORMS, getCFDPlatformNames, getFormattedJurisdictionCode } from '@deriv/shared';

type TMigrationSuccessModalContent = {
    has_open_positions: boolean;
    icon?: string;
    eligible_account_to_migrate: string;
    directToCashier: () => void;
};

const MigrationSuccessModalContent = observer(
    ({ has_open_positions, icon, eligible_account_to_migrate, directToCashier }: TMigrationSuccessModalContent) => {
        const { ui } = useStore();
        const { is_mobile_or_tablet } = ui;

        const platform = getCFDPlatformNames(CFD_PLATFORMS.MT5);
        const text_size = is_mobile_or_tablet ? 'xxs' : 'xs';
        return (
            <div className='cfd-success-dialog-migration__modal-content'>
                <Modal.Body
                    className={classNames('cfd-success-dialog-migration__body', {
                        'cfd-success-dialog-migration__body-has-open-positions': has_open_positions,
                    })}
                >
                    <div className='cfd-success-dialog-migration__icon-area'>
                        {icon && <Icon icon={icon} size={128} />}
                    </div>
                    <div>
                        <Text as='h2' weight='bold' className='cfd-success-dialog-migration__title'>
                            <Localize i18n_default_text='Success!' />
                        </Text>
                        <div className='cfd-success-dialog-migration__content-wrapper'>
                            <Text size={text_size} as='p' align='center'>
                                <Localize
                                    i18n_default_text='Your new <0>{{platform}} {{eligible_account_to_migrate}}</0> account(s) are ready for trading.'
                                    values={{
                                        platform,
                                        eligible_account_to_migrate,
                                    }}
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                            <Text
                                size={text_size}
                                as='p'
                                align='center'
                                className='cfd-success-dialog-migration__content-wrapper__desc'
                            >
                                <Localize
                                    i18n_default_text='For new trades, please transfer your funds into the new <0>{{platform}} {{eligible_account_to_migrate}}</0>  account(s).'
                                    values={{
                                        platform,
                                        eligible_account_to_migrate,
                                    }}
                                    components={[<strong key={0} />]}
                                />
                            </Text>
                        </div>
                    </div>
                    {has_open_positions && (
                        <div className='cfd-success-dialog-migration__inline-msg'>
                            <InlineMessage
                                type='information'
                                size='sm'
                                message={
                                    <Localize
                                        i18n_default_text='You can continue with the open positions on your current <0>{{platform}} {{existing_account}}</0> account(s).'
                                        values={{
                                            platform,
                                            existing_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
                                        }}
                                        components={[<strong key={0} />]}
                                    />
                                }
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer has_separator className='cfd-success-dialog-migration-footer'>
                    <Button has_effect onClick={directToCashier} primary large>
                        {has_open_positions ? (
                            <Localize i18n_default_text='OK' />
                        ) : (
                            <Localize i18n_default_text='Transfer now' />
                        )}
                    </Button>
                </Modal.Footer>
            </div>
        );
    }
);

export default MigrationSuccessModalContent;
