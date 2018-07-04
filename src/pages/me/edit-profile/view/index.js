/**
 * ./src/components/admin/edit-profile/view/body
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createToast } from '../../../../lib/helpers';
import { getFromStore } from '../../../../lib/storage';
import { tokenKey } from '../../../../keys/storage';
import {
    fetch_all_data,
    fetch_user_data,
    update_profile_pic,
    update_user_info
} from '../../../../store/actions';
import { EditPicture } from './editPicture';
import { EditDetails } from './editDetails';

export class Body extends Component {
    constructor(props) {
        super(props);

        this.state = this.getInitStateFromProps(this.props) || {
            display_name: '',
            description: '',
            pic_url: ''
        };
    }
    getInitStateFromProps = (props) => {
        if (props.data.data !== undefined) {
            const { fullName, description, gravatarUrl } = props.data.data.user;

            return {
                display_name: fullName,
                description,
                pic_url: gravatarUrl
            };
        }
    };
    onChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        });
    };
    afterUpload = (pic_url) => {
        this.setState({
            pic_url
        });
    };
    sortNewData = (data) => {
        let user_data = {};

        if (data !== undefined) {
            const { fullName, old_description } = data;
            const { display_name, description } = this.state;

            if (display_name !== fullName) {
                user_data = {
                    ...user_data,
                    full_name: display_name
                };
            }

            if (description !== old_description) {
                user_data = {
                    ...user_data,
                    description: description
                };
            }

            user_data = {
                ...user_data,
                user_id: data.uuid
            };
        }

        return user_data;
    };
    onSaveClick = async (e) => {
        e.preventDefault();

        if (this.props.data.data != undefined) {
            const user_data = this.sortNewData(this.props.data.data.user);
            const token = getFromStore(tokenKey);
            try {
                await this.props.update_user_info(user_data);
                await this.props.fetch_user_data(token);
                await this.props.fetch_data();
                createToast('Changes saved');
            } catch (e) {
                createToast('Error updating info');
                return false;
            }
        }
    };
    render() {
        const { display_name, description, pic_url } = this.state;
        return (
            <div className="edit-profile">
                <div className="container">
                    <div className="row">
                        <div className="col s12 m5 push-m7">
                            <EditPicture init_image={pic_url} afterUpload={this.afterUpload} />
                        </div>
                        <div className="col s12 m7 pull-m5">
                            <EditDetails
                                init_data={{ display_name, description }}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                    <button className="btn" onClick={this.onSaveClick}>
                        Save
                    </button>
                </div>
            </div>
        );
    }
}

Body.propTypes = {
    data: PropTypes.object.isRequired,
    fetch_user_data: PropTypes.func.isRequired,
    fetch_data: PropTypes.func.isRequired,
    update_profile_pic: PropTypes.func.isRequired,
    update_user_info: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    data: state.user_data
});

const mapDispatchToProps = (dispatch) => ({
    fetch_user_data: (token) => dispatch(fetch_user_data(token)),
    fetch_data: () => dispatch(fetch_all_data()),
    update_profile_pic: (data) => dispatch(update_profile_pic(data)),
    update_user_info: (data) => dispatch(update_user_info(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Body);
