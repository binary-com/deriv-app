import { observable, action, computed } from 'mobx';
import { localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared/utils/date';
import { message_types } from '@deriv/bot-skeleton';
import { config } from '@deriv/bot-skeleton/src/constants/config';
import { storeSetting, getSetting } from '../utils/settings';
import { messageWithButton } from '../components/notify-item.jsx';

export default class JournalStore {
    @observable unfiltered_messages = [];
    @observable checked_filters = getSetting('journal_filter') || this.filters.map(filter => filter.id);

    constructor(root_store) {
        this.root_store = root_store;
        this.dbot = this.root_store.dbot;
        this.filters = [
            {
                id: message_types.ERROR,
                label: localize('Errors'),
                types: [message_types.ERROR],
            },
            {
                id: message_types.NOTIFY,
                label: localize('Notifications'),
                types: [message_types.NOTIFY, message_types.MESSAGE_WITH_BUTTONS],
            },
            {
                id: message_types.SUCCESS,
                label: localize('System'),
                types: [message_types.SUCCESS],
            },
        ];
    }

    getServerTime() {
        return this.root_store.core.common.server_time.get();
    }

    @action.bound
    onLogSuccess(message) {
        const { log_type, passthrough } = message;
        this.pushMessage(log_type, message_types.SUCCESS, '', passthrough);
    }

    @action.bound
    onError(message) {
        this.pushMessage(message, message_types.ERROR);
    }

    @action.bound
    onNotify(data) {
        const { run_panel } = this.root_store;
        const { message, className, message_type, sound, block_id, variable_name, passthrough } = data;
        let message_string = message;

        // when notify undefined variable block
        if (message === undefined && variable_name != null) {
            run_panel.showErrorMessage(
                messageWithButton({
                    unique_id: block_id,
                    type: 'error',
                    message: localize(
                        "Variable '{{variable_name}}' has no value. Please set a value for variable '{{variable_name}}' to notify.",
                        { variable_name }
                    ),
                    btn_text: localize('Go to block'),
                    onClick: () => {
                        this.dbot.centerAndHighlightBlock(block_id, true);
                    },
                })
            );
            return;
        }

        if (typeof message === 'boolean') {
            message_string = message.toString();
        }
        this.pushMessage(message_string, message_type, className, passthrough);

        if (sound !== config.lists.NOTIFICATION_SOUND[0][1]) {
            document.getElementById(sound)?.play();
        }
    }

    @action.bound
    pushMessage(message, message_type, className, passthrough) {
        const date = formatDate(this.getServerTime());
        const time = formatDate(this.getServerTime(), 'HH:mm:ss [GMT]');
        const unique_id = Blockly.utils.genUid();
        this.unfiltered_messages.unshift({ date, time, message, message_type, className, unique_id, passthrough });
    }

    @computed
    get filtered_messages() {
        return this.unfiltered_messages.filter(message => {
            const has_filters = this.checked_filters.length > 0;
            const is_type_match = this.checked_filters.some(filter_id => {
                const filter = this.filters.find(filter => filter.id === filter_id);
                return filter && filter.types.includes(message.message_type);
            });
            return has_filters && is_type_match;
        });
    }

    @action.bound
    filterMessage(checked, item_id) {
        if (checked) {
            this.checked_filters.push(item_id);
        } else {
            this.checked_filters.splice(this.checked_filters.indexOf(item_id), 1);
        }

        storeSetting('journal_filter', this.checked_filters);
    }

    @action.bound
    clear() {
        this.unfiltered_messages = [];
        this.filterMessage(this.checked_filters);
    }
}
