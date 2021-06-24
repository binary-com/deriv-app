import { WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import ApiToken from 'Components/api-token/api-token.jsx';

export default connect(({ client }) => ({ is_switching: client.is_switching, ws: WS }))(ApiToken);
