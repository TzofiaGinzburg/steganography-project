// // // // // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // // // // import { 
// // // // // // // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // // // // // // //   ScrollView, Animated, ActivityIndicator 
// // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // // // // // import { BASE_URL } from '../api/Constants';
// // // // // // // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // // // // // // //   // קבלת שם המשתמש מהתחברות
// // // // // // // // // // // //   const { userName } = route.params || { userName: 'אורח' };
// // // // // // // // // // // //   const MY_IP = '192.168.1.XXX'; // <--- שנה ל-IP שלך!

// // // // // // // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // //   const blinkAnim = useRef(new Animated.Value(1)).current;

// // // // // // // // // // // //   // 1. פונקציה למשיכת הזמנות מהשרת
// // // // // // // // // // // //   const fetchInvitations = async () => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const response = await fetch(`${BASE_URL}/invitations/${userName}`);
// // // // // // // // // // // //       if (response.ok) {
// // // // // // // // // // // //         const data = await response.json();
// // // // // // // // // // // //         setInvitations(data);
// // // // // // // // // // // //         if (data.length > 0) startBlinking();
// // // // // // // // // // // //       }
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   // 2. אנימציית הבהוב
// // // // // // // // // // // //   const startBlinking = () => {
// // // // // // // // // // // //     Animated.loop(
// // // // // // // // // // // //       Animated.sequence([
// // // // // // // // // // // //         Animated.timing(blinkAnim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
// // // // // // // // // // // //         Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
// // // // // // // // // // // //       ])
// // // // // // // // // // // //     ).start();
// // // // // // // // // // // //   };

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     fetchInvitations();
// // // // // // // // // // // //     const interval = setInterval(fetchInvitations, 15000); // בדיקה כל 15 שניות
// // // // // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // // // // //   }, []);

