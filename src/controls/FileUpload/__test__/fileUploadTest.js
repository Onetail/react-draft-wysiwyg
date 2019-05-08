/* @flow */

import React from "react";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import { expect, assert } from "chai";
import { mount } from "enzyme";

import FileUploadControl from "..";
import defaultToolbar from "../../../config/defaultToolbar";
import ModalHandler from "../../../event-handler/modals";
import localeTranslations from "../../../i18n";

describe("FileUploadControl test suite", () => {
  const contentBlocks = convertFromHTML("<div>test</div>");
  const contentState = ContentState.createFromBlockArray(contentBlocks);
  const editorState = EditorState.createWithContent(contentState);

  it("should have a div when rendered", () => {
    expect(
      mount(
        <FileUploadControl
          onChange={() => {}}
          editorState={editorState}
          config={defaultToolbar.image}
          translations={localeTranslations.en}
          modalHandler={new ModalHandler()}
        />
      )
        .html()
        .startsWith("<div")
    ).to.equal(true);
  });

  it("should have 1 child element by default", () => {
    const control = mount(
      <FileUploadControl
        onChange={() => {}}
        editorState={editorState}
        config={defaultToolbar.image}
        translations={localeTranslations.en}
        modalHandler={new ModalHandler()}
      />
    );
    expect(control.children().length).to.equal(1);
  });

  it.skip("should set signalExpanded to true when option is clicked", () => {
    const control = mount(
      <FileUploadControl
        onChange={() => {}}
        editorState={editorState}
        config={defaultToolbar.image}
        translations={localeTranslations.en}
        modalHandler={new ModalHandler()}
      />
    );
    const fileUploadControl = control.find("FileUploadControl");
    assert.isNotTrue(fileUploadControl.node.signalExpanded);
    control.find("Option").simulate("click");
    assert.isTrue(fileUploadControl.node.signalExpanded);
  });
});