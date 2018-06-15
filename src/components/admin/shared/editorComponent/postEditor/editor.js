/**
 * ./src/components/admin/new-post/view/editor
 */

import React, { Component } from 'react';
import types from 'prop-types';
import Editor from 'draft-js-plugins-editor';
import { EditorState, RichUtils, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import draftToHtml from 'draftjs-to-html';
import { Controls } from './controls';
import { validate_html } from '../../../../../js/helpers';

export default class ContentEditor extends Component {
    constructor(props) {
        super(props);

        const supported_styles = {
            block: ['CODE', 'blockquote', 'header-two', 'header-three', 'unordered-list-item']
        };

        this.state = {
            editorState: EditorState.createEmpty(),
            plugins: [createMarkdownPlugin({ features: supported_styles })]
        };
        this.editor = React.createRef();

        const updated_editor = this.updateEditorState(props);

        this.state = {
            ...this.state,
            editorState: updated_editor.editorState
        };
    }
    updateEditorState = (props) => {
        let contentState;
        let editorState;

        if (props.init_body !== null) {
            if (validate_html(props.init_body)) {
                const blockFromHtml = convertFromHTML(props.init_body);

                if (blockFromHtml !== null) {
                    contentState = ContentState.createFromBlockArray(
                        blockFromHtml.contentBlocks,
                        blockFromHtml.entityMap
                    );
                }
            } else {
                contentState = ContentState.createFromText(props.init_body);
            }

            editorState = EditorState.push(this.state.editorState, contentState);
            editorState = EditorState.moveFocusToEnd(editorState);

            return {
                editorState
            };
        }
    }
    componentDidUpdate(old_props){
        if( old_props.init_body !== this.props.init_body ) {
            this.setState({
                editorState: this.updateEditorState(this.props).editorState
            });
        }
    }
    onChange = (editorState) => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const html = draftToHtml(rawContentState);

        this.setState({
            editorState
        });

        this.props.onChange(html);
    };
    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    };
    toggleCommand = (command, type) => {
        if (type == 'block') {
            this.onChange(RichUtils.toggleBlockType(this.state.editorState, command));
        } else if (type == 'inline') {
            this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, command));
        }
    };
    render() {
        return (
            <div className="editor-input" onClick={this.editorFocus}>
                <Controls editorState={this.state.editorState} onToggle={this.toggleCommand} />
                <Editor
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    ref={this.editor}
                    plugins={this.state.plugins}
                    placeholder="Tell your amazing story..."
                    spellCheck
                />
            </div>
        );
    }
}

ContentEditor.propTypes = {
    onChange: types.func.isRequired,
    init_body: types.string
};
