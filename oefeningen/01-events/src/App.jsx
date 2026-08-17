import "./App.css";
import Form from "./components/Form";

function App() {
  const handleLogEventClick = (e) => {
    console.log("Log Event:", e);
  };

  const handleLogParameterClick = (param) => {
    console.log("Log Parameter:", param);
  };

  const handleLogEventAndParameterClick = (e, param) => {
    console.log("Log Event + Parameter:", e.type, param);
  };

  const handleFormSubmit = (value) => {
    console.log("Submitted form value: ", value);
  };

  return (
    <div className="App">
      <button onClick={handleLogEventClick}>Log Event</button>

      <button onClick={() => handleLogParameterClick("James")}>
        Log parameter
      </button>

      <button onClick={(e) => handleLogEventAndParameterClick(e, "James")}>
        Log event + parameter
      </button>

      <Form onSubmit={handleFormSubmit} />
    </div>
  );
}

export default App;
