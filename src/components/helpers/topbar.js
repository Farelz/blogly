/**
 * ./src/components/post/view/topbar
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../js/redux/actions';
import img from '../../img/default-pic.png';
import './style/topbar.css';

const mapDispatchToProp = dispatch => ({
    logout: () => dispatch(logoutUser())
});

class TopBar extends Component {
    constructor(props) {
        super(props);

        this.sidenav = React.createRef();
        this.sidenavIns;
    }
    componentDidMount() {
        const sidenav = this.sidenav.current;
        if (window.M) {
            this.sidenavIns = window.M.Sidenav.init(sidenav);
        }
    }
    componentWillUnmount() {
        this.sidenavIns.close();
        this.sidenavIns.destroy();
    }
    handleLogout = () => {
        this.props.logout();
    };
    render() {
        let style = {
            borderRadius: '50%',
            backgroundColor: '#fafafa'
        };
        let defImg = img;

        if (this.props.user_data != undefined){
            if (this.props.user_data.user.gravatarUrl != null){
                defImg = this.props.user_data.user.gravatarUrl;
                style = {};
            }
        }

        return (
            <div className="navbar-wrapper">
                <div className="navbar-fixed">
                    <nav className="topbar nav-extended">
                        <div className="nav-wrapper">
                            <a
                                href="#"
                                data-target="mobile-topbar"
                                className="sidenav-trigger hide-on-med-and-up"
                            >
                                <i className="material-icons">menu</i>
                            </a>
                            <div className="blog-info">
                                <Link to="/" className="brand-logo">
                                    <span className="blog-title">
                                        ReactPress
                                    </span>
                                </Link>
                            </div>
                            {this.props.user_data != undefined ? (
                                <ul className="right hide-on-small-only">
                                    <li>
                                        <Link
                                            to="/admin/dashboard"
                                            title="Go to dashboard"
                                        >
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            title="Logout"
                                            onClick={this.handleLogout}
                                        >
                                            <span>Logout</span>
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/dashboard"
                                            title="Go to dashboard"
                                            className="user-profile"
                                        >
                                            <img
                                                className="user-image responsive-img circle"
                                                src={defImg}
                                                style={style}
                                            />
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="right hide-on-small-only">
                                    <li>
                                        <Link
                                            to="/auth/login"
                                            className="sign-in"
                                        >
                                            Sign in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/auth/signup"
                                            className="sign-up btn"
                                        >
                                            Get started
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </nav>
                </div>

                <ul
                    ref={this.sidenav}
                    className="sidenav hide-on-med-and-up"
                    id="mobile-topbar"
                >
                    {this.props.user_data != undefined ? (
                        <div>
                            <li>
                                <div className="user-view">
                                    <a>
                                        <img
                                            className="circle"
                                            src={defImg}
                                            style={style}
                                        />
                                    </a>
                                    <span className="email">
                                        Hello,{' '}
                                        {this.props.user_data.user.fullName}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <Link
                                    to="/admin/dashboard"
                                    title="Go to dashboard"
                                >
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <a title="Logout" onClick={this.handleLogout}>
                                    <span>Logout</span>
                                </a>
                            </li>
                            <div className="divider" />
                        </div>
                    ) : (
                        <div>
                            <li>
                                <div className="user-view">
                                    <a>
                                        <img
                                            className="circle"
                                            src={defImg}
                                            style={style}
                                        />
                                    </a>
                                    <span className="email">Hello, Guest</span>
                                </div>
                            </li>
                            <li>
                                <Link
                                    className="hide-on-med-and-up"
                                    to="/auth/login"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <div className="divider" />
                            <li>
                                <Link
                                    className="hide-on-med-and-up"
                                    to="/auth/signup"
                                >
                                    Get Started
                                </Link>
                            </li>
                        </div>
                    )}
                </ul>
            </div>
        );
    }
}

TopBar.propTypes = {
    user_data: PropTypes.object,
    logout: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProp)(TopBar);
