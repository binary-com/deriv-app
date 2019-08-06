import PropTypes      from 'prop-types';
import React          from 'react';
import { connect }    from 'Stores/connect';
import ErrorComponent from './index';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch = (error, info) => {
        if (window.TrackJS) window.TrackJS.console.log(this.props.root_store);

        this.setState({
            hasError: true,
            error,
            info,
        });
    };

    render = () => this.state.hasError ? (
        <ErrorComponent should_show_refresh={true} />
    ) : this.props.children;
}

ErrorBoundary.propTypes = {
    root_store: PropTypes.object,
};

export default connect((store) => (
    {
        root_store: store,
    }
))(ErrorBoundary);