// // // // // // // // // // // //   // 3. אישור הזמנה
// // // // // // // // // // // //   const handleAcceptInvite = async (inviteId: string) => {
// // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
// // // // // // // // // // // //         method: 'POST'
// // // // // // // // // // // //       });
// // // // // // // // // // // //       if (response.ok) {
// // // // // // // // // // // //         Alert.alert("הצלחה!", "הצטרפת לקבוצה בהצלחה.");
// // // // // // // // // // // //         fetchInvitations();
// // // // // // // // // // // //       } else {
// // // // // // // // // // // //         Alert.alert("שגיאה", "לא ניתן היה לאשר את ההזמנה.");
// // // // // // // // // // // //       }
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       Alert.alert("שגיאה", "בעיית תקשורת עם השרת.");
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const showInviteAlert = () => {
// // // // // // // // // // // //     if (invitations.length === 0) {
// // // // // // // // // // // //       Alert.alert("הזמנות", "אין לך הזמנות חדשות.");
// // // // // // // // // // // //       return;
// // // // // // // // // // // //     }
// // // // // // // // // // // //     const invite = invitations[0];
// // // // // // // // // // // //     Alert.alert(
// // // // // // // // // // // //       "הזמנה חדשה 📩",
// // // // // // // // // // // //       `הוזמנת לקבוצת "${invite.groupName}"`,
// // // // // // // // // // // //       [
// // // // // // // // // // // //         { text: "אשר הצטרפות ✅", onPress: () => handleAcceptInvite(invite.id) },
// // // // // // // // // // // //         { text: "סגור", style: "cancel" }
// // // // // // // // // // // //       ]
// // // // // // // // // // // //     );
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const handleCreatePostChoice = () => {
// // // // // // // // // // // //     Alert.alert("לאן להעלות?", "בחר יעד:", [
// // // // // // // // // // // //       { text: "🌐 עולם (ציבורי)", onPress: () => navigation.navigate('CreatePost', { target: 'world' }) },
// // // // // // // // // // // //       { text: "👥 קבוצה", onPress: () => navigation.navigate('CreatePost', { target: 'group' }) },
// // // // // // // // // // // //       { text: "ביטול", style: "cancel" }
// // // // // // // // // // // //     ]);
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// // // // // // // // // // // //         <Text style={styles.title}>שלום {userName} 👋</Text>

// // // // // // // // // // // //         {/* --- כפתור הזמנות מהבהב --- */}
// // // // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // // // //           <Text style={styles.sectionHeader}>התראות</Text>
// // // // // // // // // // // //           <Animated.View style={{ opacity: invitations.length > 0 ? blinkAnim : 1 }}>
// // // // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // // // //               style={[styles.inviteButton, invitations.length > 0 && styles.activeInvite]} 
// // // // // // // // // // // //               onPress={showInviteAlert}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               {loading ? (
// // // // // // // // // // // //                 <ActivityIndicator color="#6200EE" />
// // // // // // // // // // // //               ) : (
// // // // // // // // // // // //                 <Text style={styles.buttonText}>
// // // // // // // // // // // //                   {invitations.length > 0 ? `🔔 יש לך (${invitations.length}) הזמנות ממתינות!` : "📩 אין הזמנות חדשות"}
// // // // // // // // // // // //                 </Text>
// // // // // // // // // // // //               )}
// // // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // // //           </Animated.View>
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         {/* --- ניהול קבוצות --- */}
// // // // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // // // //           <Text style={styles.sectionHeader}>הקבוצות שלי</Text>
// // // // // // // // // // // //           <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('MyGroups')}>
// // // // // // // // // // // //             <Text style={styles.buttonText}>👥 רשימת הקבוצות שלי</Text>
// // // // // // // // // // // //           </TouchableOpacity>
          
// // // // // // // // // // // //           {/* <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} onPress={() => navigation.navigate('CreateGroup')}>
// // // // // // // // // // // //             <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
// // // // // // // // // // // //           </TouchableOpacity> */}
// // // // // // // // // // // //           <TouchableOpacity 
// // // // // // // // // // // //   style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} 
// // // // // // // // // // // //   onPress={() => navigation.navigate('CreateGroup', { userName: userName })} // העברת השם
// // // // // // // // // // // // >
// // // // // // // // // // // //   <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
// // // // // // // // // // // // </TouchableOpacity>
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         {/* --- פוסטים --- */}
// // // // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // // // //           <Text style={styles.sectionHeader}>פוסטים</Text>
// // // // // // // // // // // //           <TouchableOpacity style={[styles.menuButton, styles.postButton]} onPress={handleCreatePostChoice}>
// // // // // // // // // // // //             <Text style={styles.buttonText}>✍️ העלאת פוסט חדש</Text>
// // // // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // // // //           <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('GlobalFeed')}>
// // // // // // // // // // // //             <Text style={styles.buttonText}>🌐 פיד ציבורי</Text>
// // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
// // // // // // // // // // // //           <Text style={styles.logoutText}>התנתק</Text>
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //       </ScrollView>
// // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // //   container: { flex: 1, backgroundColor: '#F8F9FA' },
// // // // // // // // // // // //   scrollContainer: { padding: 20, alignItems: 'center' },
// // // // // // // // // // // //   title: { fontSize: 24, fontWeight: 'bold', color: '#6200EE', marginBottom: 25 },
// // // // // // // // // // // //   section: { width: '100%', marginBottom: 20 },
// // // // // // // // // // // //   sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 8, textAlign: 'right' },
// // // // // // // // // // // //   menuButton: { 
// // // // // // // // // // // //     backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 10, 
// // // // // // // // // // // //     flexDirection: 'row-reverse', alignItems: 'center', elevation: 2 
// // // // // // // // // // // //   },
// // // // // // // // // // // //   inviteButton: {
// // // // // // // // // // // //     backgroundColor: '#FFF', padding: 18, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD',
// // // // // // // // // // // //     alignItems: 'center'
// // // // // // // // // // // //   },
// // // // // // // // // // // //   activeInvite: { backgroundColor: '#FFF59D', borderColor: '#FBC02D', borderStyle: 'solid', borderWidth: 2 },
// // // // // // // // // // // //   postButton: { borderRightWidth: 5, borderRightColor: '#6200EE' },
// // // // // // // // // // // //   buttonText: { fontSize: 16, color: '#333', fontWeight: '600' },
// // // // // // // // // // // //   logoutButton: { marginTop: 30 },
// // // // // // // // // // // //   logoutText: { color: '#D32F2F', fontWeight: 'bold' }
// // // // // // // // // // // // });

// // // // // // // // // // // // export default MenuScreen;
// // // // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // // // import { 
// // // // // // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // // // // // //   ScrollView, Animated, ActivityIndicator 
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // // // // import { BASE_URL } from '../api/Constants';
// // // // // // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // // // // // //   // קבלת שם המשתמש מהתחברות
// // // // // // // // // // //   const { userName } = route.params || { userName: 'אורח' };
// // // // // // // // // // //   const MY_IP = '192.168.1.XXX'; // <--- שנה ל-IP שלך!

// // // // // // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // //   const blinkAnim = useRef(new Animated.Value(1)).current;

// // // // // // // // // // //   // 1. פונקציה למשיכת הזמנות מהשרת
// // // // // // // // // // //   const fetchInvitations = async () => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const response = await fetch(`${BASE_URL}/invitations/${userName}`);
// // // // // // // // // // //       if (response.ok) {
// // // // // // // // // // //         const data = await response.json();
// // // // // // // // // // //         setInvitations(data);
// // // // // // // // // // //         if (data.length > 0) startBlinking();
// // // // // // // // // // //       }
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   // 2. אנימציית הבהוב
// // // // // // // // // // //   const startBlinking = () => {
// // // // // // // // // // //     Animated.loop(
// // // // // // // // // // //       Animated.sequence([
// // // // // // // // // // //         Animated.timing(blinkAnim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
// // // // // // // // // // //         Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
// // // // // // // // // // //       ])
// // // // // // // // // // //     ).start();
// // // // // // // // // // //   };

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     fetchInvitations();
// // // // // // // // // // //     const interval = setInterval(fetchInvitations, 15000); // בדיקה כל 15 שניות
// // // // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   // 3. אישור הזמנה
// // // // // // // // // // //   const handleAcceptInvite = async (inviteId: string) => {
// // // // // // // // // // //     setLoading(true);
// // // // // // // // // // //     try {
// // // // // // // // // // //       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
// // // // // // // // // // //         method: 'POST'
// // // // // // // // // // //       });
// // // // // // // // // // //       if (response.ok) {
// // // // // // // // // // //         Alert.alert("הצלחה!", "הצטרפת לקבוצה בהצלחה.");
// // // // // // // // // // //         fetchInvitations();
// // // // // // // // // // //       } else {
// // // // // // // // // // //         Alert.alert("שגיאה", "לא ניתן היה לאשר את ההזמנה.");
// // // // // // // // // // //       }
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       Alert.alert("שגיאה", "בעיית תקשורת עם השרת.");
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const showInviteAlert = () => {
// // // // // // // // // // //     if (invitations.length === 0) {
// // // // // // // // // // //       Alert.alert("הזמנות", "אין לך הזמנות חדשות.");
// // // // // // // // // // //       return;
// // // // // // // // // // //     }
// // // // // // // // // // //     const invite = invitations[0];
// // // // // // // // // // //     Alert.alert(
// // // // // // // // // // //       "הזמנה חדשה 📩",
// // // // // // // // // // //       `הוזמנת לקבוצת "${invite.groupName}"`,
// // // // // // // // // // //       [
// // // // // // // // // // //         { text: "אשר הצטרפות ✅", onPress: () => handleAcceptInvite(invite.id) },
// // // // // // // // // // //         { text: "סגור", style: "cancel" }
// // // // // // // // // // //       ]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleCreatePostChoice = () => {
// // // // // // // // // // //     Alert.alert("לאן להעלות?", "בחר יעד:", [
// // // // // // // // // // //       { text: "🌐 עולם (ציבורי)", onPress: () => navigation.navigate('CreatePost', { target: 'world' }) },
// // // // // // // // // // //       { text: "👥 קבוצה", onPress: () => navigation.navigate('CreatePost', { target: 'group' }) },
// // // // // // // // // // //       { text: "ביטול", style: "cancel" }
// // // // // // // // // // //     ]);
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// // // // // // // // // // //         <Text style={styles.title}>שלום {userName} 👋</Text>

// // // // // // // // // // //         {/* --- כפתור הזמנות מהבהב --- */}
// // // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // // //           <Text style={styles.sectionHeader}>התראות</Text>
// // // // // // // // // // //           <Animated.View style={{ opacity: invitations.length > 0 ? blinkAnim : 1 }}>
// // // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // // //               style={[styles.inviteButton, invitations.length > 0 && styles.activeInvite]} 
// // // // // // // // // // //               onPress={showInviteAlert}
// // // // // // // // // // //             >
// // // // // // // // // // //               {loading ? (
// // // // // // // // // // //                 <ActivityIndicator color="#6200EE" />
// // // // // // // // // // //               ) : (
// // // // // // // // // // //                 <Text style={styles.buttonText}>
// // // // // // // // // // //                   {invitations.length > 0 ? `🔔 יש לך (${invitations.length}) הזמנות ממתינות!` : "📩 אין הזמנות חדשות"}
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //               )}
// // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // //           </Animated.View>
// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* --- ניהול קבוצות --- */}
// // // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // // //           <Text style={styles.sectionHeader}>הקבוצות שלי</Text>
// // // // // // // // // // //         <TouchableOpacity 
// // // // // // // // // // //     style={styles.menuButton} 
// // // // // // // // // // //     onPress={() => navigation.navigate('MyGroups', { userName: userName })}
// // // // // // // // // // //   > 
// // // // // // // // // // //     <Text style={styles.buttonText}>👥 רשימת הקבוצות שלי</Text>
// // // // // // // // // // //   </TouchableOpacity>
          
// // // // // // // // // // //           {/* <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} onPress={() => navigation.navigate('CreateGroup')}>
// // // // // // // // // // //             <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
// // // // // // // // // // //           </TouchableOpacity> */}
// // // // // // // // // // //           <TouchableOpacity 
// // // // // // // // // // //   style={[styles.menuButton, { backgroundColor: '#E1D5F5' }]} 
// // // // // // // // // // //   onPress={() => navigation.navigate('CreateGroup', { userName: userName })} // העברת השם
// // // // // // // // // // // >
// // // // // // // // // // //   <Text style={styles.buttonText}>➕ יצירת קבוצה חדשה</Text>
// // // // // // // // // // // </TouchableOpacity>
// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* --- פוסטים --- */}
// // // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // // //           <Text style={styles.sectionHeader}>פוסטים</Text>
// // // // // // // // // // //           <TouchableOpacity style={[styles.menuButton, styles.postButton]} onPress={handleCreatePostChoice}>
// // // // // // // // // // //             <Text style={styles.buttonText}>✍️ העלאת פוסט חדש</Text>
// // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // {/* --- מצא את הקטע הזה בתוך ה-MenuScreen ותעדכן את ה-onPress --- */}
// // // // // // // // // // // <TouchableOpacity 
// // // // // // // // // // //   style={styles.menuButton} 
// // // // // // // // // // //   onPress={() => navigation.navigate('GlobalFeed', { userName: userName })} // <--- הוספנו את userName
// // // // // // // // // // // >
// // // // // // // // // // //   <Text style={styles.buttonText}>🌐 פיד ציבורי</Text>
// // // // // // // // // // // </TouchableOpacity>
// // // // // // // // // // //         </View>

// // // // // // // // // // //         <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
// // // // // // // // // // //           <Text style={styles.logoutText}>התנתק</Text>
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //       </ScrollView>
// // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: { flex: 1, backgroundColor: '#F8F9FA' },
// // // // // // // // // // //   scrollContainer: { padding: 20, alignItems: 'center' },
// // // // // // // // // // //   title: { fontSize: 24, fontWeight: 'bold', color: '#6200EE', marginBottom: 25 },
// // // // // // // // // // //   section: { width: '100%', marginBottom: 20 },
// // // // // // // // // // //   sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 8, textAlign: 'right' },
// // // // // // // // // // //   menuButton: { 
// // // // // // // // // // //     backgroundColor: '#FFF', padding: 18, borderRadius: 12, marginBottom: 10, 
// // // // // // // // // // //     flexDirection: 'row-reverse', alignItems: 'center', elevation: 2 
// // // // // // // // // // //   },
// // // // // // // // // // //   inviteButton: {
// // // // // // // // // // //     backgroundColor: '#FFF', padding: 18, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD',
// // // // // // // // // // //     alignItems: 'center'
// // // // // // // // // // //   },
// // // // // // // // // // //   activeInvite: { backgroundColor: '#FFF59D', borderColor: '#FBC02D', borderStyle: 'solid', borderWidth: 2 },
// // // // // // // // // // //   postButton: { borderRightWidth: 5, borderRightColor: '#6200EE' },
// // // // // // // // // // //   buttonText: { fontSize: 16, color: '#333', fontWeight: '600' },
// // // // // // // // // // //   logoutButton: { marginTop: 30 },
// // // // // // // // // // //   logoutText: { color: '#D32F2F', fontWeight: 'bold' }
// // // // // // // // // // // });

// // // // // // // // // // // export default MenuScreen;
// // // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // // import { 
// // // // // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // // // // //   ScrollView, Animated, ActivityIndicator 
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // // // שימוש באייקונים מובנים (Emoji כאלטרנטיבה קלה ומהירה)
// // // // // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // // // // //   const { userName } = route.params || { userName: 'אורח' };

// // // // // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // //   const blinkAnim = useRef(new Animated.Value(1)).current;

// // // // // // // // // //   const fetchInvitations = async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await fetch(`${BASE_URL}/invitations/${userName}`);
// // // // // // // // // //       if (response.ok) {
// // // // // // // // // //         const data = await response.json();
// // // // // // // // // //         setInvitations(data);
// // // // // // // // // //         if (data.length > 0) startBlinking();
// // // // // // // // // //       }
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const startBlinking = () => {
// // // // // // // // // //     Animated.loop(
// // // // // // // // // //       Animated.sequence([
// // // // // // // // // //         Animated.timing(blinkAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
// // // // // // // // // //         Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
// // // // // // // // // //       ])
// // // // // // // // // //     ).start();
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     fetchInvitations();
// // // // // // // // // //     const interval = setInterval(fetchInvitations, 15000);
// // // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // // //   }, []);

// // // // // // // // // //   const handleAcceptInvite = async (inviteId: string) => {
// // // // // // // // // //     setLoading(true);
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
// // // // // // // // // //         method: 'POST'
// // // // // // // // // //       });
// // // // // // // // // //       if (response.ok) {
// // // // // // // // // //         Alert.alert("מזל טוב! 🎉", "הצטרפת לקבוצה בהצלחה.");
// // // // // // // // // //         fetchInvitations();
// // // // // // // // // //       }
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       Alert.alert("שגיאה", "בעיית תקשורת.");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const showInviteAlert = () => {
// // // // // // // // // //     if (invitations.length === 0) return;
// // // // // // // // // //     const invite = invitations[0];
// // // // // // // // // //     Alert.alert(
// // // // // // // // // //       "הזמנה חדשה ממתינה! 📩",
// // // // // // // // // //       `מישהו הזמין אותך להצטרף ל"${invite.groupName}"`,
// // // // // // // // // //       [
// // // // // // // // // //         { text: "אשר והצטרף ✅", onPress: () => handleAcceptInvite(invite.id) },
// // // // // // // // // //         { text: "אולי אחר כך", style: "cancel" }
// // // // // // // // // //       ]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // // // // // // // // //         {/* Header Section */}
// // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // //           <View>
// // // // // // // // // //             <Text style={styles.welcomeText}>בוקר טוב,</Text>
// // // // // // // // // //             <Text style={styles.userNameText}>{userName} ✨</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //           <View style={styles.avatarPlaceholder}>
// // // // // // // // // //              <Text style={styles.avatarEmoji}>👤</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Notifications Section */}
// // // // // // // // // //         {invitations.length > 0 && (
// // // // // // // // // //           <Animated.View style={[styles.notificationBanner, { opacity: blinkAnim }]}>
// // // // // // // // // //             <TouchableOpacity style={styles.bannerContent} onPress={showInviteAlert}>
// // // // // // // // // //                <Text style={styles.bannerText}>🔔 יש לך {invitations.length} הזמנות חדשות!</Text>
// // // // // // // // // //                <Text style={styles.bannerLink}>צפה עכשיו ❮</Text>
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           </Animated.View>
// // // // // // // // // //         )}

// // // // // // // // // //         {/* Groups Section */}
// // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // //           <Text style={styles.sectionHeader}>הקהילה שלי</Text>
// // // // // // // // // //           <View style={styles.grid}>
// // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // //               style={styles.card} 
// // // // // // // // // //               onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // // // // // // //             >
// // // // // // // // // //               <View style={[styles.iconContainer, { backgroundColor: '#E0E7FF' }]}>
// // // // // // // // // //                 <Text style={styles.icon}>👥</Text>
// // // // // // // // // //               </View>
// // // // // // // // // //               <Text style={styles.cardTitle}>הקבוצות שלי</Text>
// // // // // // // // // //               <Text style={styles.cardSubtitle}>נהל את הקהילות שלך</Text>
// // // // // // // // // //             </TouchableOpacity>

// // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // //               style={styles.card} 
// // // // // // // // // //               onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // // // // // // //             >
// // // // // // // // // //               <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
// // // // // // // // // //                 <Text style={styles.icon}>➕</Text>
// // // // // // // // // //               </View>
// // // // // // // // // //               <Text style={styles.cardTitle}>צור קבוצה</Text>
// // // // // // // // // //               <Text style={styles.cardSubtitle}>פתח קהילה חדשה</Text>
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Posts Section */}
// // // // // // // // // //         <View style={styles.section}>
// // // // // // // // // //           <Text style={styles.sectionHeader}>תוכן ועדכונים</Text>
          
// // // // // // // // // //           <TouchableOpacity 
// // // // // // // // // //             style={styles.longCard} 
// // // // // // // // // //             onPress={() => navigation.navigate('GlobalFeed', { userName })}
// // // // // // // // // //           >
// // // // // // // // // //             <View style={styles.longCardRow}>
// // // // // // // // // //               <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
// // // // // // // // // //                 <Text style={styles.icon}>🌐</Text>
// // // // // // // // // //               </View>
// // // // // // // // // //               <View style={styles.longCardText}>
// // // // // // // // // //                 <Text style={styles.cardTitle}>הפיד העולמי</Text>
// // // // // // // // // //                 <Text style={styles.cardSubtitle}>גלה מה חדש מסביב לעולם</Text>
// // // // // // // // // //               </View>
// // // // // // // // // //               <Text style={styles.chevron}>❮</Text>
// // // // // // // // // //             </View>
// // // // // // // // // //           </TouchableOpacity>

// // // // // // // // // //           <TouchableOpacity 
// // // // // // // // // //             style={[styles.longCard, { marginTop: 12 }]} 
// // // // // // // // // //             onPress={() => Alert.alert("לאן להעלות?", "בחר יעד:", [
// // // // // // // // // //               { text: "🌐 עולם (ציבורי)", onPress: () => navigation.navigate('CreatePost', { target: 'world' }) },
// // // // // // // // // //               { text: "👥 קבוצה", onPress: () => navigation.navigate('CreatePost', { target: 'group' }) },
// // // // // // // // // //               { text: "ביטול", style: "cancel" }
// // // // // // // // // //             ])}
// // // // // // // // // //           >
// // // // // // // // // //             <View style={styles.longCardRow}>
// // // // // // // // // //               <View style={[styles.iconContainer, { backgroundColor: '#FFEDD5' }]}>
// // // // // // // // // //                 <Text style={styles.icon}>✍️</Text>
// // // // // // // // // //               </View>
// // // // // // // // // //               <View style={styles.longCardText}>
// // // // // // // // // //                 <Text style={styles.cardTitle}>פוסט חדש</Text>
// // // // // // // // // //                 <Text style={styles.cardSubtitle}>שתף את המחשבות שלך</Text>
// // // // // // // // // //               </View>
// // // // // // // // // //               <Text style={styles.chevron}>❮</Text>
// // // // // // // // // //             </View>
// // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Logout */}
// // // // // // // // // //         <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
// // // // // // // // // //           <Text style={styles.logoutText}>התנתקות מהמערכת</Text>
// // // // // // // // // //         </TouchableOpacity>

// // // // // // // // // //       </ScrollView>
// // // // // // // // // //     </SafeAreaView>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: { flex: 1, backgroundColor: '#FBFBFE' },
// // // // // // // // // //   scrollContainer: { padding: 20 },
  
// // // // // // // // // //   header: { 
// // // // // // // // // //     flexDirection: 'row-reverse', 
// // // // // // // // // //     justifyContent: 'space-between', 
// // // // // // // // // //     alignItems: 'center', 
// // // // // // // // // //     marginBottom: 30,
// // // // // // // // // //     marginTop: 10 
// // // // // // // // // //   },
// // // // // // // // // //   welcomeText: { fontSize: 16, color: '#71717A', textAlign: 'right' },
// // // // // // // // // //   userNameText: { fontSize: 26, fontWeight: '800', color: '#18181B', textAlign: 'right' },
// // // // // // // // // //   avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F4F4F5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E4E4E7' },
// // // // // // // // // //   avatarEmoji: { fontSize: 24 },

// // // // // // // // // //   notificationBanner: { 
// // // // // // // // // //     backgroundColor: '#6366F1', 
// // // // // // // // // //     borderRadius: 16, 
// // // // // // // // // //     padding: 15, 
// // // // // // // // // //     marginBottom: 25,
// // // // // // // // // //     shadowColor: '#6366F1',
// // // // // // // // // //     shadowOffset: { width: 0, height: 4 },
// // // // // // // // // //     shadowOpacity: 0.3,
// // // // // // // // // //     shadowRadius: 10,
// // // // // // // // // //     elevation: 5
// // // // // // // // // //   },
// // // // // // // // // //   bannerContent: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
// // // // // // // // // //   bannerText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
// // // // // // // // // //   bannerLink: { color: '#FFF', fontSize: 12, opacity: 0.8 },

// // // // // // // // // //   section: { marginBottom: 30 },
// // // // // // // // // //   sectionHeader: { fontSize: 18, fontWeight: '700', color: '#3F3F46', marginBottom: 15, textAlign: 'right', paddingRight: 5 },
  
// // // // // // // // // //   grid: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
// // // // // // // // // //   card: { 
// // // // // // // // // //     backgroundColor: '#FFF', 
// // // // // // // // // //     width: '48%', 
// // // // // // // // // //     padding: 20, 
// // // // // // // // // //     borderRadius: 24, 
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: '#F4F4F5',
// // // // // // // // // //     elevation: 2,
// // // // // // // // // //     shadowColor: '#000',
// // // // // // // // // //     shadowOpacity: 0.05
// // // // // // // // // //   },
// // // // // // // // // //   iconContainer: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
// // // // // // // // // //   icon: { fontSize: 24 },
// // // // // // // // // //   cardTitle: { fontSize: 16, fontWeight: '700', color: '#18181B', marginBottom: 4 },
// // // // // // // // // //   cardSubtitle: { fontSize: 12, color: '#A1A1AA', textAlign: 'center' },

// // // // // // // // // //   longCard: { 
// // // // // // // // // //     backgroundColor: '#FFF', 
// // // // // // // // // //     padding: 16, 
// // // // // // // // // //     borderRadius: 24, 
// // // // // // // // // //     borderWidth: 1, 
// // // // // // // // // //     borderColor: '#F4F4F5' 
// // // // // // // // // //   },
// // // // // // // // // //   longCardRow: { flexDirection: 'row-reverse', alignItems: 'center' },
// // // // // // // // // //   longCardText: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
// // // // // // // // // //   chevron: { color: '#D4D4D8', fontSize: 18, marginLeft: 10 },

// // // // // // // // // //   logoutBtn: { marginTop: 10, alignItems: 'center', padding: 15 },
// // // // // // // // // //   logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 15 }
// // // // // // // // // // });

// // // // // // // // // // export default MenuScreen;
// // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // import { 
// // // // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // // // //   ScrollView, Animated, ActivityIndicator, Dimensions, FlatList 
// // // // // // // // // } from 'react-native';
// // // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // // // //   const { userName } = route.params || { userName: 'אורח' };
// // // // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // // // //   const [loadingInviteId, setLoadingInviteId] = useState<string | null>(null);

// // // // // // // // //   const fetchInvitations = async () => {
// // // // // // // // //     try {
// // // // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // // // // // // //       if (response.ok) {
// // // // // // // // //         const data = await response.json();
// // // // // // // // //         setInvitations(Array.isArray(data) ? data : []);
// // // // // // // // //       }
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     fetchInvitations();
// // // // // // // // //     const interval = setInterval(fetchInvitations, 10000);
// // // // // // // // //     return () => clearInterval(interval);
// // // // // // // // //   }, []);

// // // // // // // // //   const handleInviteAction = async (inviteId: string, action: 'accept' | 'decline') => {
// // // // // // // // //     setLoadingInviteId(inviteId);
// // // // // // // // //     try {
// // // // // // // // //       const endpoint = action === 'accept' ? 'accept' : 'decline';
// // // // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${endpoint}?invitationId=${inviteId}`, {
// // // // // // // // //         method: 'POST'
// // // // // // // // //       });
      
// // // // // // // // //       if (response.ok) {
// // // // // // // // //         Alert.alert(action === 'accept' ? "ברוך הבא! 🎉" : "ההזמנה נמחקה");
// // // // // // // // //         fetchInvitations();
// // // // // // // // //       }
// // // // // // // // //     } catch (error) {
// // // // // // // // //       Alert.alert("שגיאה", "משהו השתבש בתקשורת");
// // // // // // // // //     } finally {
// // // // // // // // //       setLoadingInviteId(null);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // // // // // // // //         {/* Header */}
// // // // // // // // //         <View style={styles.header}>
// // // // // // // // //           <Text style={styles.welcomeText}>היי, {userName} 👋</Text>
// // // // // // // // //           <Text style={styles.title}>מה עושים היום?</Text>
// // // // // // // // //         </View>

// // // // // // // // //         {/* --- אזור הזמנות חדש (מופיע רק אם יש הזמנות) --- */}
// // // // // // // // //         {invitations.length > 0 && (
// // // // // // // // //           <View style={styles.invitesSection}>
// // // // // // // // //             <View style={styles.sectionHeaderRow}>
// // // // // // // // //               <Text style={styles.badgeCount}>{invitations.length}</Text>
// // // // // // // // //               <Text style={styles.sectionLabel}>הזמנות חדשות לקבוצות</Text>
// // // // // // // // //             </View>
            
// // // // // // // // //             {invitations.map((invite) => (
// // // // // // // // //               <View key={invite.id} style={styles.inviteCard}>
// // // // // // // // //                 <View style={styles.inviteInfo}>
// // // // // // // // //                   <View style={styles.groupIcon}>
// // // // // // // // //                     <Text style={{fontSize: 20}}>📩</Text>
// // // // // // // // //                   </View>
// // // // // // // // //                   <View style={{alignItems: 'flex-end', flex: 1, marginRight: 12}}>
// // // // // // // // //                     <Text style={styles.inviteGroupName}>{invite.groupName || invite.name}</Text>
// // // // // // // // //                     <Text style={styles.inviteSender}>הוזמנת על ידי {invite.inviterUsername}</Text>
// // // // // // // // //                   </View>
// // // // // // // // //                 </View>

// // // // // // // // //                 <View style={styles.actionRow}>
// // // // // // // // //                   <TouchableOpacity 
// // // // // // // // //                     style={[styles.actionBtn, styles.acceptBtn]} 
// // // // // // // // //                     onPress={() => handleInviteAction(invite.id, 'accept')}
// // // // // // // // //                     disabled={loadingInviteId === invite.id}
// // // // // // // // //                   >
// // // // // // // // //                     {loadingInviteId === invite.id ? (
// // // // // // // // //                       <ActivityIndicator size="small" color="#FFF" />
// // // // // // // // //                     ) : (
// // // // // // // // //                       <Text style={styles.acceptText}>אישור הצטרפות ✅</Text>
// // // // // // // // //                     )}
// // // // // // // // //                   </TouchableOpacity>
                  
// // // // // // // // //                   <TouchableOpacity 
// // // // // // // // //                     style={[styles.actionBtn, styles.declineBtn]} 
// // // // // // // // //                     onPress={() => handleInviteAction(invite.id, 'decline')}
// // // // // // // // //                   >
// // // // // // // // //                     <Text style={styles.declineText}>התעלם</Text>
// // // // // // // // //                   </TouchableOpacity>
// // // // // // // // //                 </View>
// // // // // // // // //               </View>
// // // // // // // // //             ))}
// // // // // // // // //           </View>
// // // // // // // // //         )}

// // // // // // // // //         {/* --- כפתורי ניווט רגילים --- */}
// // // // // // // // //         <View style={styles.menuGrid}>
// // // // // // // // //           <TouchableOpacity 
// // // // // // // // //             style={styles.menuItem} 
// // // // // // // // //             onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // // // // // //           >
// // // // // // // // //             <View style={[styles.iconCircle, {backgroundColor: '#E0E7FF'}]}>
// // // // // // // // //               <Text style={{fontSize: 30}}>👥</Text>
// // // // // // // // //             </View>
// // // // // // // // //             <Text style={styles.menuItemTitle}>הקבוצות שלי</Text>
// // // // // // // // //           </TouchableOpacity>

// // // // // // // // //           <TouchableOpacity 
// // // // // // // // //             style={styles.menuItem} 
// // // // // // // // //             onPress={() => navigation.navigate('GlobalFeed', { userName })}
// // // // // // // // //           >
// // // // // // // // //             <View style={[styles.iconCircle, {backgroundColor: '#DCFCE7'}]}>
// // // // // // // // //               <Text style={{fontSize: 30}}>🌐</Text>
// // // // // // // // //             </View>
// // // // // // // // //             <Text style={styles.menuItemTitle}>פיד ציבורי</Text>
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //         </View>

// // // // // // // // //         <TouchableOpacity 
// // // // // // // // //           style={styles.createBtn} 
// // // // // // // // //           onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // // // // // //         >
// // // // // // // // //           <Text style={styles.createBtnText}>➕ צור קבוצה חדשה</Text>
// // // // // // // // //         </TouchableOpacity>

// // // // // // // // //       </ScrollView>
// // // // // // // // //     </SafeAreaView>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: { flex: 1, backgroundColor: '#F8F9FB' },
// // // // // // // // //   scrollContainer: { padding: 20 },
// // // // // // // // //   header: { marginBottom: 25, alignItems: 'flex-end' },
// // // // // // // // //   welcomeText: { fontSize: 16, color: '#64748B', fontWeight: '500' },
// // // // // // // // //   title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },

// // // // // // // // //   // עיצוב אזור ההזמנות
// // // // // // // // //   invitesSection: { marginBottom: 30 },
// // // // // // // // //   sectionHeaderRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12 },
// // // // // // // // //   sectionLabel: { fontSize: 16, fontWeight: '700', color: '#475569' },
// // // // // // // // //   badgeCount: { backgroundColor: '#EF4444', color: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 12, fontWeight: 'bold', marginRight: 8 },

// // // // // // // // //   inviteCard: { 
// // // // // // // // //     backgroundColor: '#FFF', 
// // // // // // // // //     borderRadius: 20, 
// // // // // // // // //     padding: 16, 
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: '#E2E8F0',
// // // // // // // // //     elevation: 3,
// // // // // // // // //     shadowColor: '#000',
// // // // // // // // //     shadowOpacity: 0.05
// // // // // // // // //   },
// // // // // // // // //   inviteInfo: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
// // // // // // // // //   groupIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
// // // // // // // // //   inviteGroupName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
// // // // // // // // //   inviteSender: { fontSize: 13, color: '#64748B' },
  
// // // // // // // // //   actionRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
// // // // // // // // //   actionBtn: { paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
// // // // // // // // //   acceptBtn: { backgroundColor: '#6200EE', flex: 2 },
// // // // // // // // //   declineBtn: { backgroundColor: '#F1F5F9', flex: 1, marginLeft: 10 },
// // // // // // // // //   acceptText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
// // // // // // // // //   declineText: { color: '#64748B', fontWeight: '600', fontSize: 14 },

// // // // // // // // //   // עיצוב תפריט רגיל
// // // // // // // // //   menuGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
// // // // // // // // //   menuItem: { backgroundColor: '#FFF', width: '48%', padding: 20, borderRadius: 24, alignItems: 'center', elevation: 2 },
// // // // // // // // //   iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
// // // // // // // // //   menuItemTitle: { fontWeight: '700', color: '#334155' },

// // // // // // // // //   createBtn: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1' },
// // // // // // // // //   createBtnText: { color: '#6200EE', fontWeight: 'bold', fontSize: 16 }
// // // // // // // // // });

// // // // // // // // // export default MenuScreen;
// // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // import { 
// // // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // // //   ScrollView, Animated, ActivityIndicator, LayoutAnimation, Platform, UIManager
// // // // // // // // } from 'react-native';
// // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // // הפעלת אנימציות פריסה לאנדרואיד
// // // // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // // // //   UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // // // }

// // // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // // //   const { userName } = route.params || { userName: 'אורח' };
  
// // // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // // //   const [isExpanded, setIsExpanded] = useState(false); // שולט האם הרשימה פתוחה
// // // // // // // //   const [loadingId, setLoadingId] = useState<string | null>(null);

// // // // // // // //   const fetchInvitations = async () => {
// // // // // // // //     try {
// // // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // // // // // //       if (response.ok) {
// // // // // // // //         const data = await response.json();
// // // // // // // //         setInvitations(Array.isArray(data) ? data : []);
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchInvitations();
// // // // // // // //     const interval = setInterval(fetchInvitations, 10000);
// // // // // // // //     return () => clearInterval(interval);
// // // // // // // //   }, []);

// // // // // // // //   const toggleInvites = () => {
// // // // // // // //     // אנימציה חלקה לפתיחה/סגירה
// // // // // // // //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // // //     setIsExpanded(!isExpanded);
// // // // // // // //   };

// // // // // // // //   const handleAction = async (inviteId: string, action: 'accept' | 'decline') => {
// // // // // // // //     setLoadingId(inviteId);
// // // // // // // //     try {
// // // // // // // //       const endpoint = action === 'accept' ? 'accept' : 'decline';
// // // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${endpoint}?invitationId=${inviteId}`, {
// // // // // // // //         method: 'POST'
// // // // // // // //       });
      
// // // // // // // //       if (response.ok) {
// // // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
// // // // // // // //         fetchInvitations();
// // // // // // // //         if (invitations.length === 1) setIsExpanded(false); // סגירה אוטומטית אם זו הייתה האחרונה
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       Alert.alert("שגיאה", "פעולה נכשלה");
// // // // // // // //     } finally {
// // // // // // // //       setLoadingId(null);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
        
// // // // // // // //         {/* Header פשוט ונקי */}
// // // // // // // //         <View style={styles.header}>
// // // // // // // //           <Text style={styles.welcomeText}>שלום, {userName}</Text>
// // // // // // // //           <Text style={styles.mainTitle}>התפריט הראשי</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* --- כפתור "יש הזמנות חדשות" (מופיע רק אם יש נתונים) --- */}
// // // // // // // //         {invitations.length > 0 && (
// // // // // // // //           <View style={styles.invitesWrapper}>
// // // // // // // //             <TouchableOpacity 
// // // // // // // //               style={[styles.inviteToggleBtn, isExpanded && styles.activeToggle]} 
// // // // // // // //               onPress={toggleInvites}
// // // // // // // //               activeOpacity={0.8}
// // // // // // // //             >
// // // // // // // //               <Text style={styles.arrowIcon}>{isExpanded ? '▲' : '▼'}</Text>
// // // // // // // //               <View style={styles.inviteBadge}>
// // // // // // // //                 <Text style={styles.badgeText}>{invitations.length}</Text>
// // // // // // // //               </View>
// // // // // // // //               <Text style={styles.inviteToggleText}>ממתינות לך הזמנות חדשות!</Text>
// // // // // // // //               <Text style={{fontSize: 20, marginLeft: 10}}>📩</Text>
// // // // // // // //             </TouchableOpacity>

// // // // // // // //             {/* רשימת ההזמנות שנפתחת בלחיצה */}
// // // // // // // //             {isExpanded && (
// // // // // // // //               <View style={styles.expandedContent}>
// // // // // // // //                 {invitations.map((invite) => (
// // // // // // // //                   <View key={invite.id} style={styles.inviteCard}>
// // // // // // // //                     <View style={styles.inviteHeader}>
// // // // // // // //                        <Text style={styles.groupName}>{invite.groupName || invite.name}</Text>
// // // // // // // //                        <Text style={styles.senderName}>מאת: {invite.inviterUsername}</Text>
// // // // // // // //                     </View>
                    
// // // // // // // //                     <View style={styles.btnRow}>
// // // // // // // //                       <TouchableOpacity 
// // // // // // // //                         style={[styles.actionBtn, styles.acceptBtn]} 
// // // // // // // //                         onPress={() => handleAction(invite.id, 'accept')}
// // // // // // // //                         disabled={loadingId === invite.id}
// // // // // // // //                       >
// // // // // // // //                         {loadingId === invite.id ? (
// // // // // // // //                           <ActivityIndicator size="small" color="#FFF" />
// // // // // // // //                         ) : (
// // // // // // // //                           <Text style={styles.btnTextWhite}>אישור ✅</Text>
// // // // // // // //                         )}
// // // // // // // //                       </TouchableOpacity>

// // // // // // // //                       <TouchableOpacity 
// // // // // // // //                         style={[styles.actionBtn, styles.declineBtn]} 
// // // // // // // //                         onPress={() => handleAction(invite.id, 'decline')}
// // // // // // // //                       >
// // // // // // // //                         <Text style={styles.btnTextGrey}>התעלם</Text>
// // // // // // // //                       </TouchableOpacity>
// // // // // // // //                     </View>
// // // // // // // //                   </View>
// // // // // // // //                 ))}
// // // // // // // //               </View>
// // // // // // // //             )}
// // // // // // // //           </View>
// // // // // // // //         )}

// // // // // // // //         {/* --- שאר כפתורי הניווט --- */}
// // // // // // // //         <View style={styles.menuSection}>
// // // // // // // //           <TouchableOpacity 
// // // // // // // //             style={styles.menuCard} 
// // // // // // // //             onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // // // // //           >
// // // // // // // //             <Text style={styles.menuIcon}>📱</Text>
// // // // // // // //             <Text style={styles.menuText}>הקבוצות שלי</Text>
// // // // // // // //           </TouchableOpacity>

// // // // // // // //           <TouchableOpacity 
// // // // // // // //             style={styles.menuCard} 
// // // // // // // //             onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // // // // //           >
// // // // // // // //             <Text style={styles.menuIcon}>➕</Text>
// // // // // // // //             <Text style={styles.menuText}>צור קבוצה</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>

// // // // // // // //       </ScrollView>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { flex: 1, backgroundColor: '#F0F2F5' },
// // // // // // // //   scrollContainer: { padding: 20 },
// // // // // // // //   header: { marginBottom: 25, alignItems: 'flex-end' },
// // // // // // // //   welcomeText: { fontSize: 16, color: '#65676B' },
// // // // // // // //   mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#1C1E21' },

// // // // // // // //   // עיצוב כפתור ההזמנות המתקפל
// // // // // // // //   invitesWrapper: { marginBottom: 20, borderRadius: 15, overflow: 'hidden', backgroundColor: '#FFF', elevation: 4, shadowOpacity: 0.1 },
// // // // // // // //   inviteToggleBtn: { 
// // // // // // // //     flexDirection: 'row', 
// // // // // // // //     alignItems: 'center', 
// // // // // // // //     padding: 15, 
// // // // // // // //     backgroundColor: '#6200EE' 
// // // // // // // //   },
// // // // // // // //   activeToggle: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' },
// // // // // // // //   inviteToggleText: { flex: 1, color: '#FFF', fontWeight: 'bold', textAlign: 'right', fontSize: 16 },
// // // // // // // //   inviteBadge: { backgroundColor: '#FF3B30', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
// // // // // // // //   badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
// // // // // // // //   arrowIcon: { color: '#FFF', fontSize: 12, marginRight: 5 },

// // // // // // // //   expandedContent: { padding: 10, backgroundColor: '#F8F9FA' },
// // // // // // // //   inviteCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#E4E6EB' },
// // // // // // // //   inviteHeader: { alignItems: 'flex-end', marginBottom: 12 },
// // // // // // // //   groupName: { fontSize: 18, fontWeight: 'bold', color: '#1C1E21' },
// // // // // // // //   senderName: { fontSize: 14, color: '#65676B' },

// // // // // // // //   btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
// // // // // // // //   actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
// // // // // // // //   acceptBtn: { backgroundColor: '#42B72A', marginRight: 10 },
// // // // // // // //   declineBtn: { backgroundColor: '#E4E6EB' },
// // // // // // // //   btnTextWhite: { color: '#FFF', fontWeight: 'bold' },
// // // // // // // //   btnTextGrey: { color: '#4B4F56', fontWeight: 'bold' },

// // // // // // // //   // עיצוב כפתורי תפריט
// // // // // // // //   menuSection: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
// // // // // // // //   menuCard: { backgroundColor: '#FFF', width: '48%', padding: 25, borderRadius: 20, alignItems: 'center', elevation: 2 },
// // // // // // // //   menuIcon: { fontSize: 40, marginBottom: 10 },
// // // // // // // //   menuText: { fontWeight: 'bold', color: '#1C1E21' }
// // // // // // // // });

// // // // // // // // export default MenuScreen;
// // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // import { 
// // // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // // //   ScrollView, Animated, ActivityIndicator, Dimensions 
// // // // // // // // } from 'react-native';
// // // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // // //   const { userName } = route.params || { userName: 'אורח' };

// // // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const blinkAnim = useRef(new Animated.Value(1)).current;

// // // // // // // //   // פונקציה למשיכת הזמנות - משמשת גם לספירה לכותרת
// // // // // // // //   const fetchInvitations = async () => {
// // // // // // // //     try {
// // // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // // // // // //       if (response.ok) {
// // // // // // // //         const data = await response.json();
// // // // // // // //         setInvitations(Array.isArray(data) ? data : []);
// // // // // // // //         if (data.length > 0) startBlinking();
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const startBlinking = () => {
// // // // // // // //     Animated.loop(
// // // // // // // //       Animated.sequence([
// // // // // // // //         Animated.timing(blinkAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
// // // // // // // //         Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
// // // // // // // //       ])
// // // // // // // //     ).start();
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchInvitations();
// // // // // // // //     const interval = setInterval(fetchInvitations, 10000); // בדיקה כל 10 שניות
// // // // // // // //     return () => clearInterval(interval);
// // // // // // // //   }, []);

// // // // // // // //   const handleAcceptInvite = async (inviteId: string) => {
// // // // // // // //     setLoading(true);
// // // // // // // //     try {
// // // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/accept?invitationId=${inviteId}`, {
// // // // // // // //         method: 'POST'
// // // // // // // //       });
// // // // // // // //       if (response.ok) {
// // // // // // // //         Alert.alert("הצלחה! 🎉", "הצטרפת לקבוצה בהצלחה.");
// // // // // // // //         fetchInvitations();
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       Alert.alert("שגיאה", "בעיית תקשורת.");
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // הצגת רשימת ההזמנות בתוך Alert או Modal (כאן בחרתי ב-Alert חכם)
// // // // // // // //   const showInvitesList = () => {
// // // // // // // //     if (invitations.length === 0) {
// // // // // // // //       Alert.alert("הזמנות", "אין לך הזמנות חדשות כרגע.");
// // // // // // // //       return;
// // // // // // // //     }
    
// // // // // // // //     const invite = invitations[0];
// // // // // // // //     Alert.alert(
// // // // // // // //       `הזמנה חדשה (${invitations.length})`,
// // // // // // // //       `הוזמנת על ידי ${invite.inviterUsername} לקבוצת "${invite.groupName || invite.name}"`,
// // // // // // // //       [
// // // // // // // //         { text: "אשר הצטרפות ✅", onPress: () => handleAcceptInvite(invite.id) },
// // // // // // // //         { text: "סגור", style: "cancel" }
// // // // // // // //       ]
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // //       {/* --- Header מעוצב עם Badge בקשות --- */}
// // // // // // // //       <View style={styles.topBar}>
// // // // // // // //         <TouchableOpacity style={styles.inviteBadgeContainer} onPress={showInvitesList}>
// // // // // // // //           <Animated.View style={[styles.bellIconBox, invitations.length > 0 && { opacity: blinkAnim }]}>
// // // // // // // //             <Text style={styles.bellIcon}>🔔</Text>
// // // // // // // //             {invitations.length > 0 && (
// // // // // // // //               <View style={styles.badgeNumber}>
// // // // // // // //                 <Text style={styles.badgeText}>{invitations.length}</Text>
// // // // // // // //               </View>
// // // // // // // //             )}
// // // // // // // //           </Animated.View>
// // // // // // // //         </TouchableOpacity>

// // // // // // // //         <View style={styles.headerTextContainer}>
// // // // // // // //           <Text style={styles.welcomeText}>שלום, {userName}</Text>
// // // // // // // //           <Text style={styles.mainTitle}>לוח בקרה</Text>
// // // // // // // //         </View>
// // // // // // // //       </View>

// // // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // // // // // // //         {/* כרטיס סטטוס מהיר */}
// // // // // // // //         <View style={styles.statusCard}>
// // // // // // // //            <Text style={styles.statusText}>יש לך <Text style={styles.boldText}>{invitations.length}</Text> בקשות הצטרפות חדשות</Text>
// // // // // // // //         </View>

// // // // // // // //         <View style={styles.section}>
// // // // // // // //           <Text style={styles.sectionLabel}>הקהילה שלי</Text>
          
// // // // // // // //           <TouchableOpacity 
// // // // // // // //             style={styles.actionCard} 
// // // // // // // //             onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // // // // //           >
// // // // // // // //             <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
// // // // // // // //               <Text style={styles.iconSize}>💬</Text>
// // // // // // // //             </View>
// // // // // // // //             <View style={styles.cardContent}>
// // // // // // // //               <Text style={styles.cardTitle}>הצ'אטים שלי</Text>
// // // // // // // //               <Text style={styles.cardDesc}>כל הקבוצות שאתה חבר בהן</Text>
// // // // // // // //             </View>
// // // // // // // //             <Text style={styles.arrow}>❮</Text>
// // // // // // // //           </TouchableOpacity>

// // // // // // // //           <TouchableOpacity 
// // // // // // // //             style={[styles.actionCard, { marginTop: 15 }]} 
// // // // // // // //             onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // // // // //           >
// // // // // // // //             <View style={[styles.iconBox, { backgroundColor: '#FAF5FF' }]}>
// // // // // // // //               <Text style={styles.iconSize}>✨</Text>
// // // // // // // //             </View>
// // // // // // // //             <View style={styles.cardContent}>
// // // // // // // //               <Text style={styles.cardTitle}>קבוצה חדשה</Text>
// // // // // // // //               <Text style={styles.cardDesc}>היה המנהל ופתח קבוצה משלך</Text>
// // // // // // // //             </View>
// // // // // // // //             <Text style={styles.arrow}>❮</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>

// // // // // // // //         <View style={styles.section}>
// // // // // // // //           <Text style={styles.sectionLabel}>פעילויות</Text>
// // // // // // // //           <TouchableOpacity 
// // // // // // // //             style={styles.actionCard} 
// // // // // // // //             onPress={() => navigation.navigate('GlobalFeed', { userName })}
// // // // // // // //           >
// // // // // // // //             <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
// // // // // // // //               <Text style={styles.iconSize}>🌍</Text>
// // // // // // // //             </View>
// // // // // // // //             <View style={styles.cardContent}>
// // // // // // // //               <Text style={styles.cardTitle}>פיד ציבורי</Text>
// // // // // // // //               <Text style={styles.cardDesc}>ראה מה אנשים מפרסמים</Text>
// // // // // // // //             </View>
// // // // // // // //             <Text style={styles.arrow}>❮</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>

// // // // // // // //         <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
// // // // // // // //           <Text style={styles.logoutText}>התנתק מהחשבון</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </ScrollView>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: { flex: 1, backgroundColor: '#FFFFFF' },
// // // // // // // //   topBar: { 
// // // // // // // //     flexDirection: 'row', 
// // // // // // // //     justifyContent: 'space-between', 
// // // // // // // //     alignItems: 'center', 
// // // // // // // //     paddingHorizontal: 25, 
// // // // // // // //     paddingVertical: 20,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#F4F4F5'
// // // // // // // //   },
// // // // // // // //   headerTextContainer: { alignItems: 'flex-end' },
// // // // // // // //   welcomeText: { fontSize: 14, color: '#71717A', fontWeight: '500' },
// // // // // // // //   mainTitle: { fontSize: 24, fontWeight: '900', color: '#18181B' },
  
// // // // // // // //   inviteBadgeContainer: { position: 'relative', padding: 5 },
// // // // // // // //   bellIconBox: { 
// // // // // // // //     width: 45, 
// // // // // // // //     height: 45, 
// // // // // // // //     borderRadius: 15, 
// // // // // // // //     backgroundColor: '#F4F4F5', 
// // // // // // // //     justifyContent: 'center', 
// // // // // // // //     alignItems: 'center' 
// // // // // // // //   },
// // // // // // // //   bellIcon: { fontSize: 22 },
// // // // // // // //   badgeNumber: { 
// // // // // // // //     position: 'absolute', 
// // // // // // // //     top: -5, 
// // // // // // // //     left: -5, 
// // // // // // // //     backgroundColor: '#EF4444', 
// // // // // // // //     minWidth: 20, 
// // // // // // // //     height: 20, 
// // // // // // // //     borderRadius: 10, 
// // // // // // // //     justifyContent: 'center', 
// // // // // // // //     alignItems: 'center',
// // // // // // // //     borderWidth: 2,
// // // // // // // //     borderColor: '#FFF'
// // // // // // // //   },
// // // // // // // //   badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

// // // // // // // //   scrollContainer: { padding: 25 },
// // // // // // // //   statusCard: { 
// // // // // // // //     backgroundColor: '#F8FAFF', 
// // // // // // // //     padding: 15, 
// // // // // // // //     borderRadius: 16, 
// // // // // // // //     marginBottom: 30, 
// // // // // // // //     borderWidth: 1, 
// // // // // // // //     borderColor: '#E0E7FF',
// // // // // // // //     alignItems: 'center'
// // // // // // // //   },
// // // // // // // //   statusText: { color: '#4338CA', fontSize: 14 },
// // // // // // // //   boldText: { fontWeight: 'bold' },

// // // // // // // //   section: { marginBottom: 35 },
// // // // // // // //   sectionLabel: { fontSize: 14, fontWeight: '700', color: '#A1A1AA', marginBottom: 15, textAlign: 'right', textTransform: 'uppercase' },
  
// // // // // // // //   actionCard: { 
// // // // // // // //     flexDirection: 'row-reverse', 
// // // // // // // //     alignItems: 'center', 
// // // // // // // //     backgroundColor: '#FFF', 
// // // // // // // //     borderRadius: 20, 
// // // // // // // //     padding: 15,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#F1F5F9',
// // // // // // // //     elevation: 3,
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOpacity: 0.05,
// // // // // // // //     shadowRadius: 10
// // // // // // // //   },
// // // // // // // //   iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
// // // // // // // //   iconSize: { fontSize: 24 },
// // // // // // // //   cardContent: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
// // // // // // // //   cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
// // // // // // // //   cardDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
// // // // // // // //   arrow: { color: '#CBD5E1', fontSize: 16, marginLeft: 10 },

// // // // // // // //   logoutBtn: { marginTop: 20, alignItems: 'center' },
// // // // // // // //   logoutText: { color: '#EF4444', fontWeight: '700' }
// // // // // // // // });

// // // // // // // // export default MenuScreen;


// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import { 
// // // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // // //   ScrollView, ActivityIndicator, LayoutAnimation, Platform, UIManager 
// // // // // // // } from 'react-native';
// // // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // // // מאפשר אנימציות באנדרואיד
// // // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // // //   UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // // }

// // // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // // //   const { userName } = route.params || { userName: 'אורח' };
  
// // // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // // //   const [isExpanded, setIsExpanded] = useState(false); // האם רשימת ההזמנות פתוחה
// // // // // // //   const [loadingInviteId, setLoadingInviteId] = useState<string | null>(null);

// // // // // // //   const fetchInvitations = async () => {
// // // // // // //     try {
// // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // // // // //       if (response.ok) {
// // // // // // //         const data = await response.json();
// // // // // // //         const invites = Array.isArray(data) ? data : [];
// // // // // // //         setInvitations(invites);
// // // // // // //         // אם ההזמנות נגמרו, נסגור את התפריט אוטומטית
// // // // // // //         if (invites.length === 0) setIsExpanded(false);
// // // // // // //       }
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Fetch Invites Error:", error);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     fetchInvitations();
// // // // // // //     const interval = setInterval(fetchInvitations, 10000);
// // // // // // //     return () => clearInterval(interval);
// // // // // // //   }, []);

// // // // // // //   const toggleInvites = () => {
// // // // // // //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // // // //     setIsExpanded(!isExpanded);
// // // // // // //   };

// // // // // // //   const handleInviteAction = async (inviteId: string, action: 'accept' | 'decline') => {
// // // // // // //     setLoadingInviteId(inviteId);
// // // // // // //     try {
// // // // // // //       const endpoint = action === 'accept' ? 'accept' : 'decline';
// // // // // // //       const response = await fetch(`${BASE_URL}/groups/invitations/${endpoint}?invitationId=${inviteId}`, {
// // // // // // //         method: 'POST'
// // // // // // //       });
      
// // // // // // //       if (response.ok) {
// // // // // // //         LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
// // // // // // //         fetchInvitations();
// // // // // // //       }
// // // // // // //     } catch (error) {
// // // // // // //       Alert.alert("שגיאה", "משהו השתבש בתקשורת");
// // // // // // //     } finally {
// // // // // // //       setLoadingInviteId(null);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // // // // // //         {/* Header */}
// // // // // // //         <View style={styles.header}>
// // // // // // //           <Text style={styles.welcomeText}>היי, {userName} 👋</Text>
// // // // // // //           <Text style={styles.title}>מה עושים היום?</Text>
// // // // // // //         </View>

// // // // // // //         {/* --- כפתור הזמנות מתקפל (מופיע רק כשיש הזמנות) --- */}
// // // // // // //         {invitations.length > 0 && (
// // // // // // //           <View style={styles.invitesWrapper}>
// // // // // // //             <TouchableOpacity 
// // // // // // //               style={[styles.inviteToggleBtn, isExpanded && styles.activeToggle]} 
// // // // // // //               onPress={toggleInvites}
// // // // // // //               activeOpacity={0.9}
// // // // // // //             >
// // // // // // //               <Text style={styles.arrowIcon}>{isExpanded ? '▲' : '▼'}</Text>
// // // // // // //               <View style={styles.badge}>
// // // // // // //                 <Text style={styles.badgeText}>{invitations.length}</Text>
// // // // // // //               </View>
// // // // // // //               <Text style={styles.inviteToggleText}>יש לך הזמנות חדשות לקבוצות!</Text>
// // // // // // //               <Text style={{fontSize: 18, marginLeft: 8}}>📩</Text>
// // // // // // //             </TouchableOpacity>

// // // // // // //             {isExpanded && (
// // // // // // //               <View style={styles.expandedContent}>
// // // // // // //                 {invitations.map((invite) => (
// // // // // // //                   <View key={invite.id} style={styles.inviteCard}>
// // // // // // //                     <View style={{alignItems: 'flex-end', marginBottom: 12}}>
// // // // // // //                       <Text style={styles.inviteGroupName}>{invite.groupName || invite.name}</Text>
// // // // // // //                       <Text style={styles.inviteSender}>הוזמנת ע"י {invite.inviterUsername}</Text>
// // // // // // //                     </View>

// // // // // // //                     <View style={styles.actionRow}>
// // // // // // //                       <TouchableOpacity 
// // // // // // //                         style={[styles.actionBtn, styles.acceptBtn]} 
// // // // // // //                         onPress={() => handleInviteAction(invite.id, 'accept')}
// // // // // // //                         disabled={loadingInviteId === invite.id}
// // // // // // //                       >
// // // // // // //                         {loadingInviteId === invite.id ? (
// // // // // // //                           <ActivityIndicator size="small" color="#FFF" />
// // // // // // //                         ) : (
// // // // // // //                           <Text style={styles.acceptText}>אישור ✅</Text>
// // // // // // //                         )}
// // // // // // //                       </TouchableOpacity>
                      
// // // // // // //                       <TouchableOpacity 
// // // // // // //                         style={[styles.actionBtn, styles.declineBtn]} 
// // // // // // //                         onPress={() => handleInviteAction(invite.id, 'decline')}
// // // // // // //                       >
// // // // // // //                         <Text style={styles.declineText}>התעלם</Text>
// // // // // // //                       </TouchableOpacity>
// // // // // // //                     </View>
// // // // // // //                   </View>
// // // // // // //                 ))}
// // // // // // //               </View>
// // // // // // //             )}
// // // // // // //           </View>
// // // // // // //         )}

// // // // // // //         {/* --- תפריט ראשי --- */}
// // // // // // //         <View style={styles.menuGrid}>
// // // // // // //           <TouchableOpacity 
// // // // // // //             style={styles.menuItem} 
// // // // // // //             onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // // // //           >
// // // // // // //             <View style={[styles.iconCircle, {backgroundColor: '#E0E7FF'}]}>
// // // // // // //               <Text style={{fontSize: 30}}>👥</Text>
// // // // // // //             </View>
// // // // // // //             <Text style={styles.menuItemTitle}>הקבוצות שלי</Text>
// // // // // // //           </TouchableOpacity>

// // // // // // //           <TouchableOpacity 
// // // // // // //             style={styles.menuItem} 
// // // // // // //             onPress={() => navigation.navigate('GlobalFeed', { userName })}
// // // // // // //           >
// // // // // // //             <View style={[styles.iconCircle, {backgroundColor: '#DCFCE7'}]}>
// // // // // // //               <Text style={{fontSize: 30}}>🌐</Text>
// // // // // // //             </View>
// // // // // // //             <Text style={styles.menuItemTitle}>פיד ציבורי</Text>
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>

// // // // // // //         <TouchableOpacity 
// // // // // // //           style={styles.createBtn} 
// // // // // // //           onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // // // //         >
// // // // // // //           <Text style={styles.createBtnText}>➕ צור קבוצה חדשה</Text>
// // // // // // //         </TouchableOpacity>

// // // // // // //         <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
// // // // // // //           <Text style={styles.logoutText}>התנתקות</Text>
// // // // // // //         </TouchableOpacity>

// // // // // // //       </ScrollView>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: { flex: 1, backgroundColor: '#F8F9FB' },
// // // // // // //   scrollContainer: { padding: 20 },
// // // // // // //   header: { marginBottom: 25, alignItems: 'flex-end' },
// // // // // // //   welcomeText: { fontSize: 16, color: '#64748B' },
// // // // // // //   title: { fontSize: 28, fontWeight: '800', color: '#1E293B' },

// // // // // // //   // עיצוב אזור ההזמנות המתקפל
// // // // // // //   invitesWrapper: { 
// // // // // // //     marginBottom: 25, 
// // // // // // //     borderRadius: 18, 
// // // // // // //     backgroundColor: '#FFF', 
// // // // // // //     overflow: 'hidden',
// // // // // // //     elevation: 4,
// // // // // // //     shadowColor: '#6200EE',
// // // // // // //     shadowOpacity: 0.1,
// // // // // // //     shadowRadius: 10
// // // // // // //   },
// // // // // // //   inviteToggleBtn: { 
// // // // // // //     flexDirection: 'row', 
// // // // // // //     alignItems: 'center', 
// // // // // // //     padding: 16, 
// // // // // // //     backgroundColor: '#6200EE' 
// // // // // // //   },
// // // // // // //   activeToggle: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
// // // // // // //   inviteToggleText: { flex: 1, color: '#FFF', fontWeight: 'bold', textAlign: 'right', fontSize: 15 },
// // // // // // //   badge: { backgroundColor: '#FF3B30', minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10, paddingHorizontal: 4 },
// // // // // // //   badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
// // // // // // //   arrowIcon: { color: '#FFF', fontSize: 10, marginRight: 5, opacity: 0.8 },

// // // // // // //   expandedContent: { padding: 12, backgroundColor: '#F1F5F9' },
// // // // // // //   inviteCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10 },
// // // // // // //   inviteGroupName: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
// // // // // // //   inviteSender: { fontSize: 13, color: '#64748B' },
  
// // // // // // //   actionRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 5 },
// // // // // // //   actionBtn: { paddingVertical: 8, borderRadius: 10, flex: 1, alignItems: 'center' },
// // // // // // //   acceptBtn: { backgroundColor: '#42B72A', marginLeft: 10 },
// // // // // // //   declineBtn: { backgroundColor: '#E2E8F0' },
// // // // // // //   acceptText: { color: '#FFF', fontWeight: 'bold' },
// // // // // // //   declineText: { color: '#475569', fontWeight: 'bold' },

// // // // // // //   // תפריט
// // // // // // //   menuGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
// // // // // // //   menuItem: { backgroundColor: '#FFF', width: '48%', padding: 20, borderRadius: 24, alignItems: 'center', elevation: 2 },
// // // // // // //   iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
// // // // // // //   menuItemTitle: { fontWeight: '700', color: '#334155' },

// // // // // // //   createBtn: { backgroundColor: '#FFF', padding: 18, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1' },
// // // // // // //   createBtnText: { color: '#6200EE', fontWeight: 'bold' },
  
// // // // // // //   logoutBtn: { marginTop: 25, alignItems: 'center' },
// // // // // // //   logoutText: { color: '#EF4444', fontWeight: '600' }
// // // // // // // });

// // // // // // // export default MenuScreen;
// // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // import { 
// // // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // // //   ScrollView, ActivityIndicator, LayoutAnimation, Platform, UIManager, Animated, Modal
// // // // // // } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
// // // // // //   UIManager.setLayoutAnimationEnabledExperimental(true);
// // // // // // }

// // // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // // //   const { userName } = route.params || { userName: 'אורח' };
  
// // // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // // //   const [myGroups, setMyGroups] = useState<any[]>([]); // לרשימת הקבוצות בפרסום פוסט
// // // // // //   const [isInvitesOpen, setIsInvitesOpen] = useState(false);
// // // // // //   const [postModalVisible, setPostModalVisible] = useState(false);
  
// // // // // //   // אנימציה לפעמון
// // // // // //   const bellAnim = useRef(new Animated.Value(0)).current;

// // // // // //   useEffect(() => {
// // // // // //     fetchData();
// // // // // //     const interval = setInterval(fetchData, 10000);
// // // // // //     return () => clearInterval(interval);
// // // // // //   }, []);

// // // // // //   const fetchData = async () => {
// // // // // //     try {
// // // // // //       // משיכת הזמנות
// // // // // //       const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // // // //       const invData = await invRes.json();
// // // // // //       setInvitations(Array.isArray(invData) ? invData : []);
      
// // // // // //       if (invData.length > 0) startBellSwing();

// // // // // //       // משיכת הקבוצות שלי (בשביל ה-Modal של הפוסט)
// // // // // //       const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
// // // // // //       const groupsData = await groupsRes.json();
// // // // // //       setMyGroups(Array.isArray(groupsData) ? groupsData : []);
// // // // // //     } catch (e) { console.log(e); }
// // // // // //   };

// // // // // //   const startBellSwing = () => {
// // // // // //     Animated.loop(
// // // // // //       Animated.sequence([
// // // // // //         Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
// // // // // //         Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
// // // // // //         Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
// // // // // //       ])
// // // // // //     ).start();
// // // // // //   };

// // // // // //   const rotation = bellAnim.interpolate({
// // // // // //     inputRange: [-1, 1],
// // // // // //     outputRange: ['-20deg', '20deg']
// // // // // //   });

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // // // // //         {/* Header מעוצב כאיור */}
// // // // // //         <View style={styles.illustrationHeader}>
// // // // // //           <View style={styles.headerTextStack}>
// // // // // //             <Text style={styles.helloText}>שלום, {userName} ✨</Text>
// // // // // //             <Text style={styles.brandTitle}>העולם שלך מחכה</Text>
// // // // // //           </View>
          
// // // // // //           {/* פעמון הזמנות מתנדנד */}
// // // // // //           {invitations.length > 0 && (
// // // // // //             <TouchableOpacity onPress={() => {
// // // // // //               LayoutAnimation.easeInEaseOut();
// // // // // //               setIsInvitesOpen(!isInvitesOpen);
// // // // // //             }}>
// // // // // //               <Animated.View style={{ transform: [{ rotate: rotation }] }}>
// // // // // //                 <View style={styles.bellCircle}>
// // // // // //                   <Text style={{fontSize: 24}}>🔔</Text>
// // // // // //                   <View style={styles.redDot}><Text style={styles.dotText}>{invitations.length}</Text></View>
// // // // // //                 </View>
// // // // // //               </Animated.View>
// // // // // //             </TouchableOpacity>
// // // // // //           )}
// // // // // //         </View>

// // // // // //         {/* רשימת הזמנות נפתחת */}
// // // // // //         {isInvitesOpen && invitations.length > 0 && (
// // // // // //           <View style={styles.pastelInvitesCard}>
// // // // // //              <Text style={styles.cardHeader}>הזמנות חדשות</Text>
// // // // // //              {invitations.map(inv => (
// // // // // //                <View key={inv.id} style={styles.invRow}>
// // // // // //                  <Text style={styles.invText}>{inv.groupName}</Text>
// // // // // //                  <TouchableOpacity style={styles.miniAcceptBtn}><Text style={{color: '#FFF'}}>אשר</Text></TouchableOpacity>
// // // // // //                </View>
// // // // // //              ))}
// // // // // //           </View>
// // // // // //         )}

// // // // // //         {/* Grid כפתורים - פסטל רך */}
// // // // // //         <View style={styles.grid}>
// // // // // //           <TouchableOpacity 
// // // // // //             style={[styles.bigCard, {backgroundColor: '#E0F2FE'}]} 
// // // // // //             onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // // //           >
// // // // // //             <Text style={styles.cardEmoji}>💬</Text>
// // // // // //             <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
// // // // // //           </TouchableOpacity>

// // // // // //           <TouchableOpacity 
// // // // // //             style={[styles.bigCard, {backgroundColor: '#F0FDF4'}]}
// // // // // //             onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // // //           >
// // // // // //             <Text style={styles.cardEmoji}>🎨</Text>
// // // // // //             <Text style={styles.cardLabel}>יצירת קבוצה</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>

// // // // // //         {/* כפתור פרסום פוסט - בולט ומרכזי */}
// // // // // //         <TouchableOpacity 
// // // // // //           style={styles.mainPostBtn} 
// // // // // //           onPress={() => setPostModalVisible(true)}
// // // // // //         >
// // // // // //           <Text style={styles.postBtnText}>✍️ פרסם פוסט חדש</Text>
// // // // // //         </TouchableOpacity>

// // // // // //         {/* Modal בחירת יעד פוסט */}
// // // // // //         <Modal visible={postModalVisible} transparent animationType="slide">
// // // // // //           <View style={styles.modalOverlay}>
// // // // // //             <View style={styles.modalContent}>
// // // // // //               <Text style={styles.modalTitle}>איפה לפרסם?</Text>
              
// // // // // //               <TouchableOpacity 
// // // // // //                 style={[styles.modalOption, {backgroundColor: '#FEF3C7'}]}
// // // // // //                 onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}
// // // // // //               >
// // // // // //                 <Text style={styles.optionText}>🌐 פיד כללי (עולם)</Text>
// // // // // //               </TouchableOpacity>

// // // // // //               <Text style={styles.subLabel}>או בחר קבוצה:</Text>
// // // // // //               <ScrollView style={{maxHeight: 200}}>
// // // // // //                 {myGroups.map(group => (
// // // // // //                   <TouchableOpacity 
// // // // // //                     key={group.id} 
// // // // // //                     style={styles.groupOption}
// // // // // //                     onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: group.id }); }}
// // // // // //                   >
// // // // // //                     <Text style={styles.groupOptionText}>👥 {group.name}</Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 ))}
// // // // // //               </ScrollView>

// // // // // //               <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}>
// // // // // //                 <Text style={{color: '#94A3B8'}}>סגור</Text>
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </Modal>

// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#FAFAFA' },
// // // // // //   scrollContainer: { padding: 25 },
  
// // // // // //   illustrationHeader: { 
// // // // // //     flexDirection: 'row-reverse', 
// // // // // //     justifyContent: 'space-between', 
// // // // // //     alignItems: 'center', 
// // // // // //     marginBottom: 40 
// // // // // //   },
// // // // // //   headerTextStack: { alignItems: 'flex-end' },
// // // // // //   helloText: { fontSize: 16, color: '#94A3B8', fontWeight: '600' },
// // // // // //   brandTitle: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  
// // // // // //   bellCircle: { 
// // // // // //     width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF',
// // // // // //     justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.1 
// // // // // //   },
// // // // // //   redDot: { 
// // // // // //     position: 'absolute', top: 12, right: 12, backgroundColor: '#F87171',
// // // // // //     width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' 
// // // // // //   },
// // // // // //   dotText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

// // // // // //   grid: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
// // // // // //   bigCard: { 
// // // // // //     width: '48%', height: 160, borderRadius: 32, 
// // // // // //     justifyContent: 'center', alignItems: 'center', padding: 20 
// // // // // //   },
// // // // // //   cardEmoji: { fontSize: 45, marginBottom: 10 },
// // // // // //   cardLabel: { fontWeight: '800', color: '#334155', fontSize: 15 },

// // // // // //   mainPostBtn: { 
// // // // // //     backgroundColor: '#6366F1', padding: 22, borderRadius: 32, 
// // // // // //     alignItems: 'center', marginTop: 10, elevation: 8, shadowColor: '#6366F1', shadowOpacity: 0.3 
// // // // // //   },
// // // // // //   postBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

// // // // // //   pastelInvitesCard: { 
// // // // // //     backgroundColor: '#F5F3FF', borderRadius: 24, padding: 20, marginBottom: 20,
// // // // // //     borderWidth: 1, borderColor: '#DDD6FE' 
// // // // // //   },
// // // // // //   cardHeader: { fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
// // // // // //   invRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
// // // // // //   miniAcceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 },

// // // // // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
// // // // // //   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center' },
// // // // // //   modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
// // // // // //   modalOption: { width: '100%', padding: 20, borderRadius: 20, marginBottom: 15, alignItems: 'center' },
// // // // // //   optionText: { fontWeight: 'bold', color: '#92400E' },
// // // // // //   subLabel: { alignSelf: 'flex-end', marginVertical: 10, color: '#64748B' },
// // // // // //   groupOption: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
// // // // // //   groupOptionText: { fontSize: 16, color: '#1E293B' },
// // // // // //   closeBtn: { marginTop: 20 }
// // // // // //   invText: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#4C1D95', // סגול כהה עמוק שמתאים לרקע הפסטל
// // // // // //     textAlign: 'right',
// // // // // //     flex: 1, // מאפשר לטקסט לתפוס את המקום ודוחף את הכפתור לשמאל
// // // // // //     marginRight: 10,
// // // // // //   },
  
// // // // // //   // הוספתי גם סטייל לכפתור ה"אשר" הקטן שיהיה מעוגל ויפה יותר:
// // // // // //   miniAcceptBtn: {
// // // // // //     backgroundColor: '#8B5CF6',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 14,
// // // // // //     shadowColor: '#8B5CF6',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.2,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 3,
// // // // // //   },

// // // // // //   miniAcceptText: {
// // // // // //     color: '#FFF',
// // // // // //     fontWeight: '800',
// // // // // //     fontSize: 13,
// // // // // //   },
// // // // // // });

// // // // // // export default MenuScreen;
// // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // import { 
// // // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // // //   ScrollView, Animated, ActivityIndicator, Modal, Platform, LayoutAnimation 
// // // // // } from 'react-native';
// // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // import { BASE_URL } from '../api/Constants';

// // // // // const MenuScreen = ({ navigation, route }: any) => {
// // // // //   const { userName } = route.params || { userName: 'אורח' };
  
// // // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // // //   const [myGroups, setMyGroups] = useState<any[]>([]);
// // // // //   const [isInvitesOpen, setIsInvitesOpen] = useState(false);
// // // // //   const [postModalVisible, setPostModalVisible] = useState(false);
// // // // //   const [loadingAction, setLoadingAction] = useState<string | null>(null);

// // // // //   // אנימציה לפעמון
// // // // //   const bellAnim = useRef(new Animated.Value(0)).current;

// // // // //   const fetchData = async () => {
// // // // //     try {
// // // // //       // משיכת הזמנות
// // // // //       const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // // //       const invData = await invRes.json();
// // // // //       setInvitations(Array.isArray(invData) ? invData : []);
// // // // //       if (invData.length > 0) startBellSwing();

// // // // //       // משיכת הקבוצות שלי לצורך בחירה בפוסט
// // // // //       const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
// // // // //       const groupsData = await groupsRes.json();
// // // // //       setMyGroups(Array.isArray(groupsData) ? groupsData : []);
// // // // //     } catch (e) { console.log("Fetch error:", e); }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchData();
// // // // //     const interval = setInterval(fetchData, 10000);
// // // // //     return () => clearInterval(interval);
// // // // //   }, []);

// // // // //   const startBellSwing = () => {
// // // // //     Animated.loop(
// // // // //       Animated.sequence([
// // // // //         Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
// // // // //         Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
// // // // //         Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
// // // // //       ])
// // // // //     ).start();
// // // // //   };

// // // // //   const bellRotation = bellAnim.interpolate({
// // // // //     inputRange: [-1, 1],
// // // // //     outputRange: ['-20deg', '20deg']
// // // // //   });

// // // // //   const handleInviteAction = async (inviteId: string, action: 'accept' | 'decline') => {
// // // // //     setLoadingAction(inviteId);
// // // // //     try {
// // // // //       const endpoint = action === 'accept' ? 'accept' : 'decline';
// // // // //       const res = await fetch(`${BASE_URL}/groups/invitations/${endpoint}?invitationId=${inviteId}`, { method: 'POST' });
// // // // //       if (res.ok) {
// // // // //         Alert.alert("בוצע!", action === 'accept' ? "הצטרפת לקבוצה" : "ההזמנה נדחתה");
// // // // //         fetchData();
// // // // //       }
// // // // //     } catch (e) { Alert.alert("שגיאה", "פעולה נכשלה"); }
// // // // //     finally { setLoadingAction(null); }
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
        
// // // // //         {/* Header פסטל */}
// // // // //         <View style={styles.header}>
// // // // //           <View style={styles.headerText}>
// // // // //             <Text style={styles.welcomeText}>היי {userName},</Text>
// // // // //             <Text style={styles.mainTitle}>מה עושים היום? ✨</Text>
// // // // //           </View>
          
// // // // //           {/* פעמון מתנדנד */}
// // // // //           <TouchableOpacity onPress={() => {
// // // // //             LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // // //             setIsInvitesOpen(!isInvitesOpen);
// // // // //           }}>
// // // // //             <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
// // // // //               <View style={[styles.bellContainer, invitations.length > 0 && styles.bellActive]}>
// // // // //                 <Text style={{fontSize: 26}}>🔔</Text>
// // // // //                 {invitations.length > 0 && (
// // // // //                   <View style={styles.badge}><Text style={styles.badgeText}>{invitations.length}</Text></View>
// // // // //                 )}
// // // // //               </View>
// // // // //             </Animated.View>
// // // // //           </TouchableOpacity>
// // // // //         </View>

// // // // //         {/* רשימת הזמנות בעיצוב ציור פסטל */}
// // // // //         {isInvitesOpen && invitations.length > 0 && (
// // // // //           <View style={styles.invitesSection}>
// // // // //             <Text style={styles.sectionTitle}>הזמנות שמחכות לך:</Text>
// // // // //             {invitations.map((inv) => (
// // // // //               <View key={inv.id} style={styles.inviteCard}>
// // // // //                 <TouchableOpacity 
// // // // //                   style={styles.acceptBtn} 
// // // // //                   onPress={() => handleInviteAction(inv.id, 'accept')}
// // // // //                 >
// // // // //                   <Text style={styles.acceptBtnText}>אשר</Text>
// // // // //                 </TouchableOpacity>
// // // // //                 <Text style={styles.invText}>{inv.groupName}</Text>
// // // // //               </View>
// // // // //             ))}
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Grid כפתורים */}
// // // // //         <View style={styles.grid}>
// // // // //           <TouchableOpacity 
// // // // //             style={[styles.bigCard, {backgroundColor: '#E0F2FE'}]} 
// // // // //             onPress={() => navigation.navigate('MyGroups', { userName })}
// // // // //           >
// // // // //             <Text style={styles.cardEmoji}>💬</Text>
// // // // //             <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
// // // // //           </TouchableOpacity>

// // // // //           <TouchableOpacity 
// // // // //             style={[styles.bigCard, {backgroundColor: '#F0FDF4'}]}
// // // // //             onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // // //           >
// // // // //             <Text style={styles.cardEmoji}>🎨</Text>
// // // // //             <Text style={styles.cardLabel}>יצירת קבוצה</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>

// // // // //         {/* כפתור פרסום פוסט */}
// // // // //         <TouchableOpacity style={styles.postBtn} onPress={() => setPostModalVisible(true)}>
// // // // //           <Text style={styles.postBtnText}>✍️ פרסם פוסט חדש</Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* כפתור פיד כללי */}
// // // // //         <TouchableOpacity style={styles.feedBtn} onPress={() => navigation.navigate('GlobalFeed', { userName })}>
// // // // //           <Text style={styles.feedBtnText}>🌐 הפיד הגלובלי</Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* Modal בחירת קבוצה לפוסט */}
// // // // //         <Modal visible={postModalVisible} transparent animationType="fade">
// // // // //           <View style={styles.modalOverlay}>
// // // // //             <View style={styles.modalContent}>
// // // // //               <Text style={styles.modalTitle}>איפה לפרסם?</Text>
              
// // // // //               <TouchableOpacity 
// // // // //                 style={styles.worldOption}
// // // // //                 onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}
// // // // //               >
// // // // //                 <Text style={styles.optionText}>🌍 לכל העולם</Text>
// // // // //               </TouchableOpacity>

// // // // //               <Text style={styles.modalSub}>או בחר קבוצה שלך:</Text>
// // // // //               <ScrollView style={{width: '100%', maxHeight: 200}}>
// // // // //                 {myGroups.map(g => (
// // // // //                   <TouchableOpacity 
// // // // //                     key={g.id} 
// // // // //                     style={styles.groupItem}
// // // // //                     onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: g.id }); }}
// // // // //                   >
// // // // //                     <Text style={styles.groupItemText}>👥 {g.name}</Text>
// // // // //                   </TouchableOpacity>
// // // // //                 ))}
// // // // //               </ScrollView>
              
// // // // //               <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}>
// // // // //                 <Text style={{color: '#94A3B8'}}>סגור</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </Modal>

// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#FAF9FF' },
// // // // //   scrollContainer: { padding: 25 },
// // // // //   header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
// // // // //   headerText: { alignItems: 'flex-end' },
// // // // //   welcomeText: { fontSize: 16, color: '#94A3B8' },
// // // // //   mainTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B' },
  
// // // // //   bellContainer: { width: 55, height: 55, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
// // // // //   bellActive: { backgroundColor: '#FFFEEB', borderWidth: 1, borderColor: '#FEF08A' },
// // // // //   badge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#F87171', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
// // // // //   badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

// // // // //   invitesSection: { backgroundColor: '#F5F3FF', borderRadius: 25, padding: 20, marginBottom: 20 },
// // // // //   sectionTitle: { textAlign: 'right', fontWeight: 'bold', color: '#4C1D95', marginBottom: 15 },
// // // // //   inviteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 18, alignItems: 'center', marginBottom: 10 },
  
// // // // //   // כאן התיקון ל-INVTEXT
// // // // //   invText: { flex: 1, textAlign: 'right', fontSize: 16, fontWeight: '700', color: '#4C1D95', marginRight: 10 },
// // // // //   acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
// // // // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

// // // // //   grid: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 20 },
// // // // //   bigCard: { width: '47%', height: 150, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
// // // // //   cardEmoji: { fontSize: 40, marginBottom: 10 },
// // // // //   cardLabel: { fontWeight: '800', color: '#334155' },

// // // // //   postBtn: { backgroundColor: '#6366F1', padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 12 },
// // // // //   postBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
// // // // //   feedBtn: { backgroundColor: '#FFF', padding: 18, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
// // // // //   feedBtnText: { color: '#64748B', fontWeight: '600' },

// // // // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
// // // // //   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 35, padding: 25, alignItems: 'center' },
// // // // //   modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
// // // // //   worldOption: { backgroundColor: '#FEF3C7', width: '100%', padding: 18, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
// // // // //   optionText: { fontWeight: 'bold', color: '#92400E', fontSize: 16 },
// // // // //   modalSub: { alignSelf: 'flex-end', marginVertical: 10, color: '#94A3B8', fontWeight: 'bold' },
// // // // //   groupItem: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
// // // // //   groupItemText: { fontSize: 16, color: '#1E293B' },
// // // // //   closeBtn: { marginTop: 20 }
// // // // // });

// // // // // export default MenuScreen;
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { 
// // // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // // //   ScrollView, Animated, Modal, Platform, LayoutAnimation 
// // // // } from 'react-native';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import { BASE_URL } from '../api/Constants';

// // // // const MenuScreen = ({ navigation, route }: any) => {
// // // //   const { userName } = route.params || { userName: 'אורח' };
  
// // // //   const [invitations, setInvitations] = useState<any[]>([]);
// // // //   const [myGroups, setMyGroups] = useState<any[]>([]);
// // // //   const [isInvitesOpen, setIsInvitesOpen] = useState(false);
// // // //   const [postModalVisible, setPostModalVisible] = useState(false);

// // // //   const bellAnim = useRef(new Animated.Value(0)).current;

// // // //   const fetchData = async () => {
// // // //     try {
// // // //       const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // //       const invData = await invRes.json();
// // // //       setInvitations(Array.isArray(invData) ? invData : []);
// // // //       if (invData.length > 0) startBellSwing();

// // // //       const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
// // // //       const groupsData = await groupsRes.json();
// // // //       setMyGroups(Array.isArray(groupsData) ? groupsData : []);
// // // //     } catch (e) { console.log(e); }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchData();
// // // //     const interval = setInterval(fetchData, 10000);
// // // //     return () => clearInterval(interval);
// // // //   }, []);

// // // //   const startBellSwing = () => {
// // // //     Animated.loop(
// // // //       Animated.sequence([
// // // //         Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
// // // //         Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
// // // //         Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
// // // //       ])
// // // //     ).start();
// // // //   };

// // // //   const bellRotation = bellAnim.interpolate({
// // // //     inputRange: [-1, 1],
// // // //     outputRange: ['-20deg', '20deg']
// // // //   });

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // // //         {/* Header */}
// // // //         <View style={styles.header}>
// // // //           <View style={styles.headerText}>
// // // //             <Text style={styles.welcomeText}>היי {userName},</Text>
// // // //             <Text style={styles.mainTitle}>העולם שלך ✨</Text>
// // // //           </View>
          
// // // //           <TouchableOpacity onPress={() => {
// // // //             LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // // //             setIsInvitesOpen(!isInvitesOpen);
// // // //           }}>
// // // //             <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
// // // //               <View style={[styles.bellContainer, invitations.length > 0 && styles.bellActive]}>
// // // //                 <Text style={{fontSize: 26}}>🔔</Text>
// // // //                 {invitations.length > 0 && (
// // // //                   <View style={styles.badge}><Text style={styles.badgeText}>{invitations.length}</Text></View>
// // // //                 )}
// // // //               </View>
// // // //             </Animated.View>
// // // //           </TouchableOpacity>
// // // //         </View>

// // // //         {/* רשימת הזמנות עם שם המזמין */}
// // // //         {isInvitesOpen && invitations.length > 0 && (
// // // //           <View style={styles.invitesSection}>
// // // //             <Text style={styles.sectionTitle}>הזמנות חדשות:</Text>
// // // //             {invitations.map((inv) => (
// // // //               <View key={inv.id} style={styles.inviteCard}>
// // // //                 <TouchableOpacity style={styles.acceptBtn}>
// // // //                   <Text style={styles.acceptBtnText}>אשר</Text>
// // // //                 </TouchableOpacity>
// // // //                 <View style={styles.invTextContainer}>
// // // //                   <Text style={styles.invText}>{inv.groupName}</Text>
// // // //                   {/* הוספת שם המזמין */}
// // // //                   <Text style={styles.inviterName}>הוזמנת ע"י: {inv.invitedBy || 'חבר'}</Text>
// // // //                 </View>
// // // //               </View>
// // // //             ))}
// // // //           </View>
// // // //         )}

// // // //         {/* רשת כפתורי פסטל - 4 ריבועים במרכז */}
// // // //         <View style={styles.grid}>
// // // //           {/* שורה ראשונה */}
// // // //           <View style={styles.row}>
// // // //             <TouchableOpacity 
// // // //               style={[styles.squareCard, {backgroundColor: '#F0FDF4'}]} // ירוק פסטל
// // // //               onPress={() => navigation.navigate('CreateGroup', { userName })}
// // // //             >
// // // //               <Text style={styles.cardEmoji}>🎨</Text>
// // // //               <Text style={styles.cardLabel}>יצירת קבוצה</Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity 
// // // //               style={[styles.squareCard, {backgroundColor: '#E0F2FE'}]} // כחול פסטל
// // // //               onPress={() => navigation.navigate('MyGroups', { userName })}
// // // //             >
// // // //               <Text style={styles.cardEmoji}>💬</Text>
// // // //               <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* שורה שנייה */}
// // // //           <View style={styles.row}>
// // // //              <TouchableOpacity 
// // // //               style={[styles.squareCard, {backgroundColor: '#FFF1F2'}]} // ורוד פסטל
// // // //               onPress={() => setPostModalVisible(true)}
// // // //             >
// // // //               <Text style={styles.cardEmoji}>✍️</Text>
// // // //               <Text style={styles.cardLabel}>פרסם פוסט</Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity 
// // // //               style={[styles.squareCard, {backgroundColor: '#F5F3FF'}]} // סגול פסטל
// // // //               onPress={() => navigation.navigate('GlobalFeed', { userName })}
// // // //             >
// // // //               <Text style={styles.cardEmoji}>🌐</Text>
// // // //               <Text style={styles.cardLabel}>פיד גלובלי</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>

// // // //         {/* Modal בחירת יעד לפוסט */}
// // // //         <Modal visible={postModalVisible} transparent animationType="fade">
// // // //           <View style={styles.modalOverlay}>
// // // //             <View style={styles.modalContent}>
// // // //               <Text style={styles.modalTitle}>איפה לפרסם?</Text>
// // // //               <TouchableOpacity 
// // // //                 style={styles.worldOption}
// // // //                 onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}
// // // //               >
// // // //                 <Text style={styles.optionText}>🌍 פיד עולמי</Text>
// // // //               </TouchableOpacity>
// // // //               <Text style={styles.modalSub}>או בחר קבוצה:</Text>
// // // //               <ScrollView style={{width: '100%', maxHeight: 200}}>
// // // //                 {myGroups.map(g => (
// // // //                   <TouchableOpacity 
// // // //                     key={g.id} 
// // // //                     style={styles.groupItem}
// // // //                     onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: g.id }); }}
// // // //                   >
// // // //                     <Text style={styles.groupItemText}>👥 {g.name}</Text>
// // // //                   </TouchableOpacity>
// // // //                 ))}
// // // //               </ScrollView>
// // // //               <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}>
// // // //                 <Text style={{color: '#94A3B8', fontWeight: 'bold'}}>סגור</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </Modal>

// // // //       </ScrollView>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#FAF9FF' },
// // // //   scrollContainer: { padding: 20, paddingTop: 40 },
// // // //   header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
// // // //   headerText: { alignItems: 'flex-end' },
// // // //   welcomeText: { fontSize: 16, color: '#94A3B8' },
// // // //   mainTitle: { fontSize: 32, fontWeight: '900', color: '#1E293B' },
  
// // // //   bellContainer: { width: 60, height: 60, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
// // // //   bellActive: { backgroundColor: '#FFFEEB', borderWidth: 1, borderColor: '#FEF08A' },
// // // //   badge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#F87171', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
// // // //   badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

// // // //   invitesSection: { backgroundColor: '#F5F3FF', borderRadius: 28, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#DDD6FE' },
// // // //   sectionTitle: { textAlign: 'right', fontWeight: '800', color: '#4C1D95', marginBottom: 15 },
// // // //   inviteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 20, alignItems: 'center', marginBottom: 12 },
// // // //   invTextContainer: { flex: 1, alignItems: 'flex-end', marginRight: 12 },
// // // //   invText: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
// // // //   inviterName: { fontSize: 12, color: '#7C3AED', marginTop: 2, fontWeight: '600' },
// // // //   acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 15 },
// // // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },

// // // //   grid: { marginTop: 10 },
// // // //   row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
// // // //   squareCard: { 
// // // //     width: '47%', 
// // // //     aspectRatio: 1, // הופך אותו לריבוע מושלם
// // // //     borderRadius: 35, 
// // // //     justifyContent: 'center', 
// // // //     alignItems: 'center',
// // // //     elevation: 2,
// // // //     shadowColor: '#000',
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 10
// // // //   },
// // // //   cardEmoji: { fontSize: 45, marginBottom: 12 },
// // // //   cardLabel: { fontSize: 16, fontWeight: '900', color: '#334155' },

// // // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
// // // //   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center' },
// // // //   modalTitle: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
// // // //   worldOption: { backgroundColor: '#FEF3C7', width: '100%', padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
// // // //   optionText: { fontWeight: '800', color: '#92400E', fontSize: 18 },
// // // //   modalSub: { alignSelf: 'flex-end', marginVertical: 10, color: '#94A3B8', fontWeight: 'bold' },
// // // //   groupItem: { width: '100%', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
// // // //   groupItemText: { fontSize: 17, color: '#1E293B', fontWeight: '600' },
// // // //   closeBtn: { marginTop: 25 }
// // // // });

// // // // export default MenuScreen;
// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { 
// // //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// // //   ScrollView, Animated, Modal, LayoutAnimation, Platform 
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { BASE_URL } from '../api/Constants';

// // // const MenuScreen = ({ navigation, route }: any) => {
// // //   const { userName } = route.params || { userName: 'אורח' };
// // //   const [invitations, setInvitations] = useState<any[]>([]);
// // //   const [myGroups, setMyGroups] = useState<any[]>([]);
// // //   const [isInvitesOpen, setIsInvitesOpen] = useState(false);
// // //   const [postModalVisible, setPostModalVisible] = useState(false);

// // //   const bellAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     fetchData();
// // //     const interval = setInterval(fetchData, 10000);
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   const fetchData = async () => {
// // //     try {
// // //       const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // //       const invData = await invRes.json();
// // //       setInvitations(Array.isArray(invData) ? invData : []);
// // //       if (invData.length > 0) startBellSwing();

// // //       const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
// // //       const groupsData = await groupsRes.json();
// // //       setMyGroups(Array.isArray(groupsData) ? groupsData : []);
// // //     } catch (e) { console.log(e); }
// // //   };

// // //   const startBellSwing = () => {
// // //     Animated.loop(
// // //       Animated.sequence([
// // //         Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
// // //         Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
// // //         Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
// // //       ])
// // //     ).start();
// // //   };

// // //   const bellRotation = bellAnim.interpolate({
// // //     inputRange: [-1, 1], outputRange: ['-20deg', '20deg']
// // //   });

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// // //         {/* Header עם הצהרת המשימה של האפליקציה */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerTopRow}>
// // //             <TouchableOpacity onPress={() => {
// // //               LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// // //               setIsInvitesOpen(!isInvitesOpen);
// // //             }}>
// // //               <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
// // //                 <View style={[styles.bellContainer, invitations.length > 0 && styles.bellActive]}>
// // //                   <Text style={{fontSize: 24}}>🔔</Text>
// // //                   {invitations.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{invitations.length}</Text></View>}
// // //                 </View>
// // //               </Animated.View>
// // //             </TouchableOpacity>
// // //             <Text style={styles.welcomeText}>שלום, {userName} ✨</Text>
// // //           </View>

// // //           <View style={styles.heroSection}>
// // //             <Text style={styles.appDescription}>
// // //               אפליקציה חברתית לשיתוף מדיה ברשת עם הצפנות קריפטוגרפיות וסטגנוגרפיות. ל שלום וברוך הבא 🛡️
// // //             </Text>
// // //             <Text style={styles.subHero}>גלשו ושתפו להנאתכם בפרטיות מוחלטת.</Text>
// // //           </View>
// // //         </View>

// // //         {/* הזמנות חדשות */}
// // //         {isInvitesOpen && invitations.length > 0 && (
// // //           <View style={styles.invitesSection}>
// // //             <Text style={styles.sectionTitle}>הזמנות ממתינות</Text>
// // //             {invitations.map((inv) => (
// // //               <View key={inv.id} style={styles.inviteCard}>
// // //                 <TouchableOpacity style={styles.acceptBtn}><Text style={styles.acceptBtnText}>אשר</Text></TouchableOpacity>
// // //                 <View style={styles.invTextContainer}>
// // //                   <Text style={styles.invText}>{inv.groupName}</Text>
// // //                   <Text style={styles.inviterName}>מאת: {inv.invitedBy || 'חבר קהילה'}</Text>
// // //                 </View>
// // //               </View>
// // //             ))}
// // //           </View>
// // //         )}

// // //         {/* Grid הריבועים המסודר לפי הבקשה שלך */}
// // //         <View style={styles.grid}>
// // //           {/* שורה 1: צ'אטים בימין, פיד בשמאל */}
// // //           <View style={styles.row}>
// // //             <TouchableOpacity 
// // //               style={[styles.squareCard, {backgroundColor: '#E0F2FE'}]} 
// // //               onPress={() => navigation.navigate('MyGroups', { userName })}
// // //             >
// // //               <Text style={styles.cardEmoji}>💬</Text>
// // //               <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity 
// // //               style={[styles.squareCard, {backgroundColor: '#F5F3FF'}]} 
// // //               onPress={() => navigation.navigate('GlobalFeed', { userName })}
// // //             >
// // //               <Text style={styles.cardEmoji}>🌐</Text>
// // //               <Text style={styles.cardLabel}>פיד גלובלי</Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* שורה 2: יצירת קבוצה בימין, פוסט בשמאל */}
// // //           <View style={styles.row}>
// // //             <TouchableOpacity 
// // //               style={[styles.squareCard, {backgroundColor: '#F0FDF4'}]} 
// // //               onPress={() => navigation.navigate('CreateGroup', { userName })}
// // //             >
// // //               <Text style={styles.cardEmoji}>🎨</Text>
// // //               <Text style={styles.cardLabel}>יצירת קבוצה</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity 
// // //               style={[styles.squareCard, {backgroundColor: '#FFF1F2'}]} 
// // //               onPress={() => setPostModalVisible(true)}
// // //             >
// // //               <Text style={styles.cardEmoji}>✍️</Text>
// // //               <Text style={styles.cardLabel}>פרסם פוסט</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         {/* Modal בחירת יעד לפוסט */}
// // //         <Modal visible={postModalVisible} transparent animationType="slide">
// // //           <View style={styles.modalOverlay}>
// // //             <View style={styles.modalContent}>
// // //               <Text style={styles.modalTitle}>איפה לשתף? 🔐</Text>
// // //               <TouchableOpacity style={styles.worldOption} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}>
// // //                 <Text style={styles.optionText}>🌍 פיד עולמי (מוצפן)</Text>
// // //               </TouchableOpacity>
// // //               <Text style={styles.modalSub}>שתף בקבוצה פרטית:</Text>
// // //               <ScrollView style={{width: '100%', maxHeight: 200}}>
// // //                 {myGroups.map(g => (
// // //                   <TouchableOpacity key={g.id} style={styles.groupItem} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: g.id }); }}>
// // //                     <Text style={styles.groupItemText}>👥 {g.name}</Text>
// // //                   </TouchableOpacity>
// // //                 ))}
// // //               </ScrollView>
// // //               <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}><Text style={{color: '#94A3B8'}}>חזור</Text></TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </Modal>

// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#FAF9FF' },
// // //   scrollContainer: { padding: 20 },
  
// // //   header: { marginBottom: 30 },
// // //   headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
// // //   welcomeText: { fontSize: 18, fontWeight: '700', color: '#64748B' },
  
// // //   heroSection: { alignItems: 'flex-end', backgroundColor: '#FFF', padding: 20, borderRadius: 25, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
// // //   appDescription: { fontSize: 18, fontWeight: '900', color: '#1E293B', textAlign: 'right', lineHeight: 26 },
// // //   subHero: { fontSize: 14, color: '#94A3B8', marginTop: 8, textAlign: 'right' },

// // //   bellContainer: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
// // //   bellActive: { backgroundColor: '#FFFEEB', borderWidth: 1, borderColor: '#FEF08A' },
// // //   badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#F87171', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
// // //   badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

// // //   invitesSection: { backgroundColor: '#F5F3FF', borderRadius: 25, padding: 15, marginBottom: 25, borderWidth: 1, borderColor: '#DDD6FE' },
// // //   sectionTitle: { textAlign: 'right', fontWeight: '800', color: '#4C1D95', marginBottom: 10 },
// // //   inviteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 20, alignItems: 'center', marginBottom: 10 },
// // //   invTextContainer: { flex: 1, alignItems: 'flex-end', marginRight: 10 },
// // //   invText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
// // //   inviterName: { fontSize: 11, color: '#7C3AED' },
// // //   acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
// // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

// // //   grid: { marginTop: 10 },
// // //   row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
// // //   squareCard: { 
// // //     width: '47%', 
// // //     aspectRatio: 1, 
// // //     borderRadius: 35, 
// // //     justifyContent: 'center', 
// // //     alignItems: 'center',
// // //     elevation: 3,
// // //     shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
// // //   },
// // //   cardEmoji: { fontSize: 40, marginBottom: 10 },
// // //   cardLabel: { fontSize: 15, fontWeight: '900', color: '#334155', textAlign: 'center' },

// // //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
// // //   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center' },
// // //   modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
// // //   worldOption: { backgroundColor: '#FEF3C7', width: '100%', padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
// // //   optionText: { fontWeight: '800', color: '#92400E' },
// // //   modalSub: { alignSelf: 'flex-end', marginVertical: 10, color: '#94A3B8', fontWeight: 'bold' },
// // //   groupItem: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
// // //   groupItemText: { fontSize: 16, color: '#1E293B' },
// // //   closeBtn: { marginTop: 20 }
// // // });

// // // export default MenuScreen;
// // import React, { useState, useEffect, useRef } from 'react';
// // import { 
// //   View, Text, TouchableOpacity, StyleSheet, Alert, 
// //   ScrollView, Animated, Modal, LayoutAnimation, Image, Platform 
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { BASE_URL } from '../api/Constants';

// // const MenuScreen = ({ navigation, route }: any) => {
// //   const { userName, profileImage } = route.params || { userName: 'משתמש', profileImage: null };
// //   const [invitations, setInvitations] = useState<any[]>([]);
// //   const [myGroups, setMyGroups] = useState<any[]>([]);
// //   const [isInvitesOpen, setIsInvitesOpen] = useState(false);
// //   const [postModalVisible, setPostModalVisible] = useState(false);

// //   const bellAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     fetchData();
// //     const interval = setInterval(fetchData, 10000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// //       const invData = await invRes.json();
// //       setInvitations(Array.isArray(invData) ? invData : []);
// //       if (invData.length > 0) startBellSwing();

// //       const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
// //       const groupsData = await groupsRes.json();
// //       setMyGroups(Array.isArray(groupsData) ? groupsData : []);
// //     } catch (e) { console.log(e); }
// //   };

// //   const startBellSwing = () => {
// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
// //         Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
// //         Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
// //       ])
// //     ).start();
// //   };

// //   const bellRotation = bellAnim.interpolate({
// //     inputRange: [-1, 1], outputRange: ['-20deg', '20deg']
// //   });

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
// //         {/* לוגו האפליקציה בראש העמוד */}
// //         <View style={styles.logoRow}>
// //           <Text style={styles.logoText}>STEGO<Text style={{color: '#6366F1'}}>SHARE</Text></Text>
          
// //           <TouchableOpacity onPress={() => {
// //             LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// //             setIsInvitesOpen(!isInvitesOpen);
// //           }}>
// //             <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
// //               <View style={[styles.bellContainer, invitations.length > 0 && styles.bellActive]}>
// //                 <Text style={{fontSize: 22}}>🔔</Text>
// //                 {invitations.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{invitations.length}</Text></View>}
// //               </View>
// //             </Animated.View>
// //           </TouchableOpacity>
// //         </View>

// //         {/* פרופיל משתמש - מוגדל ולחיץ */}
// //         <TouchableOpacity 
// //           style={styles.profileHeader} 
// //           onPress={() => navigation.navigate('ProfileSettings', { userName })}
// //         >
// //           <View style={styles.profileInfo}>
// //             <Text style={styles.welcomeLabel}>ברוך הבא,</Text>
// //             <Text style={styles.userNameLarge}>{userName} ✨</Text>
// //           </View>
// //           <View style={styles.avatarWrapper}>
// //             {profileImage ? (
// //               <Image source={{ uri: profileImage }} style={styles.avatarImage} />
// //             ) : (
// //               <View style={styles.avatarPlaceholder}><Text style={{fontSize: 35}}>👤</Text></View>
// //             )}
// //             <View style={styles.editBadge}><Text style={{fontSize: 10}}>⚙️</Text></View>
// //           </View>
// //         </TouchableOpacity>

// //         {/* תיאור האפליקציה */}
// //         <View style={styles.heroSection}>
// //           <Text style={styles.appDescription}>
// //             שיתוף מדיה חברתי עם הצפנות קריפטוגרפיות וסטגנוגרפיות. 🛡️
// //           </Text>
// //           <Text style={styles.subHero}>גלשו ושתפו להנאתכם בפרטיות מוחלטת.</Text>
// //         </View>

// //         {/* הזמנות חדשות */}
// //         {isInvitesOpen && invitations.length > 0 && (
// //           <View style={styles.invitesSection}>
// //             <Text style={styles.sectionTitle}>הזמנות ממתינות</Text>
// //             {invitations.map((inv) => (
// //               <View key={inv.id} style={styles.inviteCard}>
// //                 <TouchableOpacity style={styles.acceptBtn}><Text style={styles.acceptBtnText}>אשר</Text></TouchableOpacity>
// //                 <View style={styles.invTextContainer}>
// //                   <Text style={styles.invText}>{inv.groupName}</Text>
// //                   <Text style={styles.inviterName}>מאת: {inv.invitedBy || 'חבר'}</Text>
// //                 </View>
// //               </View>
// //             ))}
// //           </View>
// //         )}

// //         {/* Grid הריבועים המסודר */}
// //         <View style={styles.grid}>
// //           <View style={styles.row}>
// //             <TouchableOpacity 
// //               style={[styles.squareCard, {backgroundColor: '#E0F2FE'}]} 
// //               onPress={() => navigation.navigate('MyGroups', { userName })}
// //             >
// //               <Text style={styles.cardEmoji}>💬</Text>
// //               <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={[styles.squareCard, {backgroundColor: '#F5F3FF'}]} 
// //               onPress={() => navigation.navigate('GlobalFeed', { userName })}
// //             >
// //               <Text style={styles.cardEmoji}>🌐</Text>
// //               <Text style={styles.cardLabel}>פיד גלובלי</Text>
// //             </TouchableOpacity>
// //           </View>

// //           <View style={styles.row}>
// //             <TouchableOpacity 
// //               style={[styles.squareCard, {backgroundColor: '#F0FDF4'}]} 
// //               onPress={() => navigation.navigate('CreateGroup', { userName })}
// //             >
// //               <Text style={styles.cardEmoji}>🎨</Text>
// //               <Text style={styles.cardLabel}>יצירת קבוצה</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity 
// //               style={[styles.squareCard, {backgroundColor: '#FFF1F2'}]} 
// //               onPress={() => setPostModalVisible(true)}
// //             >
// //               <Text style={styles.cardEmoji}>✍️</Text>
// //               <Text style={styles.cardLabel}>פרסם פוסט</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* Modal פוסט */}
// //         <Modal visible={postModalVisible} transparent animationType="fade">
// //           <View style={styles.modalOverlay}>
// //             <View style={styles.modalContent}>
// //               <Text style={styles.modalTitle}>איפה לשתף? 🔐</Text>
// //               <TouchableOpacity style={styles.worldOption} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}>
// //                 <Text style={styles.optionText}>🌍 פיד עולמי (מוצפן)</Text>
// //               </TouchableOpacity>
// //               <Text style={styles.modalSub}>שתף בקבוצה פרטית:</Text>
// //               <ScrollView style={{width: '100%', maxHeight: 200}}>
// //                 {myGroups.map(g => (
// //                   <TouchableOpacity key={g.id} style={styles.groupItem} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: g.id }); }}>
// //                     <Text style={styles.groupItemText}>👥 {g.name}</Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </ScrollView>
// //               <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}><Text style={{color: '#94A3B8'}}>חזור</Text></TouchableOpacity>
// //             </View>
// //           </View>
// //         </Modal>

// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#FAF9FF' },
// //   scrollContainer: { padding: 20 },
  
// //   logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
// //   logoText: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: 1 },
  
// //   profileHeader: { 
// //     flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', 
// //     backgroundColor: '#FFF', padding: 20, borderRadius: 30, marginBottom: 20,
// //     elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
// //   },
// //   profileInfo: { alignItems: 'flex-end', marginRight: 15 },
// //   welcomeLabel: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
// //   userNameLarge: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  
// //   avatarWrapper: { position: 'relative' },
// //   avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#E0F2FE' },
// //   avatarImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#E0F2FE' },
// //   editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },

// //   heroSection: { alignItems: 'flex-end', paddingHorizontal: 10, marginBottom: 30 },
// //   appDescription: { fontSize: 17, fontWeight: '800', color: '#334155', textAlign: 'right', lineHeight: 24 },
// //   subHero: { fontSize: 13, color: '#94A3B8', marginTop: 5, textAlign: 'right' },

// //   bellContainer: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
// //   bellActive: { backgroundColor: '#FFFEEB', borderWidth: 1, borderColor: '#FEF08A' },
// //   badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#F87171', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 },
// //   badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

// //   invitesSection: { backgroundColor: '#F5F3FF', borderRadius: 25, padding: 15, marginBottom: 25, borderLeftWidth: 5, borderLeftColor: '#8B5CF6' },
// //   sectionTitle: { textAlign: 'right', fontWeight: '800', color: '#4C1D95', marginBottom: 10 },
// //   inviteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 20, alignItems: 'center', marginBottom: 10 },
// //   invTextContainer: { flex: 1, alignItems: 'flex-end', marginRight: 10 },
// //   invText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
// //   inviterName: { fontSize: 11, color: '#7C3AED' },
// //   acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
// //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },

// //   grid: { marginTop: 10 },
// //   row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
// //   squareCard: { width: '47%', aspectRatio: 1, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
// //   cardEmoji: { fontSize: 40, marginBottom: 10 },
// //   cardLabel: { fontSize: 15, fontWeight: '900', color: '#334155' },

// //   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
// //   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center' },
// //   modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
// //   worldOption: { backgroundColor: '#FEF3C7', width: '100%', padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
// //   optionText: { fontWeight: '800', color: '#92400E' },
// //   modalSub: { alignSelf: 'flex-end', marginVertical: 10, color: '#94A3B8', fontWeight: 'bold' },
// //   groupItem: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
// //   groupItemText: { fontSize: 16, color: '#1E293B' },
// //   closeBtn: { marginTop: 20 }
// // });

// // export default MenuScreen;
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, Text, TouchableOpacity, StyleSheet, Alert, 
//   ScrollView, Animated, Modal, LayoutAnimation, Image, Platform, ActivityIndicator 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { BASE_URL } from '../api/Constants';

// const MenuScreen = ({ navigation, route }: any) => {
//   // קבלת נתונים מה-Route
//   const { userName, profileImage } = route.params || { userName: 'משתמש', profileImage: null };
  
//   // States
//   const [invitations, setInvitations] = useState<any[]>([]);
//   const [myGroups, setMyGroups] = useState<any[]>([]);
//   const [isInvitesOpen, setIsInvitesOpen] = useState(false);
//   const [postModalVisible, setPostModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const bellAnim = useRef(new Animated.Value(0)).current;

//  // 1. פונקציית אישור מעודכנת - וודא שהנתיב (URL) תואם לשרת שלך!
// const handleAcceptInvite = async (inviteId: string) => {
//   console.log("מנסה לאשר הזמנה מספר:", inviteId);
//   try {
//     setLoading(true);
//     // אם הנתיב הישן שעבד לך היה שונה, תחליף אותו כאן:
//     const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userName: userName }) 
//     });

//     if (response.ok) {
//       Alert.alert("הצלחה", "הצטרפת לקבוצה! 🎉");
//       fetchData();
//     } else {
//       const errorData = await response.json();
//       console.log("שגיאת שרת:", errorData);
//       Alert.alert("שגיאה", "השרת דחה את הבקשה");
//     }
//   } catch (error) {
//     console.error("Network Error:", error);
//     Alert.alert("שגיאה", "בעיית חיבור לשרת");
//   } finally {
//     setLoading(false);
//   }
// };

// // 2. הצגת השם בתוך ה-Map (החלק של ה-JSX)
// {invitations.map((inv) => {
//   // הדפסה לטרמינל כדי שתראה מה השדות שקיימים ב-inv
//   console.log("נתוני הזמנה מהשרת:", inv); 
  
//   return (
//     <View key={inv.id || inv._id} style={styles.inviteCard}>
//       <TouchableOpacity 
//         style={styles.acceptBtn} 
//         onPress={() => handleAcceptInvite(inv.id || inv._id)} // תמיכה גם ב-id וגם ב- _id
//       >
//         <Text style={styles.acceptBtnText}>אשר</Text>
//       </TouchableOpacity>
      
//       <View style={styles.invTextContainer}>
//   <Text style={styles.invText}>{inv.groupName || "קבוצה ללא שם"}</Text>
  
//   {/* התיקון המדויק לפי הלוגים שלך */}
//   <Text style={styles.inviterName}>
//     מאת: {inv.inviterUsername} 👑
//   </Text>
// </View>
//     </View>
//   );
// })}

//   // 2. משיכת נתונים מהשרת
//   const fetchData = async () => {
//     try {
//       // הזמנות

//       const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
//       const invData = await invRes.json();
//       setInvitations(Array.isArray(invData) ? invData : []);
//       if (Array.isArray(invData) && invData.length > 0) startBellSwing();

//       // הקבוצות שלי (בשביל ה-Modal)
//       const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
//       const groupsData = await groupsRes.json();
//       setMyGroups(Array.isArray(groupsData) ? groupsData : []);
//     } catch (e) { 
//       console.log("Fetch Error:", e); 
//     }
//   };

//   // 3. אנימציית פעמון
//   const startBellSwing = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
//         Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
//         Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
//       ])
//     ).start();
//   };

//   const bellRotation = bellAnim.interpolate({
//     inputRange: [-1, 1], outputRange: ['-20deg', '20deg']
//   });

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 10000); // בדיקה כל 10 שניות
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
//         {/* לוגו והתראות */}
//         <View style={styles.logoRow}>
//           <Text style={styles.logoText}>STEGO<Text style={{color: '#6366F1'}}>SHARE</Text></Text>
          
//           <TouchableOpacity onPress={() => {
//             LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//             setIsInvitesOpen(!isInvitesOpen);
//           }}>
//             <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
//               <View style={[styles.bellContainer, invitations.length > 0 && styles.bellActive]}>
//                 <Text style={{fontSize: 22}}>🔔</Text>
//                 {invitations.length > 0 && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{invitations.length}</Text>
//                   </View>
//                 )}
//               </View>
//             </Animated.View>
//           </TouchableOpacity>
//         </View>

//         {/* פרופיל משתמש */}
//         <TouchableOpacity 
//           style={styles.profileHeader} 
//           onPress={() => navigation.navigate('ProfileSettings', { userName })}
//         >
//           <View style={styles.profileInfo}>
//             <Text style={styles.welcomeLabel}>ברוך הבא,</Text>
//             <Text style={styles.userNameLarge}>{userName} ✨</Text>
//           </View>
//           <View style={styles.avatarWrapper}>
//             {profileImage ? (
//               <Image source={{ uri: profileImage }} style={styles.avatarImage} />
//             ) : (
//               <View style={styles.avatarPlaceholder}><Text style={{fontSize: 35}}>👤</Text></View>
//             )}
//             <View style={styles.editBadge}><Text style={{fontSize: 10}}>⚙️</Text></View>
//           </View>
//         </TouchableOpacity>

//         {/* באנר הסבר */}
//         <View style={styles.heroSection}>
//           <Text style={styles.appDescription}>
//             שיתוף מדיה חברתי עם הצפנות קריפטוגרפיות וסטגנוגרפיות. 🛡️
//           </Text>
//           <Text style={styles.subHero}>גלשו ושתפו להנאתכם בפרטיות מוחלטת.</Text>
//         </View>

//         {/* קטע הזמנות ממתינות */}
// {isInvitesOpen && invitations.length > 0 && (
//   <View style={styles.invitesSection}>
//     <Text style={styles.sectionTitle}>הזמנות ממתינות</Text>
//     {invitations.map((inv) => (
//       <View key={inv.id} style={styles.inviteCard}>
        
//         <TouchableOpacity 
//           style={styles.acceptBtn} 
//           onPress={() => handleAcceptInvite(inv.id)}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#FFF" />
//           ) : (
//             <Text style={styles.acceptBtnText}>אשר</Text>
//           )}
//         </TouchableOpacity>
        
//         <View style={styles.invTextContainer}>
//           <Text style={styles.invText}>{inv.groupName}</Text>
          
//           {/* התיקון כאן: מציג את שם השולח מהשדה שהשרת מחזיר */}
//           <Text style={styles.inviterName}>
//             מאת: {inv.senderName || inv.invitedBy || inv.inviter || "שם לא ידוע"} 👑
//           </Text>
//         </View>

//       </View>
//     ))}
//   </View>
// )}
//         {/* Grid תפריט */}
//         <View style={styles.grid}>
//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.squareCard, {backgroundColor: '#E0F2FE'}]} 
//               onPress={() => navigation.navigate('MyGroups', { userName })}
//             >
//               <Text style={styles.cardEmoji}>💬</Text>
//               <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={[styles.squareCard, {backgroundColor: '#F5F3FF'}]} 
//               onPress={() => navigation.navigate('GlobalFeed', { userName })}
//             >
//               <Text style={styles.cardEmoji}>🌐</Text>
//               <Text style={styles.cardLabel}>פיד גלובלי</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.row}>
//             <TouchableOpacity 
//               style={[styles.squareCard, {backgroundColor: '#F0FDF4'}]} 
//               onPress={() => navigation.navigate('CreateGroup', { userName })}
//             >
//               <Text style={styles.cardEmoji}>🎨</Text>
//               <Text style={styles.cardLabel}>יצירת קבוצה</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={[styles.squareCard, {backgroundColor: '#FFF1F2'}]} 
//               onPress={() => setPostModalVisible(true)}
//             >
//               <Text style={styles.cardEmoji}>✍️</Text>
//               <Text style={styles.cardLabel}>פרסם פוסט</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Modal בחירת יעד לפוסט */}
//         <Modal visible={postModalVisible} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>איפה לשתף? 🔐</Text>
//               <TouchableOpacity style={styles.worldOption} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}>
//                 <Text style={styles.optionText}>🌍 פיד עולמי (מוצפן)</Text>
//               </TouchableOpacity>
//               <Text style={styles.modalSub}>שתף בקבוצה פרטית:</Text>
//               <ScrollView style={{width: '100%', maxHeight: 200}}>
//                 {myGroups.map(g => (
//                   <TouchableOpacity key={g.id} style={styles.groupItem} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: g.id }); }}>
//                     <Text style={styles.groupItemText}>👥 {g.name}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//               <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}><Text style={{color: '#94A3B8'}}>חזור</Text></TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         <TouchableOpacity style={{marginTop: 40, alignSelf: 'center'}} onPress={() => navigation.replace('Login')}>
//            <Text style={{color: '#F87171', fontWeight: 'bold'}}>התנתק מהחשבון</Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FAF9FF' },
//   scrollContainer: { padding: 20 },
//   logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   logoText: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: 1 },
//   profileHeader: { 
//     flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', 
//     backgroundColor: '#FFF', padding: 20, borderRadius: 30, marginBottom: 20,
//     elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
//   },
//   profileInfo: { alignItems: 'flex-end', marginRight: 15 },
//   welcomeLabel: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
//   userNameLarge: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
//   avatarWrapper: { position: 'relative' },
//   avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#E0F2FE' },
//   avatarImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#E0F2FE' },
//   editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
//   heroSection: { alignItems: 'flex-end', paddingHorizontal: 10, marginBottom: 30 },
//   appDescription: { fontSize: 17, fontWeight: '800', color: '#334155', textAlign: 'right', lineHeight: 24 },
//   subHero: { fontSize: 13, color: '#94A3B8', marginTop: 5, textAlign: 'right' },
//   bellContainer: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
//   bellActive: { backgroundColor: '#FFFEEB', borderWidth: 1, borderColor: '#FEF08A' },
//   badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#F87171', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 },
//   badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
//   invitesSection: { backgroundColor: '#F5F3FF', borderRadius: 25, padding: 15, marginBottom: 25, borderLeftWidth: 5, borderLeftColor: '#8B5CF6' },
//   sectionTitle: { textAlign: 'right', fontWeight: '800', color: '#4C1D95', marginBottom: 10 },
//   inviteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 20, alignItems: 'center', marginBottom: 10, elevation: 2 },
//   invTextContainer: { flex: 1, alignItems: 'flex-end', marginRight: 10 },
//   invText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
//   inviterName: { fontSize: 11, color: '#7C3AED', fontWeight: '600', marginTop: 2 },
//   acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
//   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
//   grid: { marginTop: 10 },
//   row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
//   squareCard: { width: '47%', aspectRatio: 1, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
//   cardEmoji: { fontSize: 40, marginBottom: 10 },
//   cardLabel: { fontSize: 15, fontWeight: '900', color: '#334155' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
//   modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center' },
//   modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
//   worldOption: { backgroundColor: '#FEF3C7', width: '100%', padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
//   optionText: { fontWeight: '800', color: '#92400E' },
//   modalSub: { alignSelf: 'flex-end', marginVertical: 10, color: '#94A3B8', fontWeight: 'bold' },
//   groupItem: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
//   groupItemText: { fontSize: 16, color: '#1E293B' },
//   closeBtn: { marginTop: 20 }
// });

// export default MenuScreen;


import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Alert, 
  ScrollView, Animated, Modal, LayoutAnimation, Image, Platform, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../api/Constants';

const MenuScreen = ({ navigation, route }: any) => {
  // קבלת נתונים מה-Route
  const { userName, profileImage } = route.params || { userName: 'משתמש', profileImage: null };
  
  // States
  const [invitations, setInvitations] = useState<any[]>([]);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [isInvitesOpen, setIsInvitesOpen] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const bellAnim = useRef(new Animated.Value(0)).current;

 const handleAcceptInvite = async (inviteId: string) => {
  console.log("שולח בקשת אישור ל-ID:", inviteId);
  try {
    setLoading(true);
    // הכתובת חייבת להיות בול כמו ב-Controller למעלה!
    const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
      method: 'POST',
    });

    if (response.ok) {
      Alert.alert("הצלחה", "הצטרפת לקבוצה!");
      fetchData(); // זה ירענן את הרשימה וההזמנה תיעלם (כי היא כבר לא PENDING)
    } else {
      console.log("Server error code:", response.status);
      Alert.alert("שגיאה", "השרת החזיר שגיאה " + response.status);
    }
  } catch (error) {
    console.error("Network error:", error);
    Alert.alert("שגיאה", "אין חיבור לשרת - בדוק שה-IP נכון");
  } finally {
    setLoading(false);
  }
};
  // 2. משיכת נתונים מהשרת
  const fetchData = async () => {
    try {
      // שליפת הזמנות
      const invRes = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
      const invData = await invRes.json();
      setInvitations(Array.isArray(invData) ? invData : []);
      if (Array.isArray(invData) && invData.length > 0) startBellSwing();

      // שליפת הקבוצות שלי
      const groupsRes = await fetch(`${BASE_URL}/groups/user/${userName}`);
      const groupsData = await groupsRes.json();
      setMyGroups(Array.isArray(groupsData) ? groupsData : []);
    } catch (e) { 
      console.log("Fetch Error:", e); 
    }
  };

  // 3. אנימציית פעמון
  const startBellSwing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(bellAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
        Animated.timing(bellAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ])
    ).start();
  };

  const bellRotation = bellAnim.interpolate({
    inputRange: [-1, 1], outputRange: ['-20deg', '20deg']
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // בדיקה כל 10 שניות
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* לוגו והתראות */}
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>STEGO<Text style={{color: '#6366F1'}}>SHARE</Text></Text>
          
          <TouchableOpacity onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsInvitesOpen(!isInvitesOpen);
          }}>
            <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
              <View style={[styles.bellContainer, invitations.length > 0 && styles.bellActive]}>
                <Text style={{fontSize: 22}}>🔔</Text>
                {invitations.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{invitations.length}</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* פרופיל משתמש */}
        <TouchableOpacity 
          style={styles.profileHeader} 
          onPress={() => navigation.navigate('ProfileSettings', { userName })}
        >
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeLabel}>ברוך הבא,</Text>
            <Text style={styles.userNameLarge}>{userName} ✨</Text>
          </View>
          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}><Text style={{fontSize: 35}}>👤</Text></View>
            )}
            <View style={styles.editBadge}><Text style={{fontSize: 10}}>⚙️</Text></View>
          </View>
        </TouchableOpacity>

        {/* באנר הסבר */}
        <View style={styles.heroSection}>
          <Text style={styles.appDescription}>
            שיתוף מדיה חברתי עם הצפנות קריפטוגרפיות וסטגנוגרפיות. 🛡️
          </Text>
          <Text style={styles.subHero}>גלשו ושתפו להנאתכם בפרטיות מוחלטת.</Text>
        </View>

        {/* קטע הזמנות ממתינות */}
        {isInvitesOpen && invitations.length > 0 && (
          <View style={styles.invitesSection}>
            <Text style={styles.sectionTitle}>הזמנות ממתינות</Text>
            {invitations.map((inv) => (
  <View key={inv.id} style={styles.inviteCard}>
    
    <TouchableOpacity 
      style={styles.acceptBtn} 
      onPress={() => handleAcceptInvite(inv.id)}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text style={styles.acceptBtnText}>אשר</Text>
      )}
    </TouchableOpacity>
    
    <View style={styles.invTextContainer}>
      <Text style={styles.invText}>{inv.groupName || "קבוצה כללית"}</Text>
      
      {/* התיקון המדויק לפי הלוג ששלחת: inviterUsername */}
      <Text style={styles.inviterName}>
        מאת: {inv.inviterUsername} 👑
      </Text>
    </View>

  </View>
))}
          </View>
        )}

        {/* Grid תפריט */}
        <View style={styles.grid}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.squareCard, {backgroundColor: '#E0F2FE'}]} onPress={() => navigation.navigate('MyGroups', { userName })}>
              <Text style={styles.cardEmoji}>💬</Text>
              <Text style={styles.cardLabel}>הצ'אטים שלי</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.squareCard, {backgroundColor: '#F5F3FF'}]} onPress={() => navigation.navigate('GlobalFeed', { userName })}>
              <Text style={styles.cardEmoji}>🌐</Text>
              <Text style={styles.cardLabel}>פיד גלובלי</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.squareCard, {backgroundColor: '#F0FDF4'}]} onPress={() => navigation.navigate('CreateGroup', { userName })}>
              <Text style={styles.cardEmoji}>🎨</Text>
              <Text style={styles.cardLabel}>יצירת קבוצה</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.squareCard, {backgroundColor: '#FFF1F2'}]} onPress={() => setPostModalVisible(true)}>
              <Text style={styles.cardEmoji}>✍️</Text>
              <Text style={styles.cardLabel}>פרסם פוסט</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal בחירת יעד לפוסט */}
        <Modal visible={postModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>איפה לשתף? 🔐</Text>
              <TouchableOpacity style={styles.worldOption} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'world' }); }}>
                <Text style={styles.optionText}>🌍 פיד עולמי (מוצפן)</Text>
              </TouchableOpacity>
              <Text style={styles.modalSub}>שתף בקבוצה פרטית:</Text>
              <ScrollView style={{width: '100%', maxHeight: 200}}>
                {myGroups.map(g => (
                  <TouchableOpacity key={g.id} style={styles.groupItem} onPress={() => { setPostModalVisible(false); navigation.navigate('CreatePost', { target: 'group', groupId: g.id }); }}>
                    <Text style={styles.groupItemText}>👥 {g.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setPostModalVisible(false)} style={styles.closeBtn}><Text style={{color: '#94A3B8'}}>חזור</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={{marginTop: 40, alignSelf: 'center'}} onPress={() => navigation.replace('Login')}>
           <Text style={{color: '#F87171', fontWeight: 'bold'}}>התנתק מהחשבון</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// ... Styles (נשארים אותו דבר כפי ששלחת)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  scrollContainer: { padding: 20 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: 1 },
  profileHeader: { 
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', 
    backgroundColor: '#FFF', padding: 20, borderRadius: 30, marginBottom: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  profileInfo: { alignItems: 'flex-end', marginRight: 15 },
  welcomeLabel: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
  userNameLarge: { fontSize: 28, fontWeight: '900', color: '#1E293B' },
  avatarWrapper: { position: 'relative' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#E0F2FE' },
  avatarImage: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#E0F2FE' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  heroSection: { alignItems: 'flex-end', paddingHorizontal: 10, marginBottom: 30 },
  appDescription: { fontSize: 17, fontWeight: '800', color: '#334155', textAlign: 'right', lineHeight: 24 },
  subHero: { fontSize: 13, color: '#94A3B8', marginTop: 5, textAlign: 'right' },
  bellContainer: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  bellActive: { backgroundColor: '#FFFEEB', borderWidth: 1, borderColor: '#FEF08A' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#F87171', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  invitesSection: { backgroundColor: '#F5F3FF', borderRadius: 25, padding: 15, marginBottom: 25, borderLeftWidth: 5, borderLeftColor: '#8B5CF6' },
  sectionTitle: { textAlign: 'right', fontWeight: '800', color: '#4C1D95', marginBottom: 10 },
  inviteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 20, alignItems: 'center', marginBottom: 10, elevation: 2 },
  invTextContainer: { flex: 1, alignItems: 'flex-end', marginRight: 10 },
  invText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  inviterName: { fontSize: 11, color: '#7C3AED', fontWeight: '600', marginTop: 2 },
  acceptBtn: { backgroundColor: '#8B5CF6', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
  grid: { marginTop: 10 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 },
  squareCard: { width: '47%', aspectRatio: 1, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  cardEmoji: { fontSize: 40, marginBottom: 10 },
  cardLabel: { fontSize: 15, fontWeight: '900', color: '#334155' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
  worldOption: { backgroundColor: '#FEF3C7', width: '100%', padding: 20, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
  optionText: { fontWeight: '800', color: '#92400E' },
  modalSub: { alignSelf: 'flex-end', marginVertical: 10, color: '#94A3B8', fontWeight: 'bold' },
  groupItem: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'flex-end' },
  groupItemText: { fontSize: 16, color: '#1E293B' },
  closeBtn: { marginTop: 20 }
});

export default MenuScreen;