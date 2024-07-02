import React from 'react';
import { Button, Modal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import StarRating from 'Components/star-rating';
import RecommendUser from 'Components/recommend-user';
import { useStores } from 'Stores';
import { getIconSize } from 'Utils/responsive';

type TRatingModalProps = {
    is_buy_order_for_user: boolean;
    is_user_recommended_previously: number;
    onClickDone: () => void;
    onClickSkip: () => void;
};

const RatingModal = ({
    is_buy_order_for_user,
    is_user_recommended_previously,
    onClickDone,
    onClickSkip,
}: TRatingModalProps) => {
    const { isDesktop } = useDevice();
    const { order_store } = useStores();
    const { is_modal_open } = useModalManagerContext();
    const { handleRating, rating_value, setIsRecommended } = order_store;

    const onClickClearRecommendation = () => setIsRecommended(null);
    const onClickNotRecommended = () => setIsRecommended(0);
    const onClickRecommended = () => setIsRecommended(1);

    return (
        <Modal
            has_close_icon={rating_value > 0}
            is_open={is_modal_open}
            title={localize('How would you rate this transaction?')}
            toggleModal={onClickSkip}
            width={isDesktop ? '' : '90vw'}
        >
            <Modal.Body className='rating-modal__body'>
                <div className='rating-modal__body__star'>
                    <StarRating
                        empty_star_className='rating-modal__star'
                        empty_star_icon='IcEmptyStar'
                        full_star_className='rating-modal__star'
                        full_star_icon='IcFullStar'
                        initial_value={0}
                        number_of_stars={5}
                        onClick={handleRating}
                        rating_value={rating_value}
                        should_allow_half_icon={false}
                        star_size={getIconSize(25, 20)}
                    />
                </div>
                {rating_value > 0 && (
                    <RecommendUser
                        is_buy_order_for_user={is_buy_order_for_user}
                        is_user_recommended_previously={is_user_recommended_previously}
                        onClickClearRecommendation={onClickClearRecommendation}
                        onClickNotRecommended={onClickNotRecommended}
                        onClickRecommended={onClickRecommended}
                    />
                )}
            </Modal.Body>
            <Modal.Footer className='rating-modal__footer'>
                {rating_value > 0 ? (
                    <Button primary large onClick={onClickDone}>
                        <Localize i18n_default_text='Done' />
                    </Button>
                ) : (
                    <Button secondary large onClick={onClickSkip}>
                        <Localize i18n_default_text='Skip' />
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default observer(RatingModal);
