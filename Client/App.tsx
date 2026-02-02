import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native'; // לגיבוי
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ייבוא המסכים - שים לב לנתיבים! 
// אם יש שגיאה, ודא שהקבצים באמת שם
import HomeScreen from './src/screens/screens/HomeScreen';
import LoginScreen from './src/screens/screens/LoginScreen';
import RegisterScreen from './src/screens/screens/RegisterScreen';

import MenuScreen from './src/screens/screens/MenuScreen';
import MyGroups from './src/screens/screens/MyGroups';
import GroupDetailScreen from './src/screens/screens/GroupDetailScreen';
import MenuNew from './src/screens/screens/MenuNew';
import CreatePostScreen from './src/screens/screens/CreatePostScreen'; // המסך החדש
import GlobalFeedScreen from './src/screens/screens/GlobalFeedScreen'; // המסך החדש

import CreateGroupScreen from './src/screens/screens/CreateGroupScreen'; // המסך החדש

// ואז בתוך ה-Stack:
const Stack = createStackNavigator();

export default function App() {
  try {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
             <Stack.Screen name="MyGroups" component={MyGroups} options={{ headerShown: true, title: 'הקבוצות שלי' }} />
         <Stack.Screen name="GroupDetailScreen" component={ GroupDetailScreen} />
           {/* מסך יצירת פוסט סטגנוגרפי */}
        <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'יצירת פוסט חדש' }} />
        {/* השורה שחסרה לך: */}
  <Stack.Screen 
    name="CreateGroup" 
    component={CreateGroupScreen} 
    options={{ title: 'יצירת קבוצה חדשה' }} 
  />
        {/* מסך הפיד (עולם או קבוצה) */}
        <Stack.Screen name="GlobalFeed" component={GlobalFeedScreen} options={{ title: 'צפייה בפוסטים' }} />
{/* <Stack.Screen name="MenuNew" component={MenuNew}/> */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  } catch (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>שגיאה בטעינת הניווט: </Text>
      </View>
    );
  }
}
