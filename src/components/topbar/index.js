import React from 'react';
import types from 'prop-types';
import Router from 'next/router';
import { connect } from 'react-redux';
import { isLoggedIn } from '../../lib/helpers';
import { logoutUser, readAllNotifications } from '../../store/actions-creators';
import { NavBar } from './navBar';
import { SideNav } from './sideNav';
import './topbar.less';

export class TopBar extends React.Component {
    handleLogout = async () => {
        const index = window.location.href.indexOf('/me/');
        if (index === -1) {
            // is not admin
            window.location.href = window.location.href;
        } else {
            // is admin
            // first move to a safe area
            Router.push('/');
            // then reload to send new props to the page
            window.location.href = '/';
        }
        this.props.logout();
    };
    readNotifications = () => {
        this.props.readNotifications();
    };
    render() {
        const loggedIn = this.props.isLoggedIn;
        const user_data = this.props.user_data.data;
        const username = user_data ? user_data.user.fullName : null;
        const notifications_data = this.props.notifications;
        let imageClass = ' defImg';
        let image = '/static/default-pic.png';

        if (loggedIn && isLoggedIn() && user_data !== undefined) {
            if (user_data.user.gravatarUrl !== null) {
                image = user_data.user.gravatarUrl;
                imageClass = '';
            }
        }

        const navbarProps = {
            isLoggedIn: loggedIn,
            notifications_data,
            imageData: {
                imageClass,
                image
            },
            logout: this.handleLogout,
            readNotifications: this.readNotifications
        };

        const sidenavProps = {
            data: {
                image,
                imageClass,
                isLoggedIn: loggedIn,
                username
            },
            logout: this.handleLogout
        };

        return (
            <div className="navbar-wrapper">
                <NavBar {...navbarProps} />
                <SideNav {...sidenavProps} />
            </div>
        );
    }
}

TopBar.propTypes = {
    isLoggedIn: types.bool,
    user_data: types.object,
    notifications: types.object,
    logout: types.func.isRequired,
    readNotifications: types.func.isRequired
};

const mapStateToProp = (state) => ({
    notifications: state.notifications_data,
    user_data: state.user_data
});

const mapDispatchToProp = (dispatch) => ({
    logout: () => dispatch(logoutUser()),
    readNotifications: () => dispatch(readAllNotifications())
});

export default connect(mapStateToProp, mapDispatchToProp)(TopBar);
