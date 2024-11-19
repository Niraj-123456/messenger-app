import RootContainer from "./components/messenger/RootContainer";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <RootContainer />
      </Provider>
    </>
  );
}

export default App;
