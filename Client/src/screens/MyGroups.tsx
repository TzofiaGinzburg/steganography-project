// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { 
// // // // // //   View, Text, TouchableOpacity, StyleSheet, FlatList, 
// // // // // //   ActivityIndicator, Alert, RefreshControl 
// // // // // // } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import { BASE_URL } from '../api/Constants';
// // // // // // const MyGroupsScreen = ({ navigation, route }: any) => {
// // // // // //   // קבלת שם המשתמש מה-Params
// // // // // //   const { userName } = route.params || { userName: 'אורח' };
// // // // // //   const MY_IP = '192.168.1.112'; // <--- וודא שזה ה-IP של המחשב שלך

// // // // // //   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
// // // // // //   const [groups, setGroups] = useState<any[]>([]);
// // // // // //   const [invites, setInvites] = useState<any[]>([]);
// // // // // //   const [loading, setLoading] = useState(false);

// // // // // //   // פונקציה לשליפת כל הנתונים
// // // // // //   const fetchData = async () => {
// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       // 1. שליפת קבוצות שאתה חבר בהן
// // // // // //       const resGroups = await fetch(`${BASE_URL}/users/${userName}/groups`);
// // // // // //       const groupsData = await resGroups.json();
// // // // // //       setGroups(Array.isArray(groupsData) ? groupsData : []);

// // // // // //       // 2. שליפת הזמנות שמחכות לך
// // // // // //       const resInvites = await fetch(`${BASE_URL}/invitations/${userName}`);
// // // // // //       const invitesData = await resInvites.json();
// // // // // //       setInvites(Array.isArray(invitesData) ? invitesData : []);

// // // // // //     } catch (error) {
// // // // // //       console.error("Error fetching data:", error);
// // // // // //       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. בדוק שה-IP נכון ושהשרת רץ.");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     fetchData();
// // // // // //   }, [userName]);

// // // // // //   // פונקציית אישור הצטרפות
// // // // // //   const handleAccept = async (inviteId: string) => {
// // // // // //     try {
// // // // // //       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
// // // // // //         method: 'POST'
// // // // // //       });
// // // // // //       if (response.ok) {
// // // // // //         Alert.alert("הצלחה", "הצטרפת לקבוצה!");
// // // // // //         fetchData(); // רענון הנתונים
// // // // // //       }
// // // // // //     } catch (e) {
// // // // // //       Alert.alert("שגיאה", "פעולת האישור נכשלה.");
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       {/* כותרת */}
// // // // // //       <View style={styles.header}>
// // // // // //         <Text style={styles.headerTitle}>הקבוצות שלי</Text>
// // // // // //       </View>

// // // // // //       {/* תפריט טאבים (Tabs) */}
// // // // // //       <View style={styles.tabBar}>
// // // // // //         <TouchableOpacity 
// // // // // //           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
// // // // // //           onPress={() => setActiveTab('invites')}
// // // // // //         >
// // // // // //           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
// // // // // //             הזמנות ({invites.length})
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>
        
