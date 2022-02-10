import React from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line no-undef
import { Form, FloatingLabel } from "react-bootstrap";
// eslint-disable-next-line no-undef
export default class FormGroup extends React.Component {
  capitalize(str) {
    return (str.substring(0, 1).toUpperCase() + str.substring(1)).replace(
      /([a-z]{1})([A-Z]{1})/g,
      "$1 $2"
    );
  }

  render() {
    const { name, thiz, placeholder, as, style, divCls } = this.props;
    return (
      <div className={divCls}>
        <FloatingLabel
          controlId={name}
          label={placeholder || this.capitalize(name)}
          className={"mb-3 " + (thiz.state.errors[name] ? "errorGroup" : "")}
        >
          <Form.Control
            name={name}
            value={thiz.state[name] || ""}
            onChange={thiz.handleChange}
            onBlur={thiz.handleBlur}
            type={as ? undefined : "text"}
            as={as}
            placeholder={placeholder || this.capitalize(name)}
            style={style}
          />
        </FloatingLabel>
        {thiz.state.errors[name] && (
          <div className="input-error">{thiz.state.errors[name]}</div>
        )}
      </div>
    );
  }
}

FormGroup.propTypes = {
  name: PropTypes.string,
  thiz: PropTypes.object,
  placeholder: PropTypes.string,
  as: PropTypes.string,
  style: PropTypes.object,
  divCls: PropTypes.string,
};
