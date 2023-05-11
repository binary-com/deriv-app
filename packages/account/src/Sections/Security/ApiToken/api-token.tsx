import { WS } from '@deriv/shared';
import type { TCoreStores } from '@deriv/stores/types';
import { connect } from 'Stores/connect';
import ApiToken from 'Components/api-token/api-token';
import 'Components/api-token/api-token.scss';

export default connect(({ client }: TCoreStores) => ({ is_switching: client.is_switching, ws: WS }))(ApiToken);
