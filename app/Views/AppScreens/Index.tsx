import { Stack, View, Pressable } from "native-base";
import React, { useState } from "react";
import { Text } from "native-base";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { startMining, stopMining } from '../../../store/miningSlice';
import Colors from "../../Colors/Color";
import Home from "./Home/Index";
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from 'react-native';
import Wallet from "./Wallet/Wallet";
import Upgrade from "./Upgrade/Upgrade";
import Profile from "./Profile/Index";

type TabParamList = {
  Home: undefined;
  Wallet: undefined;
  MineButton: undefined;
  Upgrade: undefined;
  Profile: undefined;
};

interface Screen {
  name: keyof TabParamList;
  component: React.FC<any>;
  icon: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  options?: BottomTabNavigationOptions;
}

const Tab = createBottomTabNavigator<TabParamList>();

const MiningAppTabs: React.FC = () => {
  const [focusedTab, setFocusedTab] = useState<string>("");
  const dispatch = useDispatch();
  const { isMining } = useSelector((state: RootState) => state.mining);
  const [buttonScale] = useState(new Animated.Value(1));

  const handleTabPress = (name: string) => {
    if (focusedTab !== name) {
      setFocusedTab(name);
    }
  };

  const handleMiningToggle = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    if (isMining) {
      dispatch(stopMining());
    } else {
      dispatch(startMining());
    }
  };

  const commonTabBarStyle = {
    height: 80,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 6,
    shadowOpacity: 0.15,
    shadowColor: Colors.border,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    paddingTop: 12,
    paddingHorizontal: 16,
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  };

  const tabBarItemStyle = {
    paddingVertical: 10,
    marginBottom: 8,
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  const screens: Screen[] = [
    {
      name: "Home",
      component: Home,
      icon: ({ focused, color, size }) => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 4,
          }}
        >
          <Ionicons
            name="home"
            size={24}
            color={focused ? Colors.primary : Colors.muted}
          />
          <Text
            style={{
              color: focused ? Colors.primary : Colors.muted,
              fontWeight: "600",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Home
          </Text>
        </View>
      ),
    },
    {
      name: "Wallet",
      component: Wallet,
      icon: ({ focused, color, size }) => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 4,
          }}
        >
          <Ionicons
            name="wallet"
            size={24}
            color={focused ? Colors.primary : Colors.muted}
          />
          <Text
            style={{
              color: focused ? Colors.primary : Colors.muted,
              fontWeight: "600",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Wallet
          </Text>
        </View>
      ),
    },
    {
      name: "Upgrade",
      component: Upgrade,
      icon: ({ focused, color, size }) => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 4,
          }}
        >
          <AntDesign
            name="rocket1"
            size={24}
            color={focused ? Colors.primary : Colors.muted}
          />
          <Text
            style={{
              color: focused ? Colors.primary : Colors.muted,
              fontWeight: "600",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Upgrade
          </Text>
        </View>
      ),
    },
    {
      name: "Profile",
      component: Profile,
      icon: ({ focused, color, size }) => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 4,
          }}
        >
          <Ionicons
            name="person"
            size={24}
            color={focused ? Colors.primary : Colors.muted}
          />
          <Text
            style={{
              color: focused ? Colors.primary : Colors.muted,
              fontWeight: "600",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            Profile
          </Text>
        </View>
      ),
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: commonTabBarStyle,
        tabBarLabel: () => null,
        headerShown: false,
        tabBarIconStyle: { position: "relative" },
        animation: 'none',
      }}
    >
      {screens.slice(0, 2).map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.options,
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) =>
              screen.icon({ focused, color, size }),
          }}
          listeners={{
            tabPress: () => handleTabPress(screen.name),
          }}
        />
      ))}
      <Tab.Screen
        name="MineButton"
        component={Home}
        options={{
          tabBarButton: () => (
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Pressable
                onPress={handleMiningToggle}
                style={{
                  position: "absolute",
                  top: -35,
                  alignSelf: "center",
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 12,
                  shadowOpacity: 0.25,
                  shadowColor: Colors.border,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 8,
                  borderWidth: 2,
                  borderColor: Colors.surface,
                  zIndex: 1000,
                }}
              >
                <LinearGradient
                  colors={isMining ? [Colors.danger, '#B91C1C'] : [Colors.primary, Colors.secondary]}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AntDesign
                    name={isMining ? "pausecircle" : "rocket1"}
                    size={32}
                    color={Colors.buttonText}
                  />
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ),
          tabBarStyle: { display: "none" },
        }}
      />
      {screens.slice(2).map((screen, index) => (
        <Tab.Screen
          key={index + 2}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.options,
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) =>
              screen.icon({ focused, color, size }),
          }}
          listeners={{
            tabPress: () => handleTabPress(screen.name),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MiningAppTabs;