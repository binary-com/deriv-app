import React from 'react';
import { Modal, ThemedScrollbars } from '@deriv/components';
import SelfExclusionContext from './self-exclusion-context';
import SelfExclusionArticleContent from './self-exclusion-article-content';

const SelfExclusionModal = () => {
    const { state, toggleArticle } = React.useContext(SelfExclusionContext);

    return (
        <Modal className='self_exclusion__article-modal' is_open={state?.show_article} toggleModal={toggleArticle}>
            <ThemedScrollbars>
                <SelfExclusionArticleContent />
            </ThemedScrollbars>
        </Modal>
    );
};

export default SelfExclusionModal;