// // // // // //         <TouchableOpacity 
// // // // // //           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
// // // // // //           onPress={() => setActiveTab('mine')}
// // // // // //         >
// // // // // //           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
// // // // // //             הקבוצות שלי ({groups.length})
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       {loading ? (
// // // // // //         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
// // // // // //       ) : (
// // // // // //         <FlatList
// // // // // //           data={activeTab === 'mine' ? groups : invites}
// // // // // //           keyExtractor={(item) => item.id || Math.random().toString()}
// // // // // //           contentContainerStyle={styles.listContent}
// // // // // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
// // // // // //           renderItem={({ item }) => (
// // // // // //             <View style={styles.card}>
// // // // // //               <View style={styles.cardInfo}>
// // // // // //                 <Text style={styles.cardTitle}>{item.name || item.groupName}</Text>
// // // // // //                 <Text style={styles.cardSubtitle}>
// // // // // //                   {activeTab === 'mine' ? `נוצר על ידי: ${item.creator}` : `הוזמנת על ידי: ${item.inviterUsername}`}
// // // // // //                 </Text>
// // // // // //               </View>

// // // // // //               {activeTab === 'invites' && (
// // // // // //                 <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
// // // // // //                   <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               )}
// // // // // //             </View>
// // // // // //           )}
// // // // // //           ListEmptyComponent={
// // // // // //             <Text style={styles.emptyText}>
// // // // // //               {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
// // // // // //             </Text>
// // // // // //           }
// // // // // //         />
// // // // // //       )}
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#F8F9FA' },
// // // // // //   header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
// // // // // //   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
// // // // // //   tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
// // // // // //   tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
// // // // // //   activeTab: { borderBottomColor: '#6200EE' },
// // // // // //   tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
// // // // // //   activeTabText: { color: '#6200EE' },
// // // // // //   listContent: { padding: 15 },
// // // // // //   card: { 
// // // // // //     backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
// // // // // //     shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
// // // // // //   },
// // // // // //   cardInfo: { alignItems: 'flex-end' },
// // // // // //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
// // // // // //   cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
// // // // // //   acceptBtn: { 
// // // // // //     backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
// // // // // //     marginTop: 15, alignItems: 'center' 
// // // // // //   },
// // // // // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
// // // // // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// // // // // // });

// // // // // // export default MyGroupsScreen;
// // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // import { 
// // // // //   View, Text, TouchableOpacity, StyleSheet, FlatList, 
// // // // //   ActivityIndicator, Alert, RefreshControl 
// // // // // } from 'react-native';
// // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // import { useFocusEffect } from '@react-navigation/native'; 
// // // // // import { BASE_URL } from '../api/Constants';

// // // // // const MyGroups= ({ navigation, route }: any) => {
// // // // //   // קבלת שם המשתמש מה-Params
// // // // //   const { userName } = route.params || { userName: 'אורח' };

// // // // //   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
// // // // //   const [groups, setGroups] = useState<any[]>([]);
// // // // //   const [invites, setInvites] = useState<any[]>([]);
// // // // //   const [loading, setLoading] = useState(false);

// // // // //   // פונקציה לשליפת כל הנתונים
// // // // //   const fetchData = async () => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       console.log(`מנסה לשלוף קבוצות עבור: ${userName}`);
      
// // // // //       // 1. שליפת קבוצות שאתה חבר בהן
// // // // //       // במקום users/${userName}/groups
// // // // // const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
// // // // //       // const resGroups = await fetch(`${BASE_URL}/users/${userName}/groups`);
// // // // //       const groupsData = await resGroups.json();
// // // // //       console.log("קבוצות שהתקבלו מהמסד:", groupsData);
// // // // //       setGroups(Array.isArray(groupsData) ? groupsData : []);

// // // // //       // 2. שליפת הזמנות שמחכות לך
// // // // //       const resInvites = await fetch(`${BASE_URL}/invitations/${userName}`);
// // // // //       const invitesData = await resInvites.json();
// // // // //       console.log("הזמנות שהתקבלו מהמסד:", invitesData);
// // // // //       setInvites(Array.isArray(invitesData) ? invitesData : []);

// // // // //     } catch (error) {
// // // // //       console.error("שגיאה בשליפה:", error);
// // // // //       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. בדוק שהשרת רץ.");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // רענון אוטומטי כשנכנסים למסך
// // // // //   useFocusEffect(
// // // // //     useCallback(() => {
// // // // //       fetchData();
// // // // //     }, [userName])
// // // // //   );

// // // // //   // פונקציית אישור הצטרפות
// // // // //   const handleAccept = async (inviteId: string) => {
// // // // //     try {
// // // // //       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
// // // // //         method: 'POST'
// // // // //       });
// // // // //       if (response.ok) {
// // // // //         Alert.alert("הצלחה", "הצטרפת לקבוצה!");
// // // // //         fetchData(); // רענון הנתונים
// // // // //       }
// // // // //     } catch (e) {
// // // // //       Alert.alert("שגיאה", "פעולת האישור נכשלה.");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <View style={styles.header}>
// // // // //         <Text style={styles.headerTitle}>הקבוצות שלי</Text>
// // // // //         <Text style={{color: '#666'}}>מחובר כ: {userName}</Text>
// // // // //       </View>

// // // // //       <View style={styles.tabBar}>
// // // // //         <TouchableOpacity 
// // // // //           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
// // // // //           onPress={() => setActiveTab('invites')}
// // // // //         >
// // // // //           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
// // // // //             הזמנות ({invites.length})
// // // // //           </Text>
// // // // //         </TouchableOpacity>
        
// // // // //         <TouchableOpacity 
// // // // //           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
// // // // //           onPress={() => setActiveTab('mine')}
// // // // //         >
// // // // //           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
// // // // //             הקבוצות שלי ({groups.length})
// // // // //           </Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       {loading && groups.length === 0 && invites.length === 0 ? (
// // // // //         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
// // // // //       ) : (
// // // // //         <FlatList
// // // // //           data={activeTab === 'mine' ? groups : invites}
// // // // //           keyExtractor={(item, index) => (item.id || item.groupId || index).toString()}
// // // // //           contentContainerStyle={styles.listContent}
// // // // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
// // // // //           renderItem={({ item }) => (
// // // // //             <View style={styles.card}>
// // // // //               <View style={styles.cardInfo}>
// // // // //                 <Text style={styles.cardTitle}>{item.name || item.groupName || "קבוצה ללא שם"}</Text>
// // // // //                 <Text style={styles.cardSubtitle}>
// // // // //                   {activeTab === 'mine' 
// // // // //                     ? `נוצר על ידי: ${item.creator || item.adminUsername || 'אני'}` 
// // // // //                     : `הוזמנת על ידי: ${item.inviterUsername}`}
// // // // //                 </Text>
// // // // //               </View>

// // // // //               {activeTab === 'invites' && (
// // // // //                 <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
// // // // //                   <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
// // // // //                 </TouchableOpacity>
// // // // //               )}
// // // // //             </View>
// // // // //           )}
// // // // //           ListEmptyComponent={
// // // // //             <Text style={styles.emptyText}>
// // // // //               {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
// // // // //             </Text>
// // // // //           }
// // // // //         />
// // // // //       )}
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#F8F9FA' },
// // // // //   header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
// // // // //   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
// // // // //   tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
// // // // //   tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
// // // // //   activeTab: { borderBottomColor: '#6200EE' },
// // // // //   tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
// // // // //   activeTabText: { color: '#6200EE' },
// // // // //   listContent: { padding: 15 },
// // // // //   card: { 
// // // // //     backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
// // // // //     shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
// // // // //   },
// // // // //   cardInfo: { alignItems: 'flex-end' },
// // // // //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
// // // // //   cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
// // // // //   acceptBtn: { 
// // // // //     backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
// // // // //     marginTop: 15, alignItems: 'center' 
// // // // //   },
// // // // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
// // // // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// // // // // });

// // // // // export default MyGroups;



// // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // import { 
// // // //   View, Text, TouchableOpacity, StyleSheet, FlatList, 
// // // //   ActivityIndicator, Alert, RefreshControl 
// // // // } from 'react-native';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import { useFocusEffect } from '@react-navigation/native'; 
// // // // import { BASE_URL } from '../api/Constants';

// // // // const MyGroups = ({ navigation, route }: any) => {
// // // //   const { userName } = route.params || { userName: 'אורח' };

// // // //   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
// // // //   const [groups, setGroups] = useState<any[]>([]);
// // // //   const [invites, setInvites] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(false);

// // // //   const fetchData = async () => {
// // // //     // setLoading(true); // הורדתי את ה-Loading כאן כדי שהבדיקה האוטומטית תהיה שקטה
// // // //     try {
// // // //       // 1. שליפת קבוצות - נתיב מעודכן לפי ה-Java Controller
// // // //       const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
// // // //       const groupsData = await resGroups.json();
// // // //       setGroups(Array.isArray(groupsData) ? groupsData : []);

// // // //       // 2. שליפת הזמנות - נתיב מעודכן לפי ה-Java Controller
// // // //       const resInvites = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // // //       const invitesData = await resInvites.json();
      
// // // //       // בדיקה: אם כמות ההזמנות בשרת גדולה ממה שיש לנו כרגע בזיכרון
// // // //       if (invitesData.length > invites.length && invites.length !== 0) {
// // // //         Alert.alert("הזמנה חדשה!", "מישהו הזמין אותך להצטרף לקבוצה.");
// // // //       }
      
// // // //       setInvites(Array.isArray(invitesData) ? invitesData : []);

// // // //     } catch (error) {
// // // //       console.error("שגיאה בשליפה:", error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // רענון כבד (עם Loading) רק כשנכנסים למסך לראשונה
// // // //   useFocusEffect(
// // // //     useCallback(() => {
// // // //       setLoading(true);
// // // //       fetchData();
// // // //     }, [userName])
// // // //   );

// // // //   // מנגנון בדיקה אוטומטי כל 10 שניות (הודעה קופצת)
// // // //   useEffect(() => {
// // // //     const interval = setInterval(() => {
// // // //       fetchData();
// // // //     }, 10000); 
// // // //     return () => clearInterval(interval);
// // // //   }, [invites.length]);

// // // //   const handleAccept = async (inviteId: string) => {
// // // //     try {
// // // //       // עדכון הנתיב לפי ה-Java (שימוש ב-RequestParam כפי שכתבת בשרת)
// // // //       const response = await fetch(`${BASE_URL}/groups/invitations/accept?invitationId=${inviteId}`, {
// // // //         method: 'POST'
// // // //       });
// // // //       if (response.ok) {
// // // //         Alert.alert("הצלחה", "הצטרפת לקבוצה בהצלחה!");
// // // //         fetchData(); 
// // // //       }
// // // //     } catch (e) {
// // // //       Alert.alert("שגיאה", "פעולת האישור נכשלה.");
// // // //     }
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <View style={styles.header}>
// // // //         <Text style={styles.headerTitle}>הקבוצות שלי</Text>
// // // //         {/* הצגת סטטוס מנהל או אורח מתחת לכותרת */}
// // // //         <Text style={{color: '#666', fontWeight: '600', marginTop: 4}}>
// // // //           {/* {userName === 'אורח' ? 'מחובר כ: אורח' : `סטטוס: מנהל (${userName})`} */}
// // // //         </Text>
// // // //       </View>

// // // //       <View style={styles.tabBar}>
// // // //         <TouchableOpacity 
// // // //           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
// // // //           onPress={() => setActiveTab('invites')}
// // // //         >
// // // //           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
// // // //             הזמנות ({invites.length})
// // // //           </Text>
// // // //         </TouchableOpacity>
        
// // // //         <TouchableOpacity 
// // // //           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
// // // //           onPress={() => setActiveTab('mine')}
// // // //         >
// // // //           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
// // // //             הקבוצות שלי ({groups.length})
// // // //           </Text>
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {loading && groups.length === 0 && invites.length === 0 ? (
// // // //         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
// // // //       ) : (
// // // //         <FlatList
// // // //           data={activeTab === 'mine' ? groups : invites}
// // // //           keyExtractor={(item, index) => (item.id || index).toString()}
// // // //           contentContainerStyle={styles.listContent}
// // // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
// // // //           renderItem={({ item }) => (
// // // //             // בתוך ה-renderItem של MyGroups
// // // // <TouchableOpacity 
// // // //   style={styles.card} 
// // // //   onPress={() => {
// // // //     console.log("Navigating to GroupDetail with User:", userName); // Log באנגלית
// // // //     navigation.navigate('GroupDetailScreen', { 
// // // //       groupId: item.id, 
// // // //       groupName: item.name || item.groupName,
// // // //       userName: userName // <--- זה היה חסר!
// // // //     });
// // // //   }}

// // // //             >
// // // //               <View style={styles.cardInfo}>
// // // //                 {/* שם הקבוצה בגדול כפי שביקשת */}
// // // //                 <Text style={[styles.cardTitle, {fontSize: 22, marginBottom: 2}]}>
// // // //                   {item.name || item.groupName || "קבוצה ללא שם"}
// // // //                 </Text>
                
// // // //                 {/* מציג תת-כותרת רק אם זו הזמנה (מי הזמין אותי) */}
// // // //                 {activeTab === 'invites' && (
// // // //                   <Text style={styles.cardSubtitle}>
// // // //                     הוזמנת על ידי: {item.inviterUsername}
// // // //                   </Text>
// // // //                 )}
// // // //               </View>

// // // //               {activeTab === 'invites' && (
// // // //                 <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
// // // //                   <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
// // // //                 </TouchableOpacity>
// // // //               )}
// // // //             </TouchableOpacity>
// // // //           )}
// // // //           ListEmptyComponent={
// // // //             <Text style={styles.emptyText}>
// // // //               {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
// // // //             </Text>
// // // //           }
// // // //         />
// // // //       )}
// // // //     </SafeAreaView>
// // // //   );
// // // // };
// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#F8F9FA' },
// // // //   header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
// // // //   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
// // // //   tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
// // // //   tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
// // // //   activeTab: { borderBottomColor: '#6200EE' },
// // // //   tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
// // // //   activeTabText: { color: '#6200EE' },
// // // //   listContent: { padding: 15 },
// // // //   card: { 
// // // //     backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
// // // //     shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
// // // //   },
// // // //   cardInfo: { alignItems: 'flex-end' },
// // // //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
// // // //   cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
// // // //   acceptBtn: { 
// // // //     backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
// // // //     marginTop: 15, alignItems: 'center' 
// // // //   },
// // // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
// // // //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// // // // });

// // // // export default MyGroups;
// // // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // // import { 
// // //   View, Text, TouchableOpacity, StyleSheet, FlatList, 
// // //   ActivityIndicator, Alert, RefreshControl, Image
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { useFocusEffect } from '@react-navigation/native'; 
// // // import { BASE_URL } from '../api/Constants';

// // // const MyGroups = ({ navigation, route }: any) => {
// // //   const { userName } = route.params || { userName: 'אורח' };

// // //   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
// // //   const [groups, setGroups] = useState<any[]>([]);
// // //   const [invites, setInvites] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(false);

// // //   const fetchData = async () => {
// // //     try {
// // //       // 1. שליפת קבוצות
// // //       const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
// // //       const groupsData = await resGroups.json();
      
// // //       // מיון: קבוצות עם הודעות חדשות (unreadCount > 0) קופצות למעלה
// // //       const sortedGroups = Array.isArray(groupsData) ? groupsData.sort((a, b) => {
// // //         const countA = a.unreadCount || 0;
// // //         const countB = b.unreadCount || 0;
// // //         return countB - countA; // הגבוה ביותר למעלה
// // //       }) : [];
      
// // //       setGroups(sortedGroups);

// // //       // 2. שליפת הזמנות
// // //       const resInvites = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// // //       const invitesData = await resInvites.json();
      
// // //       if (invitesData.length > invites.length && invites.length !== 0) {
// // //         Alert.alert("הזמנה חדשה!", "מישהו הזמין אותך להצטרף לקבוצה.");
// // //       }
// // //       setInvites(Array.isArray(invitesData) ? invitesData : []);

// // //     } catch (error) {
// // //       console.error("שגיאה בשליפה:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       setLoading(true);
// // //       fetchData();
// // //     }, [userName])
// // //   );

// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       fetchData();
// // //     }, 10000); 
// // //     return () => clearInterval(interval);
// // //   }, [invites.length]);

// // //   const handleAccept = async (inviteId: string) => {
// // //     try {
// // //       const response = await fetch(`${BASE_URL}/groups/invitations/accept?invitationId=${inviteId}`, {
// // //         method: 'POST'
// // //       });
// // //       if (response.ok) {
// // //         Alert.alert("הצלחה", "הצטרפת לקבוצה בהצלחה!");
// // //         fetchData(); 
// // //       }
// // //     } catch (e) {
// // //       Alert.alert("שגיאה", "פעולת האישור נכשלה.");
// // //     }
// // //   };

// // //   // פונקציה ליצירת צבע רקע לאווטאר לפי שם הקבוצה
// // //   const getAvatarColor = (name: string) => {
// // //     const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
// // //     const index = name.length % colors.length;
// // //     return colors[index];
// // //   };

// // //   const renderGroupItem = ({ item }: any) => {
// // //     const gName = item.name || item.groupName || "קבוצה";
// // //     const unreadCount = item.unreadCount || 0;

// // //     return (
// // //       <TouchableOpacity 
// // //         style={styles.card} 
// // //         onPress={() => {
// // //           navigation.navigate('GroupDetailScreen', { 
// // //             groupId: item.id, 
// // //             groupName: gName,
// // //             userName: userName 
// // //           });
// // //         }}
// // //       >
// // //         <View style={styles.cardContent}>
// // //           {/* תמונת פרופיל / אווטאר */}
// // //           <View style={[styles.avatar, { backgroundColor: getAvatarColor(gName) }]}>
// // //             <Text style={styles.avatarText}>{gName.charAt(0).toUpperCase()}</Text>
// // //           </View>

// // //           {/* פרטי הקבוצה */}
// // //           <View style={styles.infoContainer}>
// // //             <View style={styles.row}>
// // //               <Text style={styles.cardTitle} numberOfLines={1}>{gName}</Text>
// // //               {/* Badge הודעות חדשות */}
// // //               {unreadCount > 0 && (
// // //                 <View style={styles.unreadBadge}>
// // //                   <Text style={styles.unreadText}>+{unreadCount}</Text>
// // //                 </View>
// // //               )}
// // //             </View>
// // //             <Text style={styles.cardSubtitle} numberOfLines={1}>
// // //               {activeTab === 'mine' 
// // //                 ? `מנהל: ${item.creator || item.adminUsername || 'אני'}` 
// // //                 : `הוזמנת ע"י: ${item.inviterUsername}`}
// // //             </Text>
// // //           </View>

// // //           {/* חץ קטן בצד */}
// // //           <View style={styles.chevronContainer}>
// // //              <Text style={styles.chevron}>❮</Text>
// // //           </View>
// // //         </View>

// // //         {activeTab === 'invites' && (
// // //           <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
// // //             <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
// // //           </TouchableOpacity>
// // //         )}
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <View style={styles.header}>
// // //         <Text style={styles.headerTitle}>השיחות שלי</Text>
// // //         <View style={styles.userBadge}>
// // //             <Text style={styles.userBadgeText}>{userName}</Text>
// // //         </View>
// // //       </View>

// // //       <View style={styles.tabBar}>
// // //         <TouchableOpacity 
// // //           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
// // //           onPress={() => setActiveTab('mine')}
// // //         >
// // //           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
// // //             צ'אטים ({groups.length})
// // //           </Text>
// // //         </TouchableOpacity>

// // //         <TouchableOpacity 
// // //           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
// // //           onPress={() => setActiveTab('invites')}
// // //         >
// // //           {invites.length > 0 && <View style={styles.dot} />}
// // //           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
// // //             הזמנות ({invites.length})
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {loading && groups.length === 0 && invites.length === 0 ? (
// // //         <View style={styles.center}>
// // //             <ActivityIndicator size="large" color="#6200EE" />
// // //             <Text style={styles.loadingText}>טוען קבוצות...</Text>
// // //         </View>
// // //       ) : (
// // //         <FlatList
// // //           data={activeTab === 'mine' ? groups : invites}
// // //           keyExtractor={(item, index) => (item.id || index).toString()}
// // //           contentContainerStyle={styles.listContent}
// // //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
// // //           renderItem={renderGroupItem}
// // //           ListEmptyComponent={
// // //             <View style={styles.emptyContainer}>
// // //                 <Text style={styles.emptyEmoji}>{activeTab === 'mine' ? "💬" : "📩"}</Text>
// // //                 <Text style={styles.emptyText}>
// // //                 {activeTab === 'mine' ? "אין עדיין שיחות פעילות" : "אין הזמנות שממתינות לך"}
// // //                 </Text>
// // //             </View>
// // //           }
// // //         />
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#FFFFFF' },
// // //   header: { 
// // //     flexDirection: 'row-reverse', 
// // //     justifyContent: 'space-between', 
// // //     alignItems: 'center', 
// // //     paddingHorizontal: 20, 
// // //     paddingVertical: 15,
// // //     backgroundColor: '#FFF'
// // //   },
// // //   headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
// // //   userBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
// // //   userBadgeText: { color: '#666', fontWeight: 'bold', fontSize: 12 },
  
// // //   tabBar: { flexDirection: 'row-reverse', backgroundColor: '#FFF', paddingHorizontal: 10 },
// // //   tab: { 
// // //     flex: 1, 
// // //     paddingVertical: 12, 
// // //     alignItems: 'center', 
// // //     marginHorizontal: 5,
// // //     borderRadius: 10,
// // //     backgroundColor: '#F5F5F5',
// // //     marginBottom: 10
// // //   },
// // //   activeTab: { backgroundColor: '#6200EE' },
// // //   tabText: { fontSize: 14, color: '#666', fontWeight: 'bold' },
// // //   activeTabText: { color: '#FFF' },
// // //   dot: { width: 8, height: 8, backgroundColor: '#FF3B30', borderRadius: 4, position: 'absolute', top: 8, right: 15, zIndex: 1 },

// // //   listContent: { padding: 16 },
// // //   card: { 
// // //     backgroundColor: '#FFF', 
// // //     borderRadius: 16, 
// // //     marginBottom: 12,
// // //     padding: 12,
// // //     flexDirection: 'column',
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 2,
// // //     borderWidth: 1,
// // //     borderColor: '#F0F0F0'
// // //   },
// // //   cardContent: { flexDirection: 'row-reverse', alignItems: 'center' },
// // //   avatar: { 
// // //     width: 55, 
// // //     height: 55, 
// // //     borderRadius: 20, 
// // //     justifyContent: 'center', 
// // //     alignItems: 'center',
// // //     marginLeft: 15
// // //   },
// // //   avatarText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
// // //   infoContainer: { flex: 1, alignItems: 'flex-end' },
// // //   row: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-start', width: '100%' },
// // //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'right' },
// // //   cardSubtitle: { fontSize: 13, color: '#888', marginTop: 3, textAlign: 'right' },
  
// // //   unreadBadge: { 
// // //     backgroundColor: '#6200EE', 
// // //     paddingHorizontal: 8, 
// // //     paddingVertical: 2, 
// // //     borderRadius: 12, 
// // //     marginRight: 10 
// // //   },
// // //   unreadText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  
// // //   chevronContainer: { paddingLeft: 10 },
// // //   chevron: { color: '#CCC', fontSize: 18 },

// // //   acceptBtn: { 
// // //     backgroundColor: '#34C759', 
// // //     padding: 10, 
// // //     borderRadius: 10, 
// // //     marginTop: 10, 
// // //     alignItems: 'center' 
// // //   },
// // //   acceptBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  
// // //   center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
// // //   loadingText: { marginTop: 10, color: '#666' },
  
// // //   emptyContainer: { alignItems: 'center', marginTop: 80 },
// // //   emptyEmoji: { fontSize: 50, marginBottom: 10 },
// // //   emptyText: { color: '#999', fontSize: 16, fontWeight: '500' }
// // // });

// // // export default MyGroups;
// // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // import { 
// //   View, Text, TouchableOpacity, StyleSheet, FlatList, 
// //   ActivityIndicator, Alert, RefreshControl, TextInput 
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useFocusEffect } from '@react-navigation/native'; 
// // import { BASE_URL } from '../api/Constants';

// // const MyGroups = ({ navigation, route }: any) => {
// //   const { userName } = route.params || { userName: 'אורח' };

// //   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
// //   const [groups, setGroups] = useState<any[]>([]);
// //   const [invites, setInvites] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');

// //   const fetchData = async () => {
// //     try {
// //       const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
// //       const groupsData = await resGroups.json();
// //       setGroups(Array.isArray(groupsData) ? groupsData : []);

// //       const resInvites = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
// //       const invitesData = await resInvites.json();
// //       setInvites(Array.isArray(invitesData) ? invitesData : []);
// //     } catch (error) {
// //       console.error("Fetch error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useFocusEffect(
// //     useCallback(() => {
// //       setLoading(true);
// //       fetchData();
// //     }, [userName])
// //   );

// //   // לוגיקת מיון וחיפוש: קבוצות עם הודעות חדשות קופצות לראש הרשימה + סינון לפי חיפוש
// //   const filteredAndSortedGroups = useMemo(() => {
// //     const data = activeTab === 'mine' ? groups : invites;
    
// //     return data
// //       .filter(item => {
// //         const name = (item.name || item.groupName || "").toLowerCase();
// //         return name.includes(searchQuery.toLowerCase());
// //       })
// //       .sort((a, b) => {
// //         const unreadA = a.unreadCount || 0;
// //         const unreadB = b.unreadCount || 0;
// //         return unreadB - unreadA; // מי שיש לו יותר הודעות - למעלה
// //       });
// //   }, [groups, invites, activeTab, searchQuery]);

// //   const getAvatarColor = (name: string) => {
// //     const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];
// //     return colors[name.length % colors.length];
// //   };

// //   const handleAccept = async (inviteId: string) => {
// //     try {
// //       const res = await fetch(`${BASE_URL}/groups/invitations/accept?invitationId=${inviteId}`, { method: 'POST' });
// //       if (res.ok) { Alert.alert("בוצע!", "הצטרפת לקבוצה"); fetchData(); }
// //     } catch (e) { Alert.alert("שגיאה", "נכשל"); }
// //   };

// //   const renderItem = ({ item }: any) => {
// //     const name = item.name || item.groupName || "קבוצה";
// //     const unread = item.unreadCount || 0;

// //     return (
// //       <TouchableOpacity 
// //         style={styles.card} 
// //         onPress={() => navigation.navigate('GroupDetailScreen', { groupId: item.id, groupName: name, userName })}
// //       >
// //         <View style={styles.cardRow}>
// //           {/* אווטאר */}
// //           <View style={[styles.avatar, { backgroundColor: getAvatarColor(name) }]}>
// //             <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
// //           </View>

// //           {/* תוכן המרכז */}
// //           <View style={styles.mainInfo}>
// //             <Text style={styles.groupNameText} numberOfLines={1}>{name}</Text>
// //             <Text style={styles.subtitleText}>
// //               {activeTab === 'mine' ? `מנהל: ${item.creator || 'אני'}` : `מאת: ${item.inviterUsername}`}
// //             </Text>
// //           </View>

// //           {/* Badge הודעות חדשות - צד שמאל */}
// //           <View style={styles.leftSide}>
// //             {unread > 0 && (
// //               <View style={styles.badge}>
// //                 <Text style={styles.badgeText}>+{unread}</Text>
// //               </View>
// //             )}
// //             <Text style={styles.chevron}>❮</Text>
// //           </View>
// //         </View>

// //         {activeTab === 'invites' && (
// //           <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
// //             <Text style={styles.acceptBtnText}>אשר הצטרפות ✅</Text>
// //           </TouchableOpacity>
// //         )}
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* כותרת עליונה */}
// //       <View style={styles.header}>
// //         <Text style={styles.title}>הקבוצות שלי</Text>
// //         <View style={styles.searchContainer}>
// //           <TextInput 
// //             style={styles.searchInput}
// //             placeholder="חפש קבוצה..."
// //             placeholderTextColor="#94A3B8"
// //             value={searchQuery}
// //             onChangeText={setSearchQuery}
// //           />
// //           <Text style={styles.searchIcon}>🔍</Text>
// //         </View>
// //       </View>

// //       {/* טאבים */}
// //       <View style={styles.tabsContainer}>
// //         <TouchableOpacity 
// //           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
// //           onPress={() => setActiveTab('mine')}
// //         >
// //           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>הקבוצות שלי</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity 
// //           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
// //           onPress={() => setActiveTab('invites')}
// //         >
// //           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>הזמנות</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {loading && filteredAndSortedGroups.length === 0 ? (
// //         <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
// //       ) : (
// //         <FlatList
// //           data={filteredAndSortedGroups}
// //           keyExtractor={(item, index) => (item.id || index).toString()}
// //           contentContainerStyle={styles.list}
// //           renderItem={renderItem}
// //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
// //           ListEmptyComponent={<Text style={styles.emptyText}>לא נמצאו תוצאות 🔍</Text>}
// //         />
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F8FAFC' },
// //   header: { padding: 20, backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
// //   title: { fontSize: 26, fontWeight: '900', color: '#1E293B', textAlign: 'right', marginBottom: 15 },
  
// //   // שורת חיפוש
// //   searchContainer: { 
// //     flexDirection: 'row-reverse', 
// //     alignItems: 'center', 
// //     backgroundColor: '#F1F5F9', 
// //     borderRadius: 15, 
// //     paddingHorizontal: 15,
// //     height: 45
// //   },
// //   searchInput: { flex: 1, textAlign: 'right', color: '#1E293B', fontWeight: '600' },
// //   searchIcon: { marginLeft: 10, fontSize: 16 },

// //   // טאבים
// //   tabsContainer: { flexDirection: 'row-reverse', padding: 15 },
// //   tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, marginHorizontal: 5, backgroundColor: '#E2E8F0' },
// //   activeTab: { backgroundColor: '#6366F1' },
// //   tabText: { fontWeight: 'bold', color: '#64748B' },
// //   activeTabText: { color: '#FFF' },

// //   // כרטיס קבוצה
// //   list: { paddingHorizontal: 15 },
// //   card: { 
// //     backgroundColor: '#FFF', 
// //     borderRadius: 20, 
// //     padding: 15, 
// //     marginBottom: 12, 
// //     elevation: 2,
// //     borderWidth: 1,
// //     borderColor: '#F1F5F9'
// //   },
// //   cardRow: { flexDirection: 'row-reverse', alignItems: 'center' },
// //   avatar: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
// //   avatarText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
// //   mainInfo: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
// //   groupNameText: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
// //   subtitleText: { fontSize: 13, color: '#64748B', marginTop: 3 },

// //   // צד שמאל (Badge ו-Chevron)
// //   leftSide: { alignItems: 'center', justifyContent: 'center' },
// //   badge: { 
// //     backgroundColor: '#EF4444', 
// //     minWidth: 26, 
// //     height: 26, 
// //     borderRadius: 13, 
// //     justifyContent: 'center', 
// //     alignItems: 'center',
// //     marginBottom: 5,
// //     borderWidth: 2,
// //     borderColor: '#FFF'
// //   },
// //   badgeText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
// //   chevron: { color: '#CBD5E1', fontSize: 14 },

// //   acceptBtn: { backgroundColor: '#10B981', padding: 10, borderRadius: 12, marginTop: 12, alignItems: 'center' },
// //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
// //   emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8', fontSize: 16 }
// // });

// // export default MyGroups;
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, TouchableOpacity, StyleSheet, FlatList, 
//   ActivityIndicator, Alert, RefreshControl 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native'; 
// import { BASE_URL } from '../api/Constants';

// const MyGroups = ({ navigation, route }: any) => {
//   const { userName } = route.params || { userName: 'אורח' };

//   // טאבים: 'mine' (כל הקבוצות שלי), 'manage' (קבוצות שאני מנהל)
//   const [activeTab, setActiveTab] = useState<'mine' | 'manage'>('mine');
//   const [allGroups, setAllGroups] = useState<any[]>([]);
//   const [managedGroups, setManagedGroups] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     try {
//       const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
//       const groupsData = await resGroups.json();
      
//       if (Array.isArray(groupsData)) {
//         setAllGroups(groupsData);
//         // סינון קבוצות שבהן המשתמש הוא אדמין
//         const adminGroups = groupsData.filter((g: any) => 
//             g.members?.some((m: any) => m.username === userName && m.isAdmin === true) || 
//             g.creator === userName // גיבוי אם הלוגיקה בשרת שונה
//         );
//         setManagedGroups(adminGroups);
//       }
//     } catch (error) {
//       console.error("שגיאה בשליפה:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       setLoading(true);
//       fetchData();
//     }, [userName])
//   );

//   const handleDeleteGroup = (groupId: string, groupName: string) => {
//     Alert.alert("מחיקת קבוצה", `למחוק את ${groupName}?`, [
//       { text: "ביטול", style: "cancel" },
//       { text: "מחק", style: "destructive", onPress: async () => {
//           try {
//             await fetch(`${BASE_URL}/groups/delete/${groupId}`, { method: 'DELETE' });
//             fetchData();
//           } catch (e) { Alert.alert("שגיאה", "המחיקה נכשלה"); }
//       }}
//     ]);
//   };

//   const renderItem = ({ item }: any) => {
//     const isManageMode = activeTab === 'manage';

//     return (
//       <View style={styles.card}>
//         <TouchableOpacity 
//           style={styles.cardMain}
//           onPress={() => !isManageMode && navigation.navigate('GroupDetailScreen', { 
//             groupId: item.id, groupName: item.name || item.groupName, userName: userName 
//           })}
//         >
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>{(item.name || item.groupName || "ק").charAt(0)}</Text>
//           </View>
//           <View style={styles.info}>
//             <Text style={styles.cardTitle}>{item.name || item.groupName}</Text>
//             <Text style={styles.cardSubtitle}>
//                {item.members?.length || 0} חברים בקבוצה
//             </Text>
//           </View>
//         </TouchableOpacity>

//         {isManageMode && (
//           <View style={styles.adminActions}>
//             <TouchableOpacity 
//                 style={[styles.btn, styles.editBtn]}
//                 onPress={() => navigation.navigate('CreateGroup', {
//                     isEditMode: true,
//                     groupId: item.id,
//                     groupName: item.name || item.groupName,
//                     existingMembers: item.members,
//                     userName: userName
//                 })}
//             >
//               <Text style={styles.btnText}>עריכת חברים 👥</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//                 style={[styles.btn, styles.deleteBtn]}
//                 onPress={() => handleDeleteGroup(item.id, item.name || item.groupName)}
//             >
//               <Text style={styles.btnTextDelete}>מחיקה 🗑️</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>הקבוצות שלי</Text>
//       </View>

//       <View style={styles.tabBar}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'manage' && styles.activeTab]} 
//           onPress={() => setActiveTab('manage')}
//         >
//           <Text style={[styles.tabText, activeTab === 'manage' && styles.activeTabText]}>
//              ניהול קבוצות ({managedGroups.length})
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
//           onPress={() => setActiveTab('mine')}
//         >
//           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
//             כל הקבוצות ({allGroups.length})
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 50 }} />
//       ) : (
//         <FlatList
//           data={activeTab === 'mine' ? allGroups : managedGroups}
//           keyExtractor={(item) => (item.id || Math.random()).toString()}
//           contentContainerStyle={styles.listContent}
//           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
//           renderItem={renderItem}
//           ListEmptyComponent={<Text style={styles.emptyText}>אין קבוצות להצגה</Text>}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FAF9FF' },
//   header: { padding: 20, alignItems: 'center', backgroundColor: '#FFF' },
//   headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
//   tabBar: { flexDirection: 'row', backgroundColor: '#FFF', paddingBottom: 10 },
//   tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#F1F5F9' },
//   activeTab: { borderBottomColor: '#6366F1' },
//   tabText: { fontSize: 14, color: '#64748B', fontWeight: '700' },
//   activeTabText: { color: '#6366F1' },
//   listContent: { padding: 15 },
//   card: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 2 },
//   cardMain: { flexDirection: 'row-reverse', alignItems: 'center' },
//   avatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
//   info: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
//   cardSubtitle: { fontSize: 13, color: '#64748B' },
//   adminActions: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
//   btn: { flex: 0.48, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
//   editBtn: { backgroundColor: '#EEF2FF' },
//   deleteBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FECACA' },
//   btnText: { color: '#6366F1', fontWeight: '700', fontSize: 12 },
//   btnTextDelete: { color: '#EF4444', fontWeight: '700', fontSize: 12 },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8' }
// });

// export default MyGroups;
// import React, { useState, useCallback, useMemo } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, 
//   ActivityIndicator, RefreshControl, Alert 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
// import { BASE_URL } from '../api/Constants';

// const MyGroups = ({ navigation, route }: any) => {
//   const { userName } = route.params || { userName: 'אורח' };

//   // טאבים: 'mine' (קבוצות שאני חבר בהן), 'admin' (קבוצות שאני מנהל)
//   const [activeTab, setActiveTab] = useState<'mine' | 'admin'>('mine');
//   const [groups, setGroups] = useState<any[]>([]);
//   const [adminGroups, setAdminGroups] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchData = async () => {
//     try {
//       // משיכת כל הקבוצות שלי
//       const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
//       const groupsData = await resGroups.json();
//       const allGroups = Array.isArray(groupsData) ? groupsData : [];

//       // הפרדה בין קבוצות שאני חבר בהן לקבוצות שאני יצרתי (ניהול)
//       // בהנחה שהשרת מחזיר שדה 'creator' או 'admin'
//       setGroups(allGroups.filter(g => g.creator !== userName));
//       setAdminGroups(allGroups.filter(g => g.creator === userName));

//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       setLoading(true);
//       fetchData();
//     }, [userName])
//   );

//   const filteredData = useMemo(() => {
//     const data = activeTab === 'mine' ? groups : adminGroups;
//     return data
//       .filter(item => {
//         const name = (item.name || item.groupName || "").toLowerCase();
//         return name.includes(searchQuery.toLowerCase());
//       })
//       .sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
//   }, [groups, adminGroups, activeTab, searchQuery]);

//   const getAvatarColor = (name: string) => {
//     const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];
//     return colors[name.length % colors.length];
//   };

//  const handleEditGroup = (group: any) => {
//   navigation.navigate('CreateGroup', { 
//     isEditing: true,
//     groupId: group.id,
//     initialName: group.name || group.groupName,
//     initialMembers: group.members || [], 
//     initialCreator: group.creator, // חשוב לשמור על היוצר המקורי
//     userName: userName
//   });
// };
  

//   const renderItem = ({ item }: any) => {
//     const name = item.name || item.groupName || "קבוצה";
//     const unread = item.unreadCount || 0;

//     return (
//       <View style={styles.card}>
//         <TouchableOpacity 
//           style={styles.cardRow} 
//           onPress={() => navigation.navigate('GroupDetailScreen', { groupId: item.id, groupName: name, userName })}
//         >
//           {/* אווטאר */}
//           <View style={[styles.avatar, { backgroundColor: getAvatarColor(name) }]}>
//             <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
//           </View>

//           {/* תוכן המרכז */}
//           <View style={styles.mainInfo}>
//             <Text style={styles.groupNameText} numberOfLines={1}>{name}</Text>
//             <Text style={styles.subtitleText}>
//               {activeTab === 'mine' ? `מנהל: ${item.creator}` : `ניהול שלך 👑`}
              
//             </Text>
//           </View>

//           {/* צד שמאל - התראות */}
//           <View style={styles.leftSide}>
//             {unread > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>+{unread}</Text>
//               </View>
//             )}
//             <Text style={styles.chevron}>❮</Text>
//           </View>
//         </TouchableOpacity>

//         {/* כפתור עריכה - מופיע רק בטאב ניהול */}
//         {activeTab === 'admin' && (
//           <TouchableOpacity 
//             style={styles.editBtn} 
//             onPress={() => handleEditGroup(item)}
//           >
//             <Text style={styles.editBtnText}>עריכת קבוצה וחברים ⚙️</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* כותרת וחיפוש */}
//       <View style={styles.header}>
//         <Text style={styles.title}>הקהילות שלי</Text>
//         <View style={styles.searchContainer}>
//           <TextInput 
//             style={styles.searchInput}
//             placeholder="חפש קבוצה..."
//             placeholderTextColor="#94A3B8"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           <Text style={styles.searchIcon}>🔍</Text>
//         </View>
//       </View>

//       {/* טאבים צבעוניים */}
//       <View style={styles.tabsContainer}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
//           onPress={() => setActiveTab('mine')}
//         >
//           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>קבוצות שאני בהן</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'admin' && styles.activeAdminTab]} 
//           onPress={() => setActiveTab('admin')}
//         >
//           <Text style={[styles.tabText, activeTab === 'admin' && styles.activeTabText]}>קבוצות בניהולי</Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
//       ) : (
//         <FlatList
//           data={filteredData}
//           keyExtractor={(item, index) => (item.id || index).toString()}
//           contentContainerStyle={styles.list}
//           renderItem={renderItem}
//           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
//           ListEmptyComponent={<Text style={styles.emptyText}>אין קבוצות להצגה 🔍</Text>}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   header: { padding: 20, backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 },
//   title: { fontSize: 28, fontWeight: '900', color: '#1E293B', textAlign: 'right', marginBottom: 15 },
  
//   searchContainer: { 
//     flexDirection: 'row-reverse', 
//     alignItems: 'center', 
//     backgroundColor: '#F1F5F9', 
//     borderRadius: 15, 
//     paddingHorizontal: 15,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#E2E8F0'
//   },
//   searchInput: { flex: 1, textAlign: 'right', color: '#1E293B', fontWeight: '700', fontSize: 16 },
//   searchIcon: { marginLeft: 10, fontSize: 18 },

//   tabsContainer: { flexDirection: 'row-reverse', padding: 15 },
//   tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15, marginHorizontal: 5, backgroundColor: '#FFF', elevation: 2 },
//   activeTab: { backgroundColor: '#6366F1' },
//   activeAdminTab: { backgroundColor: '#F59E0B' }, // צבע כתום לניהול
//   tabText: { fontWeight: '800', color: '#64748B', fontSize: 14 },
//   activeTabText: { color: '#FFF' },

//   list: { paddingHorizontal: 15, paddingBottom: 20 },
//   card: { 
//     backgroundColor: '#FFF', 
//     borderRadius: 22, 
//     padding: 15, 
//     marginBottom: 15, 
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#F1F5F9'
//   },
//   cardRow: { flexDirection: 'row-reverse', alignItems: 'center' },
//   avatar: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
//   avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
//   mainInfo: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
//   groupNameText: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
//   subtitleText: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '600' },

//   leftSide: { alignItems: 'center', justifyContent: 'center' },
//   badge: { 
//     backgroundColor: '#EF4444', 
//     minWidth: 28, 
//     height: 28, 
//     borderRadius: 14, 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     marginBottom: 5,
//     borderWidth: 2,
//     borderColor: '#FFF'
//   },
//   badgeText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
//   chevron: { color: '#CBD5E1', fontSize: 16 },

//   editBtn: { 
//     backgroundColor: '#8B5CF6', 
//     padding: 12, 
//     borderRadius: 12, 
//     marginTop: 15, 
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center'
//   },
//   editBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8', fontSize: 16, fontWeight: '600' }
// });

// export default MyGroups;

import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, 
  ActivityIndicator, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../api/Constants';

const MyGroups = ({ navigation, route }: any) => {
  const { userName } = route.params || { userName: 'אורח' };

  const [activeTab, setActiveTab] = useState<'mine' | 'admin'>('mine');
  const [groups, setGroups] = useState<any[]>([]);
  const [adminGroups, setAdminGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
      const groupsData = await resGroups.json();
      const allGroups = Array.isArray(groupsData) ? groupsData : [];

      // טאב "קבוצות שאני בהן" - מציג את כולם
      setGroups(allGroups); 
      
      // טאב "ניהול" - רק מה שיצרתי
      setAdminGroups(allGroups.filter(g => g.creator === userName));

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [userName])
  );

  const filteredData = useMemo(() => {
    const data = activeTab === 'mine' ? groups : adminGroups;
    return data
      .filter(item => {
        const name = (item.name || item.groupName || "").toLowerCase();
        return name.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
  }, [groups, adminGroups, activeTab, searchQuery]);

  const getAvatarColor = (name: string) => {
    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];
    return colors[name.length % colors.length] || colors[0];
  };

  const handleEditGroup = (group: any) => {
    navigation.navigate('CreateGroup', { 
      isEditing: true,
      groupId: group.id,
      initialName: group.name || group.groupName,
      initialMembers: group.members || [], 
      initialCreator: group.creator,
      userName: userName
    });
  };

  const renderItem = ({ item }: any) => {
    const name = item.name || item.groupName || "קבוצה";
    const unread = item.unreadCount || 0;
    const isOwner = item.creator === userName;

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardRow} 
          onPress={() => navigation.navigate('GroupDetailScreen', { groupId: item.id, groupName: name, userName })}
        >
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(name) }]}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.mainInfo}>
            <Text style={styles.groupNameText} numberOfLines={1}>{name}</Text>
            <Text style={styles.subtitleText}>
              {isOwner ? `ניהול שלך 👑` : `מנהל: ${item.creator}`}
            </Text>
          </View>

          <View style={styles.leftSide}>
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+{unread}</Text>
              </View>
            )}
            <Text style={styles.chevron}>❮</Text>
          </View>
        </TouchableOpacity>

        {activeTab === 'admin' && (
          <TouchableOpacity 
            style={styles.editBtn} 
            onPress={() => handleEditGroup(item)}
          >
            <Text style={styles.editBtnText}>עריכת קבוצה וחברים ⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>הקהילות שלי</Text>
        <View style={{ marginBottom: 10 }}>
           <Text style={{ textAlign: 'right', color: '#6366F1', fontWeight: 'bold' }}>שלום, {userName}</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="חפש קבוצה..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>קבוצות שאני בהן</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'admin' && styles.activeAdminTab]} 
          onPress={() => setActiveTab('admin')}
        >
          <Text style={[styles.tabText, activeTab === 'admin' && styles.activeTabText]}>קבוצות בניהולי</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => (item.id || index).toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
          ListEmptyComponent={<Text style={styles.emptyText}>אין קבוצות להצגה 🔍</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#1E293B', textAlign: 'right', marginBottom: 15 },
  searchContainer: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 15, 
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchInput: { flex: 1, textAlign: 'right', color: '#1E293B', fontWeight: '700', fontSize: 16 },
  searchIcon: { marginLeft: 10, fontSize: 18 },
  tabsContainer: { flexDirection: 'row-reverse', padding: 15 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 15, marginHorizontal: 5, backgroundColor: '#FFF', elevation: 2 },
  activeTab: { backgroundColor: '#6366F1' },
  activeAdminTab: { backgroundColor: '#F59E0B' },
  tabText: { fontWeight: '800', color: '#64748B', fontSize: 14 },
  activeTabText: { color: '#FFF' },
  list: { paddingHorizontal: 15, paddingBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 22, padding: 15, marginBottom: 15, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  mainInfo: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
  groupNameText: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
  subtitleText: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '600' },
  leftSide: { alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: '#EF4444', minWidth: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 5, borderWidth: 2, borderColor: '#FFF' },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  chevron: { color: '#CBD5E1', fontSize: 16 },
  editBtn: { backgroundColor: '#8B5CF6', padding: 12, borderRadius: 12, marginTop: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  editBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8', fontSize: 16, fontWeight: '600' }
});

export default MyGroups;