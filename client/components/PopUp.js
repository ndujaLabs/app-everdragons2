import { Modal, Button } from "react-bootstrap";
// eslint-disable-next-line no-undef
import PropTypes from "prop-types";
import Base from "./Base";
export default class PopUp extends Base {
  render() {
    const { title, body, size, handleClose } = this.props.modals;

    return (
      <Modal
        show={true}
        onHide={handleClose}
        size={size}
        autoFocus
        aria-labelledby={"contained-modal-title-vcenter"}
        centered={false}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant={"success"} onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PopUp.propTypes = {
  title: PropTypes.string,
  body: PropTypes.object,
  size: PropTypes.string,
  handleClose: PropTypes.func,
};
