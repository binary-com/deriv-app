import clsx from 'clsx';
import { ButtonLink, Text } from '@deriv/components';

type TRouteButtonProps = { route: string; button_label: string; className?: string };

/**
 * Renders a button that redirects to the trading platform
 * @name RouteButton
 * @param route - Route to redirect to
 * @param button_label - Text to be displayed on the button
 * @param className - Styles to be applied to the button
 * @returns React Element
 */
export const RouteButton = ({ button_label, className, route }: TRouteButtonProps) => (
    <ButtonLink className={clsx('account-management__button', className)} to={route}>
        <Text className='dc-btn__text' as='p' weight='bold' data-testid='route_btn_text'>
            {button_label}
        </Text>
    </ButtonLink>
);
