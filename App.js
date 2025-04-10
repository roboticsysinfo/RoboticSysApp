import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { COLORS } from "./theme";
import Toast from 'react-native-toast-message';
import StayTimerProvider from "./src/components/StayTimerProvider";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primaryColor,       // Focused border & label color
    background: 'white',   // Background color
    text: 'black',         // Text color
    placeholder: 'gray',   // Placeholder color
    underlineColor: 'red', // Underline color for flat mode
  },
};


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <StayTimerProvider /> 
          <AppNavigator />
          <Toast />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

