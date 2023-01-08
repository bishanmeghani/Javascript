import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home';
import ReviewDetails from '../screens/reviewDetails';
import Header from '../shared/header';
import React from 'react';

const screens = {
    Home: {
        screen: Home, 
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: () => <Header navigation={navigation} title='GameZone'/>, 
            }
        }
    }, 
    ReviewDetails: {
        screen: ReviewDetails, 
       
    }
}

const HomeStack = createStackNavigator(screens, { defaultNavigationOptions: {headerTintColor: 'white', headerStyle: {backgroundColor: '#f0f', height: 100}}})

export default HomeStack;
