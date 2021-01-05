import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {

        if( navigator ) {
            var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if( isFirefox ) {
                setTimeout( () => window.scrollTo(0, 0) , 100);
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }
}

render() {
    return this.props.children
}
}

export default withRouter(ScrollToTop)