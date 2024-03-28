import React from 'react';
import { FormSubHeader } from '../../components/FormSubHeader';
import { getTradingAssessmentQuestions } from '../../constants/tradingAssessmentQuestions';
import { TradingAssessmentContainer } from './TradingAssessmentContainer';

export const TradingAssessmentForm = () => {
    const tradingAssessmentQuestions = getTradingAssessmentQuestions();
    return (
        <div>
            <FormSubHeader>Trading assessment</FormSubHeader>
            <TradingAssessmentContainer
                answerList={[{ text: 'hello', value: 'hello' }]}
                name='hello'
                question='how are you?'
            />
        </div>
    );
};
