import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, I18nManager, Platform } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { NativeBaseProvider, extendTheme } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import AuthPages from "./app/Views/Auth/Index";
import store from "./store/store";
import Colors from "./app/Colors/Color";
import MainScreens from "./app/Index";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function App() {
  SplashScreen.preventAutoHideAsync();
  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_100Thin: require("./assets/fonts/Poppins/Poppins-Thin.ttf"),
    Poppins_200ExtraLight: require("./assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    Poppins_300Light: require("./assets/fonts/Poppins/Poppins-Light.ttf"),
    Poppins_400Regular: require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    Poppins_500Medium: require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    Poppins_600SemiBold: require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    Poppins_700Bold: require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    Poppins_800ExtraBold: require("./assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    Poppins_900Black: require("./assets/fonts/Poppins/Poppins-Black.ttf"),
  });

  const newFontTheme = {
    fontConfig: {
      Poppins: {
        100: {
          normal: "Poppins_100Thin",
        },
        200: {
          normal: "Poppins_200ExtraLight",
        },
        300: {
          normal: "Poppins_300Light",
        },
        400: {
          normal: "Poppins_400Regular",
        },
        500: {
          normal: "Poppins_500Medium",
        },
        600: {
          normal: "Poppins_600SemiBold",
        },
        700: {
          normal: "Poppins_700Bold",
        },
        800: {
          normal: "Poppins_800ExtraBold",
        },
        900: {
          normal: "Poppins_900Black",
        },
      },
    },
    fonts: {
      heading: "Poppins",
      body: "Poppins",
      mono: "Poppins",
    },
  };

  const theme = extendTheme({ ...newFontTheme });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch((error: any) => {
        console.warn("Error hiding splash screen:", error);
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
        <GestureHandlerRootView style={{ flex: 1 }}> {/* Moved to root */}
      <Provider store={store}>
        <SafeAreaProvider>
          <NativeBaseProvider theme={theme}>
            <NavigationContainer theme={MyTheme}>
              <StatusBar style="auto" />
              <MainScreens />
            </NavigationContainer>
          </NativeBaseProvider>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
