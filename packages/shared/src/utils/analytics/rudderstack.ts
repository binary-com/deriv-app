import * as rudderanalytics from 'rudder-sdk-js';
import { isProduction } from '../config';

type SignupProvider = 'email' | 'phone' | 'google' | 'facebook' | 'apple';

type VirtualSignupFormAction = {
    action:
        | 'open'
        | 'started'
        | 'email_confirmed'
        | 'signup_continued'
        | 'country_selection_screen_opened'
        | 'password_screen_opened'
        | 'signup_done'
        | 'signup_flow_error'
        | 'go_to_login';
    signup_provider?: SignupProvider;
    form_source?: string;
    form_name?: string;
    error_message?: string;
};

type RealAccountSignupFormAction = {
    action:
        | 'open'
        | 'step_passed'
        | 'save'
        | 'restore'
        | 'close'
        | 'real_signup_error'
        | 'other_error'
        | 'real_signup_finished';
    step_codename?: string;
    step_num?: number;
    user_choice?: string;
    source?: string;
    form_name?: string;
    real_signup_error_message?: string;
    landing_company: string;
};

type VirtualSignupEmailConfirmationAction = {
    action: 'received' | 'expired' | 'confirmed' | 'error';
    signup_provider?: SignupProvider;
    form_source?: string;
    email_md5?: string;
    error_message?: string;
};

type TradeTypesFormAction =
    | {
          action: 'open' | 'close' | 'info_close';
          trade_type_name?: string;
          tab_name: string;
          form_source?: string;
          form_name?: string;
          subform_name?: string;
      }
    | {
          action: 'choose_trade_type';
          subform_name: 'info_old' | 'info_new';
          form_name: string;
          trade_type_name: string;
      }
    | {
          action: 'choose_trade_type';
          subform_name: 'trade_type';
          tab_name: string;
          form_name: string;
          trade_type_name: string;
      }
    | {
          action: 'search';
          search_string: string;
      }
    | {
          action: 'info_open';
          tab_name: string;
          trade_type_name: string;
      }
    | {
          action: 'info-switcher';
          info_switcher_mode: string;
          trade_type_name: string;
      };

type RSEvents = {
    ce_virtual_signup_form: VirtualSignupFormAction;
    ce_real_account_signup_form: RealAccountSignupFormAction;
    ce_virtual_signup_email_confirmation: VirtualSignupEmailConfirmationAction;
    ce_trade_types_form: TradeTypesFormAction;
};

type IdentifyEvent = {
    language: string;
};

class RudderStack {
    // only available on production (bot and deriv)
    // is_applicable = /^(16929|19111|24091)$/.test(getAppId());
    has_identified = false;
    has_initialized = false;
    current_page = '';

    constructor() {
        const write_key = isProduction() ? process.env.RUDDERSTACK_PRODUCTION_KEY : process.env.RUDDERSTACK_STAGING_KEY;
        if (write_key) {
            rudderanalytics.load(write_key, 'https://deriv-dataplane.rudderstack.com');
            rudderanalytics.ready(() => {
                this.has_initialized = true;
            });
        }
    }

    identifyEvent = (user_id: string, payload: IdentifyEvent) => {
        if (this.has_initialized) {
            rudderanalytics.identify(user_id, payload);
            this.has_identified = true;
            this.pageView();
        }
    };

    /**
     * Pushes page view track event to rudderstack
     */
    pageView() {
        const current_page = window.location.hostname + window.location.pathname;

        if (this.has_initialized && this.has_identified && current_page !== this.current_page) {
            rudderanalytics.page('Deriv App', current_page);
            this.current_page = current_page;
        }
    }

    /**
     * Pushes reset event to rudderstack
     */
    reset() {
        if (this.has_initialized) {
            rudderanalytics.reset();
            this.has_identified = false;
        }
    }

    /**
     * Pushes track event to rudderstack
     */
    track<EventType extends keyof RSEvents, EventPayload extends RSEvents[EventType]>(
        event_type: EventType,
        payload: EventPayload
    ) {
        if (this.has_initialized && this.has_identified) {
            rudderanalytics.track(event_type, payload);
        }
    }
}

export default new RudderStack();
