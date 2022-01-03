import PropTypes from "prop-types";

// eslint-disable-next-line no-undef
const { Spinner } = ReactBootstrap;

// eslint-disable-next-line no-undef
export default class Loading extends React.Component {
  render() {
    const { variant, animation } = this.props;
    return (
      <div className={"centered"}>
        <Spinner
          variant={variant}
          animation={animation || "border"}
          role="status"
        ></Spinner>
      </div>
    );
  }
}

Loading.propTypes = {
  variant: PropTypes.string,
  animation: PropTypes.string,
};
