import PropTypes from "prop-types";

function Greeting({ name, message = "欢迎来到字节", showIcon }) {
  console.log({ name, message, showIcon });

  return (
    <div>
      <h1>Hello {name}</h1>
      <p>{message}</p>
      {showIcon && <span>👋</span>}
    </div>
  );
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default Greeting;
