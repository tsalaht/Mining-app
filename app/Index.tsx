import React, { useEffect } from 'react';
import {  StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import AuthPages from './Views/Auth/Index';
import MiningAppTabs from './Views/AppScreens/Index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPassHome } from '../store/PassHomeSlice';

const MainScreens = () => {
  const dispatch = useDispatch();
  const passHome = useSelector((state: RootState) => state.passHome.value);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          dispatch(setPassHome(true));
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, [dispatch]);

  return passHome ? <MiningAppTabs /> : <AuthPages />;
};

const styles = StyleSheet.create({});

export default MainScreens;