import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { region_availability } from 'Constants/platform-config';
import RegulationsSwitcherLoader from 'Components/pre-loader/regulations-switcher-loader';
import { useStore, observer } from '@deriv/stores';
import './regulators-switcher.scss';

type SwitcherItemProps = {
    onClick: () => void;
    is_selected: boolean;
};

const SwitcherItem = ({ children, is_selected, ...props }: SwitcherItemProps & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={clsx('item', { 'is-selected': is_selected })} {...props}>
            <Text size='xs' weight={is_selected ? 'bold' : 'normal'} color={is_selected ? 'prominent' : 'general'}>
                {children}
            </Text>
        </div>
    );
};

const RegulatorSwitcher = observer(() => {
    const { traders_hub, client } = useStore();
    const { toggleRegulatorsCompareModal } = traders_hub;
    const { is_switching } = client;

    return (
        <div className='regulators-switcher__container'>
            <div className='regulators-switcher--text'>
                <Text>{localize('Regulation:')}</Text>
                <div
                    data-testid='dt_regulators-switcher-icon'
                    className='regulators-switcher--icon'
                    onClick={() => toggleRegulatorsCompareModal()}
                >
                    <Icon icon='IcInfoOutline' />
                </div>
            </div>
            {!is_switching ? (
                <div className='regulators-switcher__switch'>
                    {region_availability.map(region => {
                        return (
                            <SwitcherItem
                                key={`regulator-item_${region}`}
                                is_selected={region === traders_hub.selected_region}
                                onClick={() => traders_hub.selectRegion(region)}
                            >
                                {region}
                            </SwitcherItem>
                        );
                    })}
                </div>
            ) : (
                <div className='regulators-switcher__container content-loader'>
                    <RegulationsSwitcherLoader />
                </div>
            )}
        </div>
    );
});

export default RegulatorSwitcher;
