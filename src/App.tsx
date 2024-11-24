import { Provider } from "react-redux";
import { persistor, store } from "./redux/app/store";
import Home from "./components/Home/Home";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Home />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
