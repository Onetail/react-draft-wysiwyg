/* @flow */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Option from "../../../components/Option";
import Spinner from "../../../components/Spinner";
import "./styles.css";

class LayoutComponent extends Component {
  static propTypes: Object = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    doCollapse: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    translations: PropTypes.object
  };

  state: Object = {
    fileSrc: "",
    fileName: "",
    dragEnter: false,
    uploadHighlighted:
      this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
    showFileUploadLoading: false,
    alt: ""
  };

  componentWillReceiveProps(props: Object): void {
    if (this.props.expanded && !props.expanded) {
      this.setState({
        fileSrc: "",
        dragEnter: false,
        uploadHighlighted:
          this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
        showFileUploadLoading: false
      });
    } else if (
      props.config.uploadCallback !== this.props.config.uploadCallback ||
      props.config.uploadEnabled !== this.props.config.uploadEnabled
    ) {
      this.setState({
        uploadHighlighted:
          props.config.uploadEnabled && !!props.config.uploadCallback
      });
    }
  }

  onDragEnter: Function = (event: Object): void => {
    this.stopPropagation(event);
    this.setState({
      dragEnter: true
    });
  };

  onFileUploadDrop: Function = (event: Object): void => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      dragEnter: false
    });

    // Check if property name is files or items
    // IE uses 'files' instead of 'items'
    let data;
    let dataIsItems;
    if (event.dataTransfer.items) {
      data = event.dataTransfer.items;
      dataIsItems = true;
    } else {
      data = event.dataTransfer.files;
      dataIsItems = false;
    }
    for (let i = 0; i < data.length; i += 1) {
      if (!dataIsItems || data[i].kind === "file") {
        const file = dataIsItems ? data[i].getAsFile() : data[i];
        this.uploadFileUpload(file);
      }
    }
  };

  showFileUploadUploadOption: Function = (): void => {
    this.setState({
      uploadHighlighted: true
    });
  };

  addFileUploadFromState: Function = (): void => {
    const { fileSrc, fileName } = this.state;
    const { onChangeLink } = this.props;
    // 插入链接
    onChangeLink(fileName, fileSrc, "_blank");
  };

  showFileUploadURLOption: Function = (): void => {
    this.setState({
      uploadHighlighted: false
    });
  };

  toggleShowFileUploadLoading: Function = (): void => {
    const showFileUploadLoading = !this.state.showFileUploadLoading;
    this.setState({
      showFileUploadLoading
    });
  };

  updateValue: Function = (event: Object): void => {
    this.setState({
      [`${event.target.name}`]: event.target.value
    });
  };

  selectFileUpload: Function = (event: Object): void => {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadFileUpload(event.target.files[0]);
    }
  };

  uploadFileUpload: Function = (file: Object): void => {
    this.toggleShowFileUploadLoading();
    const { uploadCallback } = this.props.config;

    uploadCallback(file)
      .then(({ data }) => {
        this.setState({
          showFileUploadLoading: false,
          dragEnter: false,
          fileSrc: data.link || data.url,
          fileName: data.name
        });
        this.fileUpload = false;
      })
      .catch(() => {
        this.setState({
          showFileUploadLoading: false,
          dragEnter: false
        });
      });
  };

  fileUploadClick = event => {
    this.fileUpload = true;
    event.stopPropagation();
  };

  stopPropagation: Function = (event: Object): void => {
    if (!this.fileUpload) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.fileUpload = false;
    }
  };

  renderAddFileUploadModal(): Object {
    const {
      fileSrc,
      fileName,
      uploadHighlighted,
      showFileUploadLoading,
      dragEnter
    } = this.state;
    const {
      config: {
        popupClassName,
        uploadCallback,
        uploadEnabled,
        urlEnabled,
        previewFileUpload,
        inputAccept,
        alt: altConf
      },
      doCollapse,
      translations
    } = this.props;
    return (
      <div
        className={classNames("rdw-file-modal", popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="rdw-file-modal-header">
          {uploadEnabled &&
            uploadCallback && (
              <span
                onClick={this.showFileUploadUploadOption}
                className="rdw-file-modal-header-option"
              >
                {translations["components.controls.image.fileUpload"]}
                <span
                  className={classNames("rdw-file-modal-header-label", {
                    "rdw-file-modal-header-label-highlighted": uploadHighlighted
                  })}
                />
              </span>
            )}
          {urlEnabled && (
            <span
              onClick={this.showFileUploadURLOption}
              className="rdw-file-modal-header-option"
            >
              {translations["components.controls.image.byURL"]}
              <span
                className={classNames("rdw-file-modal-header-label", {
                  "rdw-file-modal-header-label-highlighted": !uploadHighlighted
                })}
              />
            </span>
          )}
        </div>
        {uploadHighlighted ? (
          <div onClick={this.fileUploadClick}>
            <div
              onDragEnter={this.onDragEnter}
              onDragOver={this.stopPropagation}
              onDrop={this.onFileUploadDrop}
              className={classNames("rdw-file-modal-upload-option", {
                "rdw-file-modal-upload-option-highlighted": dragEnter
              })}
            >
              <label
                htmlFor="file"
                className="rdw-file-modal-upload-option-label"
              >
                {previewFileUpload && fileSrc ? (
                  <a
                    style={{ width: "100%", wordBreak: "break-all" }}
                    href={fileSrc}
                  >
                    {fileName}
                  </a>
                ) : (
                  translations["components.controls.image.dropFileText"]
                )}
              </label>
            </div>
            <input
              type="file"
              id="file"
              accept={inputAccept}
              onChange={this.selectFileUpload}
              className="rdw-file-modal-upload-option-input"
            />
          </div>
        ) : (
          <div className="rdw-file-modal-url-section">
            <input
              className="rdw-file-modal-url-input"
              placeholder={translations["components.controls.image.enterlink"]}
              name="fileSrc"
              onChange={this.updateValue}
              onBlur={this.updateValue}
              value={fileSrc}
            />
            <span className="rdw-file-mandatory-sign">*</span>
          </div>
        )}

        <span className="rdw-file-modal-btn-section">
          <button
            className="rdw-file-modal-btn"
            onClick={this.addFileUploadFromState}
            disabled={!fileSrc || (altConf.mandatory && !alt)}
          >
            {translations["generic.add"]}
          </button>
          <button className="rdw-file-modal-btn" onClick={doCollapse}>
            {translations["generic.cancel"]}
          </button>
        </span>
        {showFileUploadLoading ? (
          <div className="rdw-file-modal-spinner">
            <Spinner />
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  }

  render(): Object {
    const {
      config: { icon, className, title },
      expanded,
      onExpandEvent,
      translations
    } = this.props;
    return (
      <div
        className="rdw-file-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-file-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
          title={title || translations["components.controls.image.image"]}
        >
          <img src={icon} alt="" />
        </Option>
        {expanded ? this.renderAddFileUploadModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;
