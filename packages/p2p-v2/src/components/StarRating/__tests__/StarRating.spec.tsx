import React from 'react';
import StarRating from '../StarRating';
import { render, screen } from '@testing-library/react';

describe('StarRating', () => {
    it('should render the passed filled/empty star icons', () => {
        render(<StarRating initialValue={3} ratingValue={3.3} />);
        expect(screen.queryAllByTestId('dt_p2p_v2_star_rating_empty_star')).toHaveLength(5);
        expect(screen.queryAllByTestId('dt_p2p_v2_star_rating_full_star')).toHaveLength(5);
    });
});
