import React from "react";


const ConfirmationModal = ({
  isVisible = false,
  title = "Modal Title",
  content = "One fine body&hellip;",
  okText = "Save changes",
  cancelText = "Close",
  onOk = () => {},
  onCancel = () => {},
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal bs-example-modal" >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
              >
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <p>{content}</p>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOk}
              >
                {okText}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
