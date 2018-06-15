/**
 * ./src/components/post/view/post-card
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PostCard extends Component {
    render() {
        const {title, postPicUrl, body, tags} = this.props.data;

        return (
            <div className="post">
                <div className="post-content">
                    <h2 className="post-title">{title}</h2>
                    {(postPicUrl !== undefined && postPicUrl !== '' && postPicUrl !== null) && (
                        <div className="post-image center">
                            <img src={postPicUrl} className="responsive-img" />
                        </div>
                    )}
                    <div>
                        <div
                            className="content"
                            dangerouslySetInnerHTML={{
                                __html: body
                            }}
                        />
                    </div>
                </div>

                <div className="post-footer">
                    {tags.edges.map((obj) => (
                        <div key={obj.node.id} className="post-tag">
                            <span title={obj.node.name}>{obj.node.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

PostCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default PostCard;
