import "./RegisterForm.css";
import { useState } from "react";

const RegisterForm = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    // name, email and pwd could be sent to a server here...

    // Only the name and email in the state, we need this for the confirmation.
    setName(e.target.name.value);
    setEmail(e.target.email.value);
  };

  return (
    <div className="formWrapper">
      <h1 className="title">Register</h1>
      {name ? (
        <p>
          Thank you {name}, we&apos;ve send a confirmation to {email}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" required />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" className="submitButton">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;
