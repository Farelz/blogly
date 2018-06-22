import React from 'react';
import types from 'prop-types';
import Link from 'next/link';
import CommentForm from './commentForm';
import CommentReply from './commentReply';

import { get_profile_link, format_date } from '../../../../lib/helpers';

const Comment = ({ comment, onClickReply, replying, reply_value, ...props }) => {
    const profileLink = get_profile_link(
        comment.node.author.fullName, 
        comment.node.author.id
    );
    const showImage = comment.node.author.gravatarUrl !== null 
        && comment.node.author.gravatarUrl !== '';

    return (
        <ul className="collection">
            <li className="collection-item">
                <div className="comment-author row">
                    <div className="comment-author-image col s4 m1">
                        <img
                            src={showImage ? 
                                comment.node.author.gravatarUrl : '/static/default-pic.png'}
                            alt={comment.node.author.fullName}
                            className="responsive-img circle"
                        />
                    </div>
                    <div className="comment-author-info col s8 m11">
                        <Link href ={profileLink}>
                            <a title="View profile">
                                <p className="title">{comment.node.author.fullName}</p>
                            </a>
                        </Link>
                        <span className="post-meta">
                            {format_date(comment.node.timestamp)}
                        </span> -{' '}
                        <span className="post-meta">
                            <a onClick={(e) => onClickReply(e, comment.node.id)} title="reply">
                                {replying ? 'close' : 'reply'}
                            </a>
                        </span>
                    </div>
                </div>

                <div className="comment-resp">{comment.node.body}</div>

                <div className={'reply-form ' + (replying ? 'show' : null)}>
                    <CommentForm 
                        value={reply_value}
                        onChange={props.handleReplyChange}
                        placeholder="Write a reply"
                        id={'comment_reply_' + comment.node.id}
                        onPublish={props.handleSubmitReply}
                    />
                </div>
            </li>
            {comment.node.replies.edges.map((reply) => <CommentReply 
                key={reply.node.id} 
                reply={reply} />
            )}
        </ul>
    );
};

Comment.propTypes = {
    comment: types.object.isRequired,
    onClickReply: types.func.isRequired,
    replying: types.bool.isRequired,
    reply_value: types.string.isRequired,
    handleReplyChange: types.func.isRequired,
    handleSubmitReply: types.func.isRequired
};

export default Comment;