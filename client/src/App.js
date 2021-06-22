import "bootstrap/dist/css/bootstrap.min.css"; //min: minimum version for faster responsive;
import Login from "./Login";
import Dashboard from "./Dashboard";

//window.location.search : to grab the portion of the code after the "?"
// .get("code"): to make the portion after the "?" the "code"
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  //   // // TERNARY expression :
  //   // If we have a code ("?"), then render out the Dashboard component.
  //   we want to pass it into the code we have. Otherwise (":"), want to render Login component
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
