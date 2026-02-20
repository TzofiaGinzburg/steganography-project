// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, Text, TouchableOpacity, StyleSheet, FlatList, 
// //   ActivityIndicator, Alert, RefreshControl 
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { BASE_URL } from '../api/Constants';
// // const MyGroupsScreen = ({ navigation, route }: any) => {
// //   // קבלת שם המשתמש מה-Params
// //   const { userName } = route.params || { userName: 'אורח' };
// //   const MY_IP = '192.168.1.112'; // <--- וודא שזה ה-IP של המחשב שלך

// //   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
// //   const [groups, setGroups] = useState<any[]>([]);
// //   const [invites, setInvites] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   // פונקציה לשליפת כל הנתונים
// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       // 1. שליפת קבוצות שאתה חבר בהן
// //       const resGroups = await fetch(`${BASE_URL}/users/${userName}/groups`);
// //       const groupsData = await resGroups.json();
// //       setGroups(Array.isArray(groupsData) ? groupsData : []);

// //       // 2. שליפת הזמנות שמחכות לך
// //       const resInvites = await fetch(`${BASE_URL}/invitations/${userName}`);
// //       const invitesData = await resInvites.json();
// //       setInvites(Array.isArray(invitesData) ? invitesData : []);

// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. בדוק שה-IP נכון ושהשרת רץ.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, [userName]);

// //   // פונקציית אישור הצטרפות
// //   const handleAccept = async (inviteId: string) => {
// //     try {
// //       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
// //         method: 'POST'
// //       });
// //       if (response.ok) {
// //         Alert.alert("הצלחה", "הצטרפת לקבוצה!");
// //         fetchData(); // רענון הנתונים
// //       }
// //     } catch (e) {
// //       Alert.alert("שגיאה", "פעולת האישור נכשלה.");
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* כותרת */}
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>הקבוצות שלי</Text>
// //       </View>

// //       {/* תפריט טאבים (Tabs) */}
// //       <View style={styles.tabBar}>
// //         <TouchableOpacity 
// //           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
// //           onPress={() => setActiveTab('invites')}
// //         >
// //           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
// //             הזמנות ({invites.length})
// //           </Text>
// //         </TouchableOpacity>
        
// //         <TouchableOpacity 
// //           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
// //           onPress={() => setActiveTab('mine')}
// //         >
// //           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
// //             הקבוצות שלי ({groups.length})
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
// //       ) : (
// //         <FlatList
// //           data={activeTab === 'mine' ? groups : invites}
// //           keyExtractor={(item) => item.id || Math.random().toString()}
// //           contentContainerStyle={styles.listContent}
// //           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
// //           renderItem={({ item }) => (
// //             <View style={styles.card}>
// //               <View style={styles.cardInfo}>
// //                 <Text style={styles.cardTitle}>{item.name || item.groupName}</Text>
// //                 <Text style={styles.cardSubtitle}>
// //                   {activeTab === 'mine' ? `נוצר על ידי: ${item.creator}` : `הוזמנת על ידי: ${item.inviterUsername}`}
// //                 </Text>
// //               </View>

// //               {activeTab === 'invites' && (
// //                 <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
// //                   <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           )}
// //           ListEmptyComponent={
// //             <Text style={styles.emptyText}>
// //               {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
// //             </Text>
// //           }
// //         />
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F8F9FA' },
// //   header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
// //   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
// //   tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
// //   tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
// //   activeTab: { borderBottomColor: '#6200EE' },
// //   tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
// //   activeTabText: { color: '#6200EE' },
// //   listContent: { padding: 15 },
// //   card: { 
// //     backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
// //     shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
// //   },
// //   cardInfo: { alignItems: 'flex-end' },
// //   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
// //   cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
// //   acceptBtn: { 
// //     backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
// //     marginTop: 15, alignItems: 'center' 
// //   },
// //   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
// //   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// // });

// // export default MyGroupsScreen;
// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, TouchableOpacity, StyleSheet, FlatList, 
//   ActivityIndicator, Alert, RefreshControl 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native'; 
// import { BASE_URL } from '../api/Constants';

// const MyGroups= ({ navigation, route }: any) => {
//   // קבלת שם המשתמש מה-Params
//   const { userName } = route.params || { userName: 'אורח' };

//   const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
//   const [groups, setGroups] = useState<any[]>([]);
//   const [invites, setInvites] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // פונקציה לשליפת כל הנתונים
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       console.log(`מנסה לשלוף קבוצות עבור: ${userName}`);
      
//       // 1. שליפת קבוצות שאתה חבר בהן
//       // במקום users/${userName}/groups
// const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
//       // const resGroups = await fetch(`${BASE_URL}/users/${userName}/groups`);
//       const groupsData = await resGroups.json();
//       console.log("קבוצות שהתקבלו מהמסד:", groupsData);
//       setGroups(Array.isArray(groupsData) ? groupsData : []);

//       // 2. שליפת הזמנות שמחכות לך
//       const resInvites = await fetch(`${BASE_URL}/invitations/${userName}`);
//       const invitesData = await resInvites.json();
//       console.log("הזמנות שהתקבלו מהמסד:", invitesData);
//       setInvites(Array.isArray(invitesData) ? invitesData : []);

//     } catch (error) {
//       console.error("שגיאה בשליפה:", error);
//       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. בדוק שהשרת רץ.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // רענון אוטומטי כשנכנסים למסך
//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [userName])
//   );

//   // פונקציית אישור הצטרפות
//   const handleAccept = async (inviteId: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/invitations/accept/${inviteId}`, {
//         method: 'POST'
//       });
//       if (response.ok) {
//         Alert.alert("הצלחה", "הצטרפת לקבוצה!");
//         fetchData(); // רענון הנתונים
//       }
//     } catch (e) {
//       Alert.alert("שגיאה", "פעולת האישור נכשלה.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>הקבוצות שלי</Text>
//         <Text style={{color: '#666'}}>מחובר כ: {userName}</Text>
//       </View>

//       <View style={styles.tabBar}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
//           onPress={() => setActiveTab('invites')}
//         >
//           <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
//             הזמנות ({invites.length})
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
//           onPress={() => setActiveTab('mine')}
//         >
//           <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
//             הקבוצות שלי ({groups.length})
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {loading && groups.length === 0 && invites.length === 0 ? (
//         <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
//       ) : (
//         <FlatList
//           data={activeTab === 'mine' ? groups : invites}
//           keyExtractor={(item, index) => (item.id || item.groupId || index).toString()}
//           contentContainerStyle={styles.listContent}
//           refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <View style={styles.cardInfo}>
//                 <Text style={styles.cardTitle}>{item.name || item.groupName || "קבוצה ללא שם"}</Text>
//                 <Text style={styles.cardSubtitle}>
//                   {activeTab === 'mine' 
//                     ? `נוצר על ידי: ${item.creator || item.adminUsername || 'אני'}` 
//                     : `הוזמנת על ידי: ${item.inviterUsername}`}
//                 </Text>
//               </View>

//               {activeTab === 'invites' && (
//                 <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
//                   <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
//             </Text>
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' },
//   header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
//   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
//   tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
//   tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
//   activeTab: { borderBottomColor: '#6200EE' },
//   tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
//   activeTabText: { color: '#6200EE' },
//   listContent: { padding: 15 },
//   card: { 
//     backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
//     shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
//   },
//   cardInfo: { alignItems: 'flex-end' },
//   cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
//   acceptBtn: { 
//     backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
//     marginTop: 15, alignItems: 'center' 
//   },
//   acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
//   emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
// });

// export default MyGroups;



import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, FlatList, 
  ActivityIndicator, Alert, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; 
import { BASE_URL } from '../api/Constants';

const MyGroups = ({ navigation, route }: any) => {
  const { userName } = route.params || { userName: 'אורח' };

  const [activeTab, setActiveTab] = useState<'mine' | 'invites'>('mine');
  const [groups, setGroups] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    // setLoading(true); // הורדתי את ה-Loading כאן כדי שהבדיקה האוטומטית תהיה שקטה
    try {
      // 1. שליפת קבוצות - נתיב מעודכן לפי ה-Java Controller
      const resGroups = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
      const groupsData = await resGroups.json();
      setGroups(Array.isArray(groupsData) ? groupsData : []);

      // 2. שליפת הזמנות - נתיב מעודכן לפי ה-Java Controller
      const resInvites = await fetch(`${BASE_URL}/groups/invitations/${userName}`);
      const invitesData = await resInvites.json();
      
      // בדיקה: אם כמות ההזמנות בשרת גדולה ממה שיש לנו כרגע בזיכרון
      if (invitesData.length > invites.length && invites.length !== 0) {
        Alert.alert("הזמנה חדשה!", "מישהו הזמין אותך להצטרף לקבוצה.");
      }
      
      setInvites(Array.isArray(invitesData) ? invitesData : []);

    } catch (error) {
      console.error("שגיאה בשליפה:", error);
    } finally {
      setLoading(false);
    }
  };

  // רענון כבד (עם Loading) רק כשנכנסים למסך לראשונה
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [userName])
  );

  // מנגנון בדיקה אוטומטי כל 10 שניות (הודעה קופצת)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 10000); 
    return () => clearInterval(interval);
  }, [invites.length]);

  const handleAccept = async (inviteId: string) => {
    try {
      // עדכון הנתיב לפי ה-Java (שימוש ב-RequestParam כפי שכתבת בשרת)
      const response = await fetch(`${BASE_URL}/groups/invitations/accept?invitationId=${inviteId}`, {
        method: 'POST'
      });
      if (response.ok) {
        Alert.alert("הצלחה", "הצטרפת לקבוצה בהצלחה!");
        fetchData(); 
      }
    } catch (e) {
      Alert.alert("שגיאה", "פעולת האישור נכשלה.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>הקבוצות שלי</Text>
        {/* הצגת סטטוס מנהל או אורח מתחת לכותרת */}
        <Text style={{color: '#666', fontWeight: '600', marginTop: 4}}>
          {/* {userName === 'אורח' ? 'מחובר כ: אורח' : `סטטוס: מנהל (${userName})`} */}
        </Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'invites' && styles.activeTab]} 
          onPress={() => setActiveTab('invites')}
        >
          <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
            הזמנות ({invites.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]} 
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
            הקבוצות שלי ({groups.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading && groups.length === 0 && invites.length === 0 ? (
        <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={activeTab === 'mine' ? groups : invites}
          keyExtractor={(item, index) => (item.id || index).toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => {
                // לחיצה על הקבוצה מעבירה למסך פרטי קבוצה
                navigation.navigate('GroupDetails', { 
                  groupId: item.id, 
                  groupName: item.name || item.groupName 
                });
              }}
            >
              <View style={styles.cardInfo}>
                {/* שם הקבוצה בגדול כפי שביקשת */}
                <Text style={[styles.cardTitle, {fontSize: 22, marginBottom: 2}]}>
                  {item.name || item.groupName || "קבוצה ללא שם"}
                </Text>
                
                {/* מציג תת-כותרת רק אם זו הזמנה (מי הזמין אותי) */}
                {activeTab === 'invites' && (
                  <Text style={styles.cardSubtitle}>
                    הוזמנת על ידי: {item.inviterUsername}
                  </Text>
                )}
              </View>

              {activeTab === 'invites' && (
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
                  <Text style={styles.acceptBtnText}>אישור הצטרפות</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {activeTab === 'mine' ? "עדיין אין לך קבוצות" : "אין הזמנות חדשות"}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#6200EE' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#6200EE' },
  tabText: { fontSize: 16, color: '#666', fontWeight: '600' },
  activeTabText: { color: '#6200EE' },
  listContent: { padding: 15 },
  card: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 3 
  },
  cardInfo: { alignItems: 'flex-end' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 14, color: '#777', marginTop: 4 },
  acceptBtn: { 
    backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, 
    marginTop: 15, alignItems: 'center' 
  },
  acceptBtnText: { color: '#FFF', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});

export default MyGroups;