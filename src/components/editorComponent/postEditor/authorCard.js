import React from 'react';
import types from 'prop-types';

const AuthorInfo = ({ data }) => {
    const user_img = data.profilePicture || '/static/default-pic.png';
    return (
        <div className="author-box">
            <div className="author-info">
                <div
                    className={'author-image col s3' + (data.description == null ? ' no-desc' : '')}
                >
                    <img src={user_img} className="responsive-img circle" />
                </div>
                <div className="author-details col s9">
                    <p className="author-name">{data.fullName}</p>
                    <p className="author-desc">{data.description}</p>
                    <p className="post-meta"> *markdown is supported </p>
                </div>
            </div>
        </div>
    );
};

AuthorInfo.propTypes = {
    data: types.object
};

export default AuthorInfo;
