import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Home';
import Canvas from './src/Canvas';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Canvas" component={Canvas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
