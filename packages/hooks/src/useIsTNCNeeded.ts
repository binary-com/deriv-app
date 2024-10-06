import { useStore } from '@deriv/stores';

/**
 * Custom hook to determine if TNC (Terms and Conditions) acceptance is needed.
 *
 * The function first checks if `tnc_status` is available in `account_settings`.
 * If `tnc_status` is not available, it is assumed that TNC acceptance is not needed.
 *
 * If `tnc_status` is available, it reads the status based on the current
 * `landing_company_shortcode`.
 * - If the status is 0, TNC acceptance is needed.
 * - If the status is 1, it means that TNC has been accepted, and acceptance is not needed.
 *
 * @returns {boolean} - Returns true if TNC acceptance is needed, false otherwise.
 */

const useIsTNCNeeded = () => {
    const { client } = useStore();
    const { account_settings, landing_company_shortcode } = client;
    const { tnc_status } = account_settings || {};
    const is_tnc_needed = tnc_status && tnc_status[landing_company_shortcode] === 0;

    return is_tnc_needed;
};

export default useIsTNCNeeded;
