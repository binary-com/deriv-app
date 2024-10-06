import { withRouter } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { BinaryRoutes } from '../Components/Routes';
import ErrorComponent from '../Components/error-component';
import { ThemeProvider } from '@deriv-com/quill-ui';

const Routes = observer(() => {
    const { client, common, ui } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;
    const { is_dark_mode_on } = ui;
    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return (
        <ThemeProvider theme={is_dark_mode_on ? 'dark' : 'light'}>
            <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />
        </ThemeProvider>
    );
});

// need to wrap withRouter
// to prevent updates on <BinaryRoutes /> from being blocked
export default withRouter(Routes);
