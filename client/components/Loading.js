import PropTypes from "prop-types";

// eslint-disable-next-line no-undef
import { Spinner } from "react-bootstrap";

// eslint-disable-next-line no-undef
export default class Loading extends React.Component {
  render() {
    const { variant, animation, style } = this.props;
    return (
      <div className={"centered"}>
        <Spinner
          variant={variant}
          animation={animation || "border"}
          role="status"
          style={style || {}}
        />
      </div>
    );
  }
}

Loading.propTypes = {
  variant: PropTypes.string,
  animation: PropTypes.string,
  style: PropTypes.object,
};
