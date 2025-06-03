import { Stack, View, Pressable, Text } from "native-base";
import React, { useState, useEffect } from "react";
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
import { Animated, Easing, ActivityIndicator } from 'react-native';
import MyWallet from "./Wallet/Index";
import Upgrade from "./Upgrade/Upgrade";
import Profile from "./Profile/Index";
import { miningService } from '../../../app/services/api';
import { useToast } from 'native-base';

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

interface MiningStatus {
  isActive: boolean;
  startTime?: string;
  remainingTime?: number;
  currentRate?: number;
}

const Tab = createBottomTabNavigator<TabParamList>();

const MiningAppTabs: React.FC = () => {
  const [focusedTab, setFocusedTab] = useState<string>("");
  const dispatch = useDispatch();
  const toast = useToast();
  const { isMining } = useSelector((state: RootState) => state.mining);
  const { selectedCoin } = useSelector((state: RootState) => state.coin);
  const [buttonScale] = useState(new Animated.Value(1));
  const [miningStatus, setMiningStatus] = useState<MiningStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial mining status
    fetchMiningStatus();

    // Poll mining status every 30 seconds while active
    let interval: NodeJS.Timeout | null = null;
    if (isMining) {
      interval = setInterval(fetchMiningStatus, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMining]);

  const fetchMiningStatus = async () => {
    try {
      setLoading(true);
      const response = await miningService.getMiningStatus();
      console.log('Mining status response:', response);
      const status: MiningStatus = {
        isActive: response.isActive || false,
        startTime: response.startTime,
        remainingTime: response.remainingTime,
        currentRate: response.currentRate,
      };
      setMiningStatus(status);

      // Sync Redux state with backend
      if (status.isActive && !isMining) {
        dispatch(startMining());
      } else if (!status.isActive && isMining) {
        dispatch(stopMining());
      }
    } catch (error: any) {
      console.error('Error fetching mining status:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.show({
        title: "Error",
        description: "Failed to fetch mining status. Please try again.",
        variant: "solid",
        bg: "error.500",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (name: string) => {
    if (focusedTab !== name) {
      setFocusedTab(name);
    }
  };

  const handleMiningToggle = async () => {
    if (loading) return; // Prevent multiple clicks during loading

    try {
      setLoading(true);

      // Check if a coin is selected
      if (!selectedCoin) {
        toast.show({
          title: "Error",
          description: "Please select a coin before starting mining",
          variant: "solid",
          bg: "error.500",
        });
        return;
      }

      // Validate selectedCoin
      const validCoins = ['BTS', 'JHS']; // Update based on backend-supported coins
      if (!validCoins.includes(selectedCoin)) {
        toast.show({
          title: "Error",
          description: `Invalid coin: ${selectedCoin}. Please select BTS or JHS.`,
          variant: "solid",
          bg: "error.500",
        });
        return;
      }

      // Animate button press
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

      // Fetch latest status before toggling
      const status = await miningService.getMiningStatus();
      console.log('Pre-toggle mining status:', status);
      const isActive = status.isActive || false;

      if (isActive) {
        // Stop mining
        const stopResponse = await miningService.stopMining();
        console.log('Stop mining response:', stopResponse);
        dispatch(stopMining());
        setMiningStatus({ isActive: false });
        toast.show({
          title: "Success",
          description: stopResponse.message || "Mining stopped successfully",
          variant: "solid",
          bg: "success.500",
        });
      } else {
        // Start mining
        console.log('Starting mining for coin:', selectedCoin);
        const startResponse = await miningService.startMining(selectedCoin);
        console.log('Start mining response:', startResponse);
        dispatch(startMining());
        setMiningStatus({
          isActive: true,
          startTime: new Date().toISOString(),
          remainingTime: startResponse.remainingTime || 18000000, // Default to 5 hours
          currentRate: startResponse.currentRate || 1.0,
        });
        toast.show({
          title: "Success",
          description: startResponse.message || "Mining started successfully",
          variant: "solid",
          bg: "success.500",
        });
      }
    } catch (error: any) {
      console.error('Mining toggle error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "An error occurred";
      if (error.message === 'Invalid coin symbol. Please select a valid coin.') {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.show({
        title: "Error",
        description: errorMessage,
        variant: "solid",
        bg: "error.500",
      });
    } finally {
      setLoading(false);
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
      component: MyWallet,
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
        tabBarIconStyle: { position: "center" },
        animationDuration: 0,
      }}
    >
      {screens.slice(0, 2).map((screen, index) => (
        <Tab.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.options,
            tabBarIcon: ({ focused, color, size }) =>
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
                isDisabled={loading}
                style={{
                  position: 'absolute',
                  top: -35,
                  alignSelf: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 12,
                  shadowOpacity: 0.25,
                  shadowColor: Colors.border,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 8,
                  borderWidth: 2,
                  borderColor: Colors.border,
                  zIndex: 1000,
                }}
              >
                <LinearGradient
                  colors={isMining ? [Colors.danger, '#B91C1C'] : [Colors.primary, Colors.secondary]}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.buttonText} />
                  ) : (
                    <AntDesign
                      name={isMining ? 'pausecircle' : 'rocket1'}
                      size={32}
                      color={Colors.buttonText}
                    />
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      {screens.slice(2).map((screen, index) => (
        <Tab.Screen
          key={index + 2}
          name={screen.name}
          component={screen.component}
          options={{
            ...screen.options,
            tabBarIcon: ({ focused, color, size }) =>
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