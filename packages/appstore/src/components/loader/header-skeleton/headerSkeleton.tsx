import BrandSkeleton from '../brand-skeleton/brandSkeleton';
import CashierButtonSkeleton from '../cashier-button-skeleton/cashierButtonSkeleton';
import { VerticalDivider } from '../divider/divider';
import HeaderRightMenuSkeleton from '../header-right-menu-skeleton/headerRightMenuSkeleton';
import MenuSkeleton from '../menu-skeleton/menuSkeleton';
import TradershubMenuSkeleton from '../traders-hub-menu-skeleton/tradershubMenuSkeleton';

import './headerSkeleton.scss';

const HeaderSkeleton = () => (
    <div className='header-skeleton-loader'>
        <div className='header-skeleton-loader__left'>
            <BrandSkeleton />
            <VerticalDivider />
            <TradershubMenuSkeleton />
            <MenuSkeleton />
        </div>
        <div className='header-skeleton-loader__right'>
            <VerticalDivider />
            <HeaderRightMenuSkeleton />
            <CashierButtonSkeleton />
        </div>
    </div>
);

export default HeaderSkeleton;
