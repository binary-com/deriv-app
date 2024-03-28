import React, { Fragment } from 'react';
import {
    CTraderSuccessModal,
    DxtradePasswordModal,
    JurisdictionModal,
    MT5AccountTypeModal,
    MT5PasswordModal,
    TopUpModal,
    TradeModal,
} from '@/features/cfd/modals';
import { ChangePassword } from '@/features/cfd/screens';
import { RealAccountCreation, Signup } from '@/flows';
import { AccountSelector } from './AccountSelector';
import { AddOrManageAccount } from './AddOrManageAccount';
import { DummyComponentModal } from './DummyComponentModal';
import { DxtradeSuccessModal } from './DxtradeSuccessModal';
import { MT5ChangePasswordModal } from './MT5ChangePasswordModal';
import { MT5SuccessModal } from './MT5SuccessModal';
import { RegulationModal } from './RegulationModal';

/**
 * @description The place to import and export all modals
 * @returns  {React.ReactElement}
 */
const Modals = () => {
    return (
        <Fragment>
            {/* PLS DO NOT ADD ANY PROPS TO ANY MODALS HERE.💥 */}
            <AccountSelector />
            <AddOrManageAccount />
            <DummyComponentModal />
            <DxtradePasswordModal />
            <JurisdictionModal />
            <RealAccountCreation />
            <TradeModal />
            <TopUpModal />
            <ChangePassword />
            <MT5AccountTypeModal />
            <RegulationModal />
            <CTraderSuccessModal />
            <MT5SuccessModal />
            <DxtradeSuccessModal />
            <MT5PasswordModal />
            <MT5ChangePasswordModal />
            <Signup />
        </Fragment>
    );
};

export default Modals;
