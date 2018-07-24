/**
 * ./app/js/helpers
 */

import moment from 'moment';
import sanitize from 'sanitize-html';
import cookie from 'cookie';
import gql from 'graphql-tag';
import firebase from 'firebase';
import { tokenKey } from '../keys';
import { isSameISOYear } from 'date-fns';

// utils

export const truncate = (word, length) => {
    const new_word =
        word
            .replace(/\r?\n|\r/gm, ' ')
            .split(' ')
            .splice(0, length)
            .join(' ') + ' ...';
    return word.split(' ').length < length ? word : new_word;
};

export const upload_file = async (file, onUpload, onFail, onSuccess) => {
    try {
        const store = firebase.storage();
        const ref = store.ref().child('images/' + file.name);
        const task = ref.put(file);

        task.on(firebase.storage.TaskEvent.STATE_CHANGED, onUpload, onFail, onSuccess);
        return task;
    } catch (e) {
        return null;
    }
};

export const gcd = (a, b) => {
    // greatest common divisor
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
};

export const sort_posts = (posts) => {
    const mutable_post = posts.slice(0);

    if (mutable_post !== undefined) {
        mutable_post.sort((a, b) => {
            if (a.node.timestamp > b.node.timestamp) {
                return -1;
            }
            if (a.node.timestamp < b.node.timestamp) {
                return 1;
            }
            return 0;
        });
    }

    return mutable_post;
};

export const createToast = (text) => {
    const toastHTML = `
        <div>
            <span>
                ${text}
            </span>
        </div>
    `;
    window.M.toast({
        html: toastHTML,
        displayLength: 4000
    });
};

export const isNotUndefined = (value) => {
    if (value !== null && value !== undefined) return true;
    return false;
};

export const createMarkup = (value) => {
    return {
        __html: value
    };
};

export const all_tags = ['tech', 'science', 'culture', 'art', 'media'];

// formaters

export const strip_html = (word) => {
    const new_word = word.replace(/<[^>]*>?/g, '');
    return new_word;
};

export const format_date = (server_date) => {
    let date = moment.utc(server_date).format('YYYY-MM-DD HH:mm:ss');
    let stillUtc = moment.utc(date).toDate();
    const isSameYear = isSameISOYear(new Date(date).getFullYear(), new Date().getFullYear());

    if (isSameYear) {
        return moment(stillUtc)
            .local()
            .format('MMM DD');
    }

    return moment(stillUtc)
        .local()
        .format('MMM DD YYYY');
};

// link processors

export const encodeUri = (user_url) => {
    return encodeURIComponent(
        user_url
            .toLowerCase()
            .split(' ')
            .join('-')
    );
};

export const decodeUri = (enc_uri) => {
    return decodeURIComponent(enc_uri.split('-').join(' '));
};

export const get_profile_link = (fullName) => {
    return '/profile/' + encodeUri(fullName);
};

export const get_page_link = (title) => {
    return encodeUri(title);
};

// validation

export const validate_password = (password) => {
    const regExp = new RegExp(
        '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
    );
    return regExp.test(password);
};

export const validate_html = (html) => {
    const regExp = /<[a-z][\s\S]*>/i;
    return regExp.test(html);
};

export const sanitize_html = (html) => {
    return sanitize(html);
};

// login/logout

export const checkLoggedIn = async (client) => {
    try {
        const res = await client.query({
            query: gql`
                query getUser {
                    user {
                        id
                        username
                    }
                }
            `
        });

        return await { loggedInUser: res.data };
    } catch (e) {
        return { loggedInUser: {} };
    }
};

export const logout = () => {
    try {

        document.cookie = cookie.serialize(tokenKey, '', {
            maxAge: -1,
            path: '/'
        });
    } catch (e) {
        return;
    }
};
