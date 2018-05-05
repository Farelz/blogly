/**
 * ./src/components/admin/helpers/sidenav
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import img from '../../../img/default-pic.png';
import './style/sidenav.css';

const mapStateToProps = state => ({
    data: state.user_data
});

class SideNav extends Component {
    constructor(props) {
        super(props);
        this.sideNav = React.createRef();
        this.collapsible = React.createRef();
    }
    componentDidMount() {
        const sidenav = this.sideNav.current;
        const collapsible = this.collapsible.current;
        window.M.Sidenav.init(sidenav);
        window.M.Collapsible.init(collapsible);
    }
    componentWillUnmount() {
        const sidenav = this.sideNav.current;
        const instance = window.M.Sidenav.getInstance(sidenav);
        instance.close();
        instance.destroy();
    }
    onClickRoute = () => {
        const device_width = window.innerWidth;
        if (device_width < 992) {
            const sidenav = this.sideNav.current;
            const instance = window.M.Sidenav.getInstance(sidenav);
            instance.close();
        }
    };
    render() {
        let display_name, pic_url;

        if (this.props.data.data != undefined) {
            const data = this.props.data.data.user;
            display_name = data.fullName;
            pic_url = data.gravatarUrl;
        } else {
            display_name = '';
            pic_url = '';
        }
        return (
            <div>
                <nav className="admin-nav">
                    <div className="nav-wrapper">
                        <a className="brand-logo">ReactPress</a>
                        <a
                            data-target="mobile-demo"
                            className="sidenav-trigger"
                        >
                            <i className="material-icons">menu</i>
                        </a>
                    </div>
                </nav>
                <ul
                    ref={this.sideNav}
                    className="sidenav sidenav-fixed"
                    id="mobile-demo"
                >
                    <li>
                        <div className="user-view">
                            <div className="background" />
                            <a>
                                {pic_url !== '' ? (
                                    <img className="circle" src={pic_url} />
                                ) : (
                                    <img
                                        className="circle"
                                        src={img}
                                        style={{
                                            borderRadius: '50%',
                                            backgroundColor: '#fafafa'
                                        }}
                                    />
                                )}
                            </a>
                            <a>
                                <span className="name">{display_name}</span>
                            </a>
                        </div>
                    </li>
                    <li onClick={this.onClickRoute}>
                        <Link to="/admin/dashboard">
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <ul
                            ref={this.collapsible}
                            className="collapsible collapsible-accordion"
                        >
                            <li>
                                <a className="collapsible-header">Posts</a>
                                <div className="collapsible-body">
                                    <ul>
                                        <li onClick={this.onClickRoute}>
                                            <Link to="/admin/posts">
                                                <span>All Posts</span>
                                            </Link>
                                        </li>
                                        <li onClick={this.onClickRoute}>
                                            <Link to="/admin/new-post">
                                                <span>New Post</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <div className="divider" />
                    </li>
                    <li onClick={this.onClickRoute}>
                        <Link to="/admin/edit-profile">
                            <span>Edit Profile</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

SideNav.propTypes = {
    data: PropTypes.object
};
export default connect(mapStateToProps)(SideNav);
