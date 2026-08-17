const Form = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = "Hello from the <Form> component";
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <header>
        <h2>Useless form</h2>
      </header>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
