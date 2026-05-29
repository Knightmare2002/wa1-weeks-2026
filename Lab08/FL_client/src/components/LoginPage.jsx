import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { doLogin } from '../api/auth'

function LoginPage(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const validate = () => {
    const newErrors = { email: "", password: "", form: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email obbligatoria";
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Formato email non valido";
        isValid = false;
      }
    }

    if (!password.trim()) {
      newErrors.password = "Password obbligatoria";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      // non mando la richiesta al server se il form è invalido (come richiede il lab)
      return;
    }

    try {
      const user = await doLogin(email, password)
      props.onLogin(user)
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        form: 'Email o password non corretti'
      }))
    }
  };

  return (
    <>
      <h2>Login</h2>

      {errors.form && (
        <div className="alert alert-danger">
          {errors.form}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            isInvalid={errors.email !== ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            isInvalid={errors.password !== ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}

export default LoginPage;