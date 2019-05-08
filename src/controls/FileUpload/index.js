/* @flow */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { AtomicBlockUtils, Modifier, EditorState } from "draft-js";

import LayoutComponent from "./Component";

class FileUploadControl extends Component {
  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object
  };

  state: Object = {
    expanded: false
  };

  componentWillMount(): void {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent: Function = (): void => {
    this.signalExpanded = !this.state.expanded;
  };

  doExpand: Function = (): void => {
    this.setState({
      expanded: true
    });
  };

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false
    });
  };

  expandCollapse: Function = (): void => {
    this.setState({
      expanded: this.signalExpanded
    });
    this.signalExpanded = false;
  };
  addLink: Function = (linkTitle, linkTarget, linkTargetOption): void => {
    const { editorState, onChange } = this.props;
    const { currentEntity } = this.state;
    let selection = editorState.getSelection();
    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end
      });
    }

    const entityKey = editorState
      .getCurrentContent()
      .createEntity("LINK", "MUTABLE", {
        url: linkTarget,
        targetOption: linkTargetOption
      })
      .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey
    );
    let newEditorState = EditorState.push(
      editorState,
      contentState,
      "insert-characters"
    );

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get("anchorOffset") + linkTitle.length,
      focusOffset: selection.get("anchorOffset") + linkTitle.length
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      " ",
      newEditorState.getCurrentInlineStyle(),
      undefined
    );
    onChange(
      EditorState.push(newEditorState, contentState, "insert-characters")
    );
    this.doCollapse();
  };

  render(): Object {
    const { config, translations } = this.props;
    const { expanded } = this.state;
    const FileComponent = config.component || LayoutComponent;
    return (
      <FileComponent
        config={config}
        translations={translations}
        onChangeLink={this.addLink}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
      />
    );
  }
}

export default FileUploadControl;