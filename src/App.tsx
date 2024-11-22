import { Provider } from "react-redux";
import { store } from "./redux/app/store";
import Home from "./components/Home/Home";

function App() {
  return (
    <>
      <Provider store={store}>
        <Home />
      </Provider>
    </>
  );
}

export default App;
