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
import MenuScreen from './src/screens/screens/MenuScreen';
import MyGroups from './src/screens/screens/MyGroups';
import GroupDetailScreen from './src/screens/screens/GroupDetailScreen';


// במקום הייבוא מלמעלה, שים את זה זמנית בתוך App.js מעל function App
const MenuScreenTest = () => (
  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
    <Text>בדיקת תפריט</Text>
  </View>
);

// ואז בתוך ה-Stack:
// ואז בתוך ה-Stack:
const Stack = createStackNavigator();

export default function App() {
  try {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
             <Stack.Screen name="MyGroups" component={MyGroups} options={{ headerShown: true, title: 'הקבוצות שלי' }} />
         <Stack.Screen name="GroupDetailScreen" component={ GroupDetailScreen} />

           

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
// import 'react-native-gesture-handler';




// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// // ייבוא המסכים
// import HomeScreen from './src/screens/screens/HomeScreen';
// import LoginScreen from './src/screens/screens/LoginScreen';
// import RegisterScreen from './src/screens/screens/RegisterScreen';
// import MenuScreen from './src/screens/screens/MenuScreen';
// import MyGroups from './src/screens/screens/MyGroups';
// import GroupDetailScreen from './src/screens/screens/GroupDetailScreen';

// // הגדרת סוגי המסכים עבור הניווט (TypeScript)
// export type RootStackParamList = {
//   Home: undefined;
//   Login: undefined;
//   Register: undefined;
//   Menu: undefined;
//   MyGroups: undefined;
//   GroupDetail: { groupName: string };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator 
//           initialRouteName="Home" 
//           screenOptions={{ headerShown: false }}
//         >
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//           <Stack.Screen name="Menu" component={MenuScreen} />
//           <Stack.Screen name="MyGroups" component={MyGroups} />
//           <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }


// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// // ייבוא המסכים - ודא שהנתיבים האלו נכונים ב-100%
// import HomeScreen from './src/screens/screens/HomeScreen';
// import LoginScreen from './src/screens/screens/LoginScreen';
// import RegisterScreen from './src/screens/screens/RegisterScreen';
// import MenuScreen from './src/screens/screens/MenuScreen'; 
// import MyGroupsScreen from './src/screens/screens/MyGroups';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
          
//           {/* שים לב: name="Menu" ולא "MenuScreen" כדי למנוע בלבול */}
//           <Stack.Screen name="Menu" component={MenuScreen} />
          
//           <Stack.Screen name="MyGroups" component={MyGroupsScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }

// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// // ייבוא המסכים - שים לב לנתיב הכפול (screens/screens) כפי שכתבת קודם
// import HomeScreen from './src/screens/screens/HomeScreen';
// import LoginScreen from './src/screens/screens/LoginScreen';
// import RegisterScreen from './src/screens/screens/RegisterScreen';
// import MenuScreen from './src/screens/screens/MenuScreen';
// import MyGroupsScreen from './src/screens/screens/MyGroups';

// const Stack = createStackNavigator();

// export default function App() {
//  console.log('SCREENS CHECK', {
//   HomeScreen,
//   LoginScreen,
//   RegisterScreen,
//   MenuScreen,
//   MyGroupsScreen,
// });


//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//           <Stack.Screen name="Menu" component={MenuScreen} />
//           <Stack.Screen name="MyGroups" component={MyGroupsScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }
// import 'react-native-gesture-handler';
// import React from 'react';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// // ייבוא המסכים
// import HomeScreen from './src/screens/screens/HomeScreen';
// import LoginScreen from './src/screens/screens/LoginScreen';
// import RegisterScreen from './src/screens/screens/RegisterScreen';
// import MenuScreen from './src/screens/screens/MenuScreen';
// import MyGroupsScreen from './src/screens/screens/MyGroups';

// // --- שלב החקירה: הדפסת הערכים לטרמינל ---
// console.log("--- בדיקת תקינות מסכים ---");
// console.log("Home:", typeof HomeScreen !== 'undefined' ? "✅ תקין" : "❌ undefined!");
// console.log("Login:", typeof LoginScreen !== 'undefined' ? "✅ תקין" : "❌ undefined!");
// console.log("Menu:", typeof MenuScreen !== 'undefined' ? "✅ תקין" : "❌ undefined!");
// console.log("MyGroups:", typeof MyGroupsScreen !== 'undefined' ? "✅ תקין" : "❌ undefined!");
// console.log("------------------------");

// const Stack = createStackNavigator();

// // קומפוננטת הגנה במקרה של קריסה
// const ErrorFallback = ({ message }: { message: string }) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fee' }}>
//     <Text style={{ color: 'red', fontWeight: 'bold' }}>שגיאת טעינה בקובץ App.tsx:</Text>
//     <Text>{message}</Text>
//   </View>
// );

// export default function App() {
//   // בדיקה אחרונה לפני הרנדור
//   if (!MenuScreen) return <ErrorFallback message="הקובץ MenuScreen לא יובא כראוי (Undefined)" />;
//   if (!HomeScreen) return <ErrorFallback message="הקובץ HomeScreen לא יובא כראוי (Undefined)" />;

//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Home">
//           <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//           <Stack.Screen name="Menu" component={MenuScreen} />
//           <Stack.Screen name="MyGroups" component={MyGroupsScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// }