import { checkPasswordStrength } from "../lib/utils";
import "./RegisterForm.css";
import { useState } from "react";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  //`strength` is based on a state variable. Don't create another state variable for this.
  const strength = checkPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (strength >= 4) {
      // We are using email as a flag to show/hide the confirmation message. There is no need to implement the email fiels as a controlled component.
      setEmail(e.target.email.value);

      // send all the data to a server
    }
  };

  return (
    <div className="formWrapper">
      <h1 className="title">{name ? `Hi, ${name}` : "Register"}</h1>
      {email ? (
        <p>
          Thank you {name}, we&apos;ve send a confirmation to {email}
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <meter max="4" low="2" high="3.5" optimum="4" value={strength} />
            <ul className="requirements">
              <li>Min 8 chars</li>
              <li>Upper and lower case</li>
              <li>At least one number</li>
              <li>A special character</li>
            </ul>
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
