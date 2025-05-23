import React, { useEffect } from 'react';
import {  StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuthPages from './Views/Auth/Index';
import MiningAppTabs from './Views/AppScreens/Index';

const MainScreens = () => {
  const passHome = useSelector((state: RootState) => state.passHome.value);


  return passHome ? <MiningAppTabs /> : <AuthPages />;
};

const styles = StyleSheet.create({});

export default MainScreens;