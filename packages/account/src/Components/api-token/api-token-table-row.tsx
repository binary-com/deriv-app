import ApiTokenDeleteButton from './api-token-delete-button';
import ApiTokenTableRowCell from './api-token-table-row-cell';
import ApiTokenTableRowScopesCell from './api-token-table-row-scopes-cell';
import ApiTokenTableRowTokenCell from './api-token-table-row-token-cell';
import { TFormattedToken } from '../../Types';

type TApiTokenTableRow = {
    token: TFormattedToken;
};

const ApiTokenTableRow = ({ token }: TApiTokenTableRow) => (
    <tr className='da-api-token__table-cell-row'>
        <ApiTokenTableRowCell className='da-api-token__table-cell--name'>{token.display_name}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenTableRowTokenCell token={token.token} scopes={token.formatted_scopes} />
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenTableRowScopesCell scopes={token.formatted_scopes} />
        </ApiTokenTableRowCell>
        <ApiTokenTableRowCell>{token.last_used}</ApiTokenTableRowCell>
        <ApiTokenTableRowCell should_bypass_text>
            <ApiTokenDeleteButton token={token} />
        </ApiTokenTableRowCell>
    </tr>
);

export default ApiTokenTableRow;
