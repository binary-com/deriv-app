import { localize } from '@deriv/translations';
import { messageWithButton, arrayAsMessage } from 'Components';

const showErrorMessageWithButton = (message, block_id, showErrorMessage, centerAndHighlightBlock) => {
    showErrorMessage(
        messageWithButton({
            unique_id: block_id,
            type: 'error',
            message,
            btn_text: localize('Go to block'),
            onClick: () => {
                centerAndHighlightBlock();
            },
        })
    );
};

export const isCustomJournalMessage = (
    { message, block_id, variable_name },
    showErrorMessage,
    centerAndHighlightBlock,
    pushMessage
) => {
    // notify undefined variable block
    if (message === undefined && variable_name != null) {
        showErrorMessageWithButton(
            localize(
                "Variable '{{variable_name}}' has no value. Please set a value for variable '{{variable_name}}' to notify.",
                { variable_name }
            ),
            block_id,
            showErrorMessage,
            centerAndHighlightBlock
        );
        return true;
    }
    // notify null variable block
    if (message === null) {
        pushMessage('NULL');
        return true;
    }
    // notify NaN variable block
    if (Object.is(message, NaN)) {
        showErrorMessageWithButton(
            localize('Tried to perform an invalid operation.'),
            block_id,
            showErrorMessage,
            centerAndHighlightBlock
        );
        return true;
    }
    // notify list block
    if (Array.isArray(message)) {
        const message_length = message.length;
        const parsedArray = {
            header:
                variable_name !== 'null'
                    ? `${variable_name}: (${message_length})`
                    : localize('List: ({{message_length}})', { message_length }),
            content: parseArray(message),
        };
        pushMessage(arrayAsMessage(parsedArray));
        return true;
    }
    // notify boolean results
    if (typeof message === 'boolean') {
        pushMessage(message.toString());
        return true;
    }
    if (typeof message === 'object') {
        pushMessage(message.toString());
        return true;
    }

    return false;
};

const parseArray = message => {
    return message.map(item => {
        return {
            id: new Date().getTime() * Math.random(),
            value: item && Array.isArray(item) ? parseArray(item) : item,
        };
    });
};
