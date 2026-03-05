// // // // import React, { useState, useEffect } from 'react';
// // // // import { 
// // // //   View, Text, TextInput, FlatList, TouchableOpacity, 
// // // //   StyleSheet, Switch, Alert, ActivityIndicator 
// // // // } from 'react-native';
// // // // import { BASE_URL } from '../api/Constants';
// // // // const CreateGroupScreen = ({ navigation, route }: any) => {
// // // //   // 1. חילוץ השם האמיתי וה-Username מה-params שנשלחו מה-Login/Main
// // // //   const { userName, realName } = route.params || { userName: 'user_unknown', realName: 'משתמש כללי' };

// // // //   const [groupName, setGroupName] = useState('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [suggestions, setSuggestions] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(false);

// // // //   // 2. עדכון הרשימה ההתחלתית - את נכנסת עם ה-fullName שלך
// // // //   const [selectedMembers, setSelectedMembers] = useState<any[]>([
// // // //     { 
// // // //       username: userName, 
// // // //       fullName: realName, // השם האמיתי נשמר כאן בזיכרון
// // // //       isAdmin: true, 
// // // //       isCreator: true, 
// // // //       status: 'חבר' 
// // // //     }
// // // //   ]);

// // // //   // ה-IP שציינת בקוד שלך
// // // //   const MY_IP = "192.168.1.112"; 

// // // //  // חיפוש חברים וזיהוי אוטומטי בסיום הקלדה
// // // //   useEffect(() => {
// // // //     const delayDebounceFn = setTimeout(async () => {
// // // //       // מחפשים רק אם הוקלדו לפחות 2 אותיות
// // // //       if (searchQuery.length >= 2) {
// // // //         try {
// // // //           // שליחת שאילתה לשרת - מחפש בטבלת USERS
// // // //           const response = await fetch(`${BASE_URL}/users/search?name=${searchQuery}`);
// // // //           const data = await response.json();
          
// // // //           // 1. עדכון רשימת ההצעות (כדי שיוכלו גם ללחוץ ידנית)
// // // //           const filtered = data.filter((u: any) => 
// // // //             !selectedMembers.find(m => m.username === u.username)
// // // //           );
// // // //           setSuggestions(filtered);

// // // //           // 2. בדיקת זיהוי אוטומטי (מה שביקשת)
// // // //           // אנחנו בודקים אם מה שרשמת בתיבה תואם בדיוק ל-username של מישהו שחזר מהמסד
// // // //           const exactMatch = data.find((u: any) => 
// // // //             u.username.toLowerCase() === searchQuery.trim().toLowerCase()
// // // //           );

// // // //           // אם נמצאה התאמה מדויקת והוא לא נמצא כבר ברשימה למטה
// // // //           if (exactMatch && !selectedMembers.find(m => m.username === exactMatch.username)) {
// // // //             // קריאה לפונקציית addMember הקיימת שלך
// // // //             // היא כבר תשים אותו בסטטוס 'ממתין' ותקפיץ את ה-Alert
// // // //             addMember(exactMatch);
// // // //           }

// // // //         } catch (error) { 
// // // //           console.log("Search error", error); 
// // // //         }
// // // //       } else { 
// // // //         setSuggestions([]); 
// // // //       }
// // // //     }, 400); // השהיה קלה כדי לתת למשתמש לסיים להקליד
// // // //     return () => clearTimeout(delayDebounceFn);
// // // //   }, [searchQuery, selectedMembers]);
// // // //   // פונקציית הקסם: מוסיפה חבר וקופצת הודעה
// // // //   const addMember = (user: any) => {
// // // //     // 1. עדכון הרשימה למטה מיד
// // // //     const newMember = { 
// // // //       ...user, 
// // // //       isAdmin: false, 
// // // //       isCreator: false, 
// // // //       status: 'ממתין' // זה הסטטוס שיופיע מיד
// // // //     };
// // // //     setSelectedMembers([...selectedMembers, newMember]);

// // // //     // 2. ניקוי שדה החיפוש
// // // //     setSearchQuery('');
// // // //     setSuggestions([]);

// // // //     // 3. הודעה קופצת לאישור (סימולציה של שליחת בקשה)
// // // //     Alert.alert(
// // // //       "הזמנה נשלחה", 
// // // //       `שלחת בקשת הצטרפות ל${user.username}. הוא יראה זאת מיד במסך שלו.`
// // // //     );
// // // //   };

// // // //   const toggleAdmin = (username: string) => {
// // // //     setSelectedMembers(selectedMembers.map(m => 
// // // //       m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
// // // //     ));
// // // //   };

// // // //   const handleCreateGroup = async () => {
// // // //     if (!groupName.trim()) {
// // // //       Alert.alert("שגיאה", "נא להזין שם לקבוצה");
// // // //       return;
// // // //     }
// // // //     if (selectedMembers.length < 2) {
// // // //         Alert.alert("רגע...", "נא להוסיף לפחות חבר אחד לקבוצה");
// // // //         return;
// // // //     }

// // // //     setLoading(true);
// // // //     try {
// // // //       const response = await fetch(`${BASE_URL}/groups/create`, {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({
// // // //           groupName: groupName,
// // // //           creator: realName,
// // // //           invitedMembers: selectedMembers.filter(m => !m.isCreator) 
// // // //         }),
// // // //       });

// // // //       if (response.ok) {
// // // //         Alert.alert("הצלחה!", `הקבוצה "${groupName}" נוצרה והנתונים נשמרו ב-DB.`);
// // // //         navigation.goBack(); 
// // // //       } else {
// // // //           throw new Error("Server error");
// // // //       }
// // // //     } catch (error) {
// // // //       Alert.alert("שגיאה", "השרת לא הגיב. וודא ש-IntelliJ רץ, ה-IP נכון וה-Database מחובר.");
// // // //     } finally { 
// // // //       setLoading(false); 
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <Text style={styles.headerTitle}>יצירת קבוצה חדשה</Text>
      
// // // //       <Text style={styles.label}>שם הקבוצה:</Text>
// // // //       <TextInput 
// // // //         style={styles.input} 
// // // //         value={groupName} 
// // // //         onChangeText={setGroupName} 
// // // //         placeholder="למשל: הטיול השנתי..." 
// // // //       />

// // // //       <Text style={styles.label}>הוסף חברים (חפש שם):</Text>
// // // //       <TextInput 
// // // //         style={styles.input} 
// // // //         value={searchQuery} 
// // // //         onChangeText={setSearchQuery} 
// // // //         placeholder="הקלד שם משתמש..." 
// // // //       />

// // // //       {/* הצעות חיפוש - מופיעות מעל הרשימה */}
// // // //       {suggestions.length > 0 && (
// // // //         <View style={styles.suggestionsContainer}>
// // // //           {suggestions.map((item: any) => (
// // // //             <TouchableOpacity 
// // // //               key={item.id || item._id} 
// // // //               style={styles.suggestionItem} 
// // // //               onPress={() => addMember(item)}
// // // //             >
// // // //               <Text style={styles.addPlus}>➕</Text>
// // // //               <Text style={styles.suggestionText}>{item.username}</Text>
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </View>
// // // //       )}

// // // //       <View style={styles.divider} />

// // // //       <Text style={styles.subtitle}>רשימת חברים שיוזמנו ({selectedMembers.length}):</Text>
      
// // // //       <FlatList
// // // //         data={selectedMembers}
// // // //         keyExtractor={(item) => item.username}
// // // //         renderItem={({ item }) => (
// // // //           <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
// // // //             <View style={styles.adminControl}>
// // // //               <Text style={styles.smallText}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
// // // //               <Switch 
// // // //                 value={item.isAdmin} 
// // // //                 disabled={item.isCreator} 
// // // //                 onValueChange={() => toggleAdmin(item.username)} 
// // // //               />
// // // //             </View>
// // // //             <View style={{alignItems: 'flex-end'}}>
// // // //               <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
// // // //               <Text style={[styles.statusText, {color: item.status === 'ממתין' ? '#f39c12' : '#27ae60'}]}>
// // // //                 {item.status}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         )}
// // // //       />

// // // //       <TouchableOpacity 
// // // //         style={[styles.createButton, {opacity: loading ? 0.7 : 1}]} 
// // // //         onPress={handleCreateGroup}
// // // //         disabled={loading}
// // // //       >
// // // //         {loading ? (
// // // //           <ActivityIndicator color="#fff" />
// // // //         ) : (
// // // //           <Text style={styles.buttonText}>אישור סופי ויצירת קבוצה</Text>
// // // //         )}
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
// // // //   headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
// // // //   label: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 5, color: '#555' },
// // // //   input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, textAlign: 'right', marginBottom: 15, backgroundColor: '#fdfdfd' },
// // // //   suggestionsContainer: { backgroundColor: '#fff', borderRadius: 10, elevation: 8, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, zIndex: 999, marginBottom: 15, borderWidth: 1, borderColor: '#6200EE' },
// // // //   suggestionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
// // // //   suggestionText: { fontSize: 17, fontWeight: '500' },
// // // //   addPlus: { color: '#6200EE', fontSize: 18 },
// // // //   divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
// // // //   subtitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10, color: '#6200EE' },
// // // //   memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
// // // //   creatorRow: { backgroundColor: '#f3ebff', borderColor: '#6200EE' },
// // // //   memberName: { fontSize: 16, fontWeight: 'bold' },
// // // //   statusText: { fontSize: 13, marginTop: 3, fontWeight: '600' },
// // // //   adminControl: { flexDirection: 'row', alignItems: 'center' },
// // // //   smallText: { fontSize: 13, marginRight: 8, color: '#777' },
// // // //   createButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#6200EE', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
// // // //   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // // });

// // // // // export default CreateGroupScreen;
// // // // import React, { useState, useEffect } from 'react';
// // // // import { 
// // // //   View, Text, TextInput, FlatList, TouchableOpacity, 
// // // //   StyleSheet, Switch, Alert, ActivityIndicator 
// // // // } from 'react-native';
// // // // import { BASE_URL } from '../api/Constants';

// // // // const CreateGroupScreen = ({ navigation, route }: any) => {
// // // //   // 1. חילוץ השם האמיתי וה-Username מה-params שנשלחו מה-Login/Main
// // // //   const { userName, realName } = route.params || { userName: 'user_unknown', realName: 'משתמש כללי' };

// // // //   const [groupName, setGroupName] = useState('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [suggestions, setSuggestions] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(false);

// // // //   // 2. עדכון הרשימה ההתחלתית - את נכנסת עם ה-fullName שלך
// // // //   const [selectedMembers, setSelectedMembers] = useState<any[]>([
// // // //     { 
// // // //       username: userName, 
// // // //       fullName: realName, 
// // // //       isAdmin: true, 
// // // //       isCreator: true, 
// // // //       status: 'חבר' 
// // // //     }
// // // //   ]);

// // // //   const MY_IP = "192.168.1.112"; 

// // // //   useEffect(() => {
// // // //     const delayDebounceFn = setTimeout(async () => {
// // // //       if (searchQuery.length >= 2) {
// // // //         try {
// // // //           const response = await fetch(`${BASE_URL}/users/search?name=${searchQuery}`);
// // // //           const data = await response.json();
          
// // // //           const filtered = data.filter((u: any) => 
// // // //             !selectedMembers.find(m => m.username === u.username)
// // // //           );
// // // //           setSuggestions(filtered);

// // // //           const exactMatch = data.find((u: any) => 
// // // //             u.username.toLowerCase() === searchQuery.trim().toLowerCase()
// // // //           );

// // // //           if (exactMatch && !selectedMembers.find(m => m.username === exactMatch.username)) {
// // // //             addMember(exactMatch);
// // // //           }

// // // //         } catch (error) { 
// // // //           console.log("Search error", error); 
// // // //         }
// // // //       } else { 
// // // //         setSuggestions([]); 
// // // //       }
// // // //     }, 400);
// // // //     return () => clearTimeout(delayDebounceFn);
// // // //   }, [searchQuery, selectedMembers]);

// // // //   const addMember = (user: any) => {
// // // //     const newMember = { 
// // // //       ...user, 
// // // //       isAdmin: false, 
// // // //       isCreator: false, 
// // // //       status: 'ממתין'
// // // //     };
// // // //     setSelectedMembers([...selectedMembers, newMember]);
// // // //     setSearchQuery('');
// // // //     setSuggestions([]);

// // // //     Alert.alert(
// // // //       "הזמנה נשלחה", 
// // // //       `שלחת בקשת הצטרפות ל${user.username}. הוא יראה זאת מיד במסך שלו.`
// // // //     );
// // // //   };

// // // //   const toggleAdmin = (username: string) => {
// // // //     setSelectedMembers(selectedMembers.map(m => 
// // // //       m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
// // // //     ));
// // // //   };

// // // //   const handleCreateGroup = async () => {
// // // //     if (!groupName.trim()) {
// // // //       Alert.alert("שגיאה", "נא להזין שם לקבוצה");
// // // //       return;
// // // //     }
// // // //     if (selectedMembers.length < 2) {
// // // //         Alert.alert("רגע...", "נא להוסיף לפחות חבר אחד לקבוצה");
// // // //         return;
// // // //     }

// // // //     setLoading(true);
// // // //     try {
// // // //       const response = await fetch(`${BASE_URL}/groups/create`, {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({
// // // //           groupName: groupName,
// // // //           creator: userName, // <--- השינוי כאן: שולח את ה-username כדי שהשליפה בשרת תעבוד
// // // //           invitedMembers: selectedMembers.filter(m => !m.isCreator) 
// // // //         }),
// // // //       });

// // // //       if (response.ok) {
// // // //         Alert.alert("הצלחה!", `הקבוצה "${groupName}" נוצרה והנתונים נשמרו ב-DB.`);
// // // //         navigation.goBack(); 
// // // //       } else {
// // // //           throw new Error("Server error");
// // // //       }
// // // //     } catch (error) {
// // // //       Alert.alert("שגיאה", "השרת לא הגיב. וודא ש-IntelliJ רץ, ה-IP נכון וה-Database מחובר.");
// // // //     } finally { 
// // // //       setLoading(false); 
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <Text style={styles.headerTitle}>יצירת קבוצה חדשה</Text>
      
// // // //       <Text style={styles.label}>שם הקבוצה:</Text>
// // // //       <TextInput 
// // // //         style={styles.input} 
// // // //         value={groupName} 
// // // //         onChangeText={setGroupName} 
// // // //         placeholder="למשל: הטיול השנתי..." 
// // // //       />

// // // //       <Text style={styles.label}>הוסף חברים (חפש שם):</Text>
// // // //       <TextInput 
// // // //         style={styles.input} 
// // // //         value={searchQuery} 
// // // //         onChangeText={setSearchQuery} 
// // // //         placeholder="הקלד שם משתמש..." 
// // // //       />

// // // //       {suggestions.length > 0 && (
// // // //         <View style={styles.suggestionsContainer}>
// // // //           {suggestions.map((item: any) => (
// // // //             <TouchableOpacity 
// // // //               key={item.id || item._id} 
// // // //               style={styles.suggestionItem} 
// // // //               onPress={() => addMember(item)}
// // // //             >
// // // //               <Text style={styles.addPlus}>➕</Text>
// // // //               <Text style={styles.suggestionText}>{item.username}</Text>
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </View>
// // // //       )}

// // // //       <View style={styles.divider} />

// // // //       <Text style={styles.subtitle}>רשימת חברים שיוזמנו ({selectedMembers.length}):</Text>
      
// // // //       <FlatList
// // // //         data={selectedMembers}
// // // //         keyExtractor={(item) => item.username}
// // // //         renderItem={({ item }) => (
// // // //           <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
// // // //             <View style={styles.adminControl}>
// // // //               <Text style={styles.smallText}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
// // // //               <Switch 
// // // //                 value={item.isAdmin} 
// // // //                 disabled={item.isCreator} 
// // // //                 onValueChange={() => toggleAdmin(item.username)} 
// // // //               />
// // // //             </View>
// // // //             <View style={{alignItems: 'flex-end'}}>
// // // //               <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
// // // //               <Text style={[styles.statusText, {color: item.status === 'ממתין' ? '#f39c12' : '#27ae60'}]}>
// // // //                 {item.status}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         )}
// // // //       />

// // // //       <TouchableOpacity 
// // // //         style={[styles.createButton, {opacity: loading ? 0.7 : 1}]} 
// // // //         onPress={handleCreateGroup}
// // // //         disabled={loading}
// // // //       >
// // // //         {loading ? (
// // // //           <ActivityIndicator color="#fff" />
// // // //         ) : (
// // // //           <Text style={styles.buttonText}>אישור סופי ויצירת קבוצה</Text>
// // // //         )}
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
// // // //   headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
// // // //   label: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 5, color: '#555' },
// // // //   input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, textAlign: 'right', marginBottom: 15, backgroundColor: '#fdfdfd' },
// // // //   suggestionsContainer: { backgroundColor: '#fff', borderRadius: 10, elevation: 8, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, zIndex: 999, marginBottom: 15, borderWidth: 1, borderColor: '#6200EE' },
// // // //   suggestionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
// // // //   suggestionText: { fontSize: 17, fontWeight: '500' },
// // // //   addPlus: { color: '#6200EE', fontSize: 18 },
// // // //   divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
// // // //   subtitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10, color: '#6200EE' },
// // // //   memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
// // // //   creatorRow: { backgroundColor: '#f3ebff', borderColor: '#6200EE' },
// // // //   memberName: { fontSize: 16, fontWeight: 'bold' },
// // // //   statusText: { fontSize: 13, marginTop: 3, fontWeight: '600' },
// // // //   adminControl: { flexDirection: 'row', alignItems: 'center' },
// // // //   smallText: { fontSize: 13, marginRight: 8, color: '#777' },
// // // //   createButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#6200EE', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
// // // //   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // // });

// // // // export default CreateGroupScreen;.
// // // import React, { useState, useEffect } from 'react';
// // // import { 
// // //   View, Text, TextInput, FlatList, TouchableOpacity, 
// // //   StyleSheet, Switch, Alert, ActivityIndicator 
// // // } from 'react-native';
// // // import { BASE_URL } from '../api/Constants';

// // // const CreateGroupScreen = ({ navigation, route }: any) => {
// // //   // 1. חילוץ תקין של ה-userName. 
// // //   // השתמשתי ב-userName מה-params כדי למנוע את ה-unknown שראינו ב-DB
// // //   const { userName, realName } = route.params || {};
// // //   const currentUserName = userName || 'אורח';
// // //   const currentRealName = realName || 'משתמש כללי';

// // //   const [groupName, setGroupName] = useState('');
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [suggestions, setSuggestions] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(false);

// // //   // 2. הגדרת היוצר (אתה) כמנהל ראשון ברשימה
// // //   const [selectedMembers, setSelectedMembers] = useState<any[]>([
// // //     { 
// // //       username: currentUserName, 
// // //       fullName: currentRealName, 
// // //       isAdmin: true, 
// // //       isCreator: true, 
// // //       status: 'מנהל כחבר' 
// // //     }
// // //   ]);

// // //   useEffect(() => {
// // //     const delayDebounceFn = setTimeout(async () => {
// // //       if (searchQuery.length >= 2) {
// // //         try {
// // //           console.log("Invited members list:", selectedMembers.filter(m => !m.isCreator));
// // //           const response = await fetch(`${BASE_URL}/users/search?name=${searchQuery}`);
// // //           const data = await response.json();
          
// // //           const filtered = data.filter((u: any) => 
// // //             !selectedMembers.find(m => m.username === u.username)
// // //           );
// // //           setSuggestions(filtered);
// // //         } catch (error) { 
// // //           console.log("Search error", error); 
// // //         }
// // //       } else { 
// // //         setSuggestions([]); 
// // //       }
// // //     }, 400);
// // //     return () => clearTimeout(delayDebounceFn);
// // //   }, [searchQuery, selectedMembers]);

// // //   const addMember = (user: any) => {
// // //     const newMember = { 
// // //       ...user, 
// // //       isAdmin: false, 
// // //       isCreator: false, 
// // //       status: 'ממתין'
// // //     };
// // //     setSelectedMembers([...selectedMembers, newMember]);
// // //     setSearchQuery('');
// // //     setSuggestions([]);
// // //   };

// // //   const toggleAdmin = (username: string) => {
// // //     setSelectedMembers(selectedMembers.map(m => 
// // //       m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
// // //     ));
// // //   };

// // //   // const handleCreateGroup = async () => {
// // //   //   if (!groupName.trim()) {
// // //   //     Alert.alert("שגיאה", "נא להזין שם לקבוצה");
// // //   //     return;
// // //   //   }
    
// // //   //   setLoading(true);
// // //   //   try {
// // //   //     // יצירת מערך חברים מובנה לשרת הכולל את היוצר כמנהל
// // //   //     const allMembersToSave = selectedMembers.map(m => ({
// // //   //       username: m.username,
// // //   //       isAdmin: m.isAdmin
// // //   //     }));

// // //   //     const response = await fetch(`${BASE_URL}/groups/create`, {
// // //   //       method: 'POST',
// // //   //       headers: { 'Content-Type': 'application/json' },
// // //   //       body: JSON.stringify({
// // //   //         groupName: groupName,
// // //   //         creator: currentUserName, // השם האמיתי שלך מהלוגין
// // //   //         invitedMembers: selectedMembers.filter(m => !m.isCreator) // אלו יקבלו הזמנה בטבלת invitations
// // //   //       }),
// // //   //     });

// // //   //     if (response.ok) {
// // //   //       Alert.alert("הצלחה!", `הקבוצה "${groupName}" נוצרה.`);
// // //   //       navigation.navigate('MyGroups', { userName: currentUserName }); // חזרה ורענון
// // //   //     } else {
// // //   //       const errorData = await response.text();
// // //   //       throw new Error(errorData || "Server error");
// // //   //     }
// // //   //   } catch (error) {
// // //   //     Alert.alert("שגיאה", "הפעולה נכשלה. בדוק שהשרת רץ.");
// // //   //   } finally { 
// // //   //     setLoading(false); 
// // //   //   }
// // //   // };
// // // const handleCreateGroup = async () => {
// // //     if (!groupName.trim()) {
// // //       Alert.alert("שגיאה", "נא להזין שם לקבוצה");
// // //       return;
// // //     }
    
// // //   //   setLoading(true);
// // //   //   try {
// // //   //     // יצירת מערך מוזמנים נקי שכולל רק את מה שהשרת צריך
// // //   //     // זה מבטיח שהשרת יקבל 'username' ולא אובייקט ריק שיגרום לרישום "אורח"
// // //   //     const invitedList = selectedMembers
// // //   //       .filter(m => !m.isCreator)
// // //   //       .map(m => ({
// // //   //         username: m.username,
// // //   //         isAdmin: m.isAdmin
// // //   //       }));

// // //   //     const response = await fetch(`${BASE_URL}/groups/create`, {
// // //   //       method: 'POST',
// // //   //       headers: { 'Content-Type': 'application/json' },
// // //   //       body: JSON.stringify({
// // //   //         groupName: groupName,
// // //   //         creator: currentUserName, 
// // //   //         invitedMembers: invitedList // שולח רשימה נקייה עם שמות המשתמש הנכונים
// // //   //       }),
// // //   //     });

// // //   //     if (response.ok) {
// // //   //       Alert.alert("הצלחה!", `הקבוצה "${groupName}" נוצרה.`);
// // //   //       navigation.navigate('MyGroups', { userName: currentUserName });
// // //   //     } else {
// // //   //       const errorData = await response.text();
// // //   //       throw new Error(errorData || "Server error");
// // //   //     }
// // //   //   } catch (error) {
// // //   //     Alert.alert("שגיאה", "הפעולה נכשלה. בדוק שהשרת רץ.");
// // //   //   } finally { 
// // //   //     setLoading(false); 
// // //   //   }
// // //   // };
// // //   setLoading(true);
// // //     try {
// // //         // התיקון כאן: אנחנו הופכים כל אובייקט של חבר שבחרת
// // //         // למבנה פשוט שהשרת מבין: { username: "שם_החבר" }
// // //         const invitedList = selectedMembers
// // //             .filter(m => !m.isCreator) // לא שולחים את עצמך כמוזמן
// // //             .map(m => ({
// // //                 username: m.username, // <--- זה השדה של "את מי מזמינים"
// // //                 isAdmin: m.isAdmin
// // //             }));

// // //         console.log("רשימת המוזמנים שנשלחת לשרת:", invitedList);

// // //         const response = await fetch(`${BASE_URL}/groups/create`, {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({
// // //                 groupName: groupName,
// // //                 creator: currentUserName, // המזמין (אתה)
// // //                 invitedMembers: invitedList // המוזמנים (אלו שבחרת ברשימה)
// // //             }),
// // //         });

// // //         if (response.ok) {
// // //             Alert.alert("הצלחה!", `הקבוצה "${groupName}" נוצרה.`);
// // //             navigation.navigate('MyGroups', { userName: currentUserName });
// // //         } else {
// // //             throw new Error("Server error");
// // //         }
// // //     } catch (error) {
// // //         Alert.alert("שגיאה", "הפעולה נכשלה.");
// // //     } finally { 
// // //         setLoading(false); 
// // //     }
// // // };
// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.headerTitle}>יצירת קבוצה חדשה</Text>
      
// // //       <Text style={styles.label}>שם הקבוצה:</Text>
// // //       <TextInput 
// // //         style={styles.input} 
// // //         value={groupName} 
// // //         onChangeText={setGroupName} 
// // //         placeholder="למשל: הטיול השנתי..." 
// // //       />

// // //       <Text style={styles.label}>הוסף חברים (חפש שם):</Text>
// // //       <TextInput 
// // //         style={styles.input} 
// // //         value={searchQuery} 
// // //         onChangeText={setSearchQuery} 
// // //         placeholder="הקלד שם משתמש..." 
// // //       />

// // //       {suggestions.length > 0 && (
// // //         <View style={styles.suggestionsContainer}>
// // //           {suggestions.map((item: any) => (
// // //             <TouchableOpacity 
// // //               key={item.username} 
// // //               style={styles.suggestionItem} 
// // //               onPress={() => addMember(item)}
// // //             >
// // //               <Text style={styles.addPlus}>➕</Text>
// // //               <Text style={styles.suggestionText}>{item.username}</Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>
// // //       )}

// // //       <View style={styles.divider} />

// // //       <Text style={styles.subtitle}>רשימת חברים ({selectedMembers.length}):</Text>
      
// // //       <FlatList
// // //         data={selectedMembers}
// // //         keyExtractor={(item) => item.username}
// // //         renderItem={({ item }) => (
// // //           <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
// // //             <View style={styles.adminControl}>
// // //               <Text style={styles.smallText}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
// // //               <Switch 
// // //                 value={item.isAdmin} 
// // //                 disabled={item.isCreator} 
// // //                 onValueChange={() => toggleAdmin(item.username)} 
// // //               />
// // //             </View>
// // //             <View style={{alignItems: 'flex-end'}}>
// // //               <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
// // //               <Text style={[styles.statusText, {color: item.status === 'ממתין' ? '#f39c12' : '#27ae60'}]}>
// // //                 {item.status}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         )}
// // //       />

// // //       <TouchableOpacity 
// // //         style={[styles.createButton, {opacity: loading ? 0.7 : 1}]} 
// // //         onPress={handleCreateGroup}
// // //         disabled={loading}
// // //       >
// // //         {loading ? (
// // //           <ActivityIndicator color="#fff" />
// // //         ) : (
// // //           <Text style={styles.buttonText}>אישור סופי ויצירת קבוצה</Text>
// // //         )}
// // //       </TouchableOpacity>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
// // //   headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
// // //   label: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 5, color: '#555' },
// // //   input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, textAlign: 'right', marginBottom: 15, backgroundColor: '#fdfdfd' },
// // //   suggestionsContainer: { backgroundColor: '#fff', borderRadius: 10, elevation: 8, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, zIndex: 999, marginBottom: 15, borderWidth: 1, borderColor: '#6200EE' },
// // //   suggestionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
// // //   suggestionText: { fontSize: 17, fontWeight: '500' },
// // //   addPlus: { color: '#6200EE', fontSize: 18 },
// // //   divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
// // //   subtitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10, color: '#6200EE' },
// // //   memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
// // //   creatorRow: { backgroundColor: '#f3ebff', borderColor: '#6200EE' },
// // //   memberName: { fontSize: 16, fontWeight: 'bold' },
// // //   statusText: { fontSize: 13, marginTop: 3, fontWeight: '600' },
// // //   adminControl: { flexDirection: 'row', alignItems: 'center' },
// // //   smallText: { fontSize: 13, marginRight: 8, color: '#777' },
// // //   createButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#6200EE', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
// // //   buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // });

// // // export default CreateGroupScreen;// 1. שליפת הקבוצה כדי להוציא את רשימת החברים
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, Text, TextInput, FlatList, TouchableOpacity, 
// //   StyleSheet, Switch, Alert, ActivityIndicator 
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { BASE_URL } from '../api/Constants';

// // const CreateGroupScreen = ({ navigation, route }: any) => {
// //   const { userName, realName } = route.params || {};
// //   const currentUserName = userName || 'אורח';
// //   const currentRealName = realName || 'משתמש כללי';

// //   const [groupName, setGroupName] = useState('');
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [suggestions, setSuggestions] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   const [selectedMembers, setSelectedMembers] = useState<any[]>([
// //     { 
// //       username: currentUserName, 
// //       fullName: currentRealName, 
// //       isAdmin: true, 
// //       isCreator: true, 
// //       status: 'מנהל (אני)' 
// //     }
// //   ]);

// //   useEffect(() => {
// //     const delayDebounceFn = setTimeout(async () => {
// //       if (searchQuery.length >= 2) {
// //         try {
// //           const response = await fetch(`${BASE_URL}/users/search?name=${searchQuery}`);
// //           const data = await response.json();
// //           const filtered = data.filter((u: any) => 
// //             !selectedMembers.find(m => m.username === u.username)
// //           );
// //           setSuggestions(filtered);
// //         } catch (error) { 
// //           console.log("Search error", error); 
// //         }
// //       } else { 
// //         setSuggestions([]); 
// //       }
// //     }, 400);
// //     return () => clearTimeout(delayDebounceFn);
// //   }, [searchQuery, selectedMembers]);

// //   const addMember = (user: any) => {
// //     const newMember = { ...user, isAdmin: false, isCreator: false, status: 'ממתין' };
// //     setSelectedMembers([...selectedMembers, newMember]);
// //     setSearchQuery('');
// //     setSuggestions([]);
// //   };

// //   const toggleAdmin = (username: string) => {
// //     setSelectedMembers(selectedMembers.map(m => 
// //       m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
// //     ));
// //   };

// //   const handleCreateGroup = async () => {
// //     if (!groupName.trim()) {
// //       Alert.alert("חסר נתון", "נא להזין שם לקבוצה");
// //       return;
// //     }
// //     if (selectedMembers.length < 2) {
// //       Alert.alert("רגע...", "נא להוסיף לפחות חבר אחד לקבוצה");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const invitedList = selectedMembers
// //         .filter(m => !m.isCreator)
// //         .map(m => ({ username: m.username, isAdmin: m.isAdmin }));

// //       const response = await fetch(`${BASE_URL}/groups/create`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           groupName: groupName,
// //           creator: currentUserName,
// //           invitedMembers: invitedList
// //         }),
// //       });

// //       if (response.ok) {
// //         Alert.alert("איזה כיף! 🎉", `הקבוצה "${groupName}" נוצרה.`);
// //         navigation.navigate('MyGroups', { userName: currentUserName });
// //       } else {
// //         throw new Error("Server error");
// //       }
// //     } catch (error) {
// //       Alert.alert("שגיאה", "לא הצלחנו ליצור את הקבוצה.");
// //     } finally { 
// //       setLoading(false); 
// //     }
// //   };

// //   // רינדור של כל חבר ברשימה
// //   const renderMember = ({ item }: { item: any }) => (
// //     <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
// //       <View style={{ alignItems: 'flex-end', flex: 1 }}>
// //         <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
// //         <Text style={[styles.statusText, { color: item.status === 'ממתין' ? '#F59E0B' : '#64748B' }]}>
// //           {item.status}
// //         </Text>
// //       </View>
// //       <View style={styles.adminControl}>
// //         <Text style={styles.adminLabel}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
// //         <Switch 
// //           value={item.isAdmin} 
// //           disabled={item.isCreator} 
// //           trackColor={{ false: "#E4E4E7", true: "#C7D2FE" }}
// //           thumbColor={item.isAdmin ? "#6366F1" : "#F4F4F5"}
// //           onValueChange={() => toggleAdmin(item.username)} 
// //         />
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.logoText}>STEGO<Text style={{ color: '#6366F1' }}>SHARE</Text></Text>
// //         <Text style={styles.headerTitle}>קבוצה חדשה</Text>
// //       </View>

// //       <FlatList
// //         data={selectedMembers}
// //         keyExtractor={(item) => item.username}
// //         renderItem={renderMember}
// //         contentContainerStyle={styles.listContent}
// //         ListHeaderComponent={
// //           <View>
// //             <View style={styles.section}>
// //               <Text style={styles.label}>איך נקרא לקבוצה? 🎨</Text>
// //               <TextInput 
// //                 style={styles.input} 
// //                 value={groupName} 
// //                 onChangeText={setGroupName} 
// //                 placeholder="למשל: משפחה גרעינית..." 
// //                 placeholderTextColor="#A1A1AA"
// //               />
// //             </View>

// //             <View style={styles.section}>
// //               <Text style={styles.label}>הוספת חברים 👥</Text>
// //               <TextInput 
// //                 style={styles.input} 
// //                 value={searchQuery} 
// //                 onChangeText={setSearchQuery} 
// //                 placeholder="חפש לפי שם משתמש..." 
// //                 placeholderTextColor="#A1A1AA"
// //               />
// //             </View>

// //             {suggestions.length > 0 && (
// //               <View style={styles.suggestionsContainer}>
// //                 {suggestions.map((item) => (
// //                   <TouchableOpacity key={item.username} style={styles.suggestionItem} onPress={() => addMember(item)}>
// //                     <View style={styles.avatarMini}><Text style={{ fontSize: 12 }}>👤</Text></View>
// //                     <Text style={styles.suggestionText}>{item.username}</Text>
// //                     <Text style={styles.addPlus}>➕</Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //             )}
// //             <View style={styles.divider} />
// //             <Text style={styles.subtitle}>חברי הקבוצה ({selectedMembers.length})</Text>
// //           </View>
// //         }
// //         ListFooterComponent={
// //           <TouchableOpacity 
// //             style={[styles.createButton, { opacity: loading ? 0.7 : 1 }]} 
// //             onPress={handleCreateGroup}
// //             disabled={loading}
// //           >
// //             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>צור קבוצה מוצפנת! 🔐</Text>}
// //           </TouchableOpacity>
// //         }
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#FAF9FF' },
// //   header: { 
// //     flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', 
// //     paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
// //   },
// //   logoText: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
// //   headerTitle: { fontSize: 18, fontWeight: '800', color: '#6366F1' },
// //   listContent: { padding: 20 },
// //   section: { marginBottom: 15 },
// //   label: { fontSize: 16, fontWeight: '700', textAlign: 'right', marginBottom: 8, color: '#3F3F46' },
// //   input: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0' },
// //   suggestionsContainer: { backgroundColor: '#FFF', borderRadius: 20, elevation: 4, marginBottom: 20, borderWidth: 1, borderColor: '#C7D2FE', overflow: 'hidden' },
// //   suggestionItem: { flexDirection: 'row-reverse', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
// //   avatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
// //   suggestionText: { fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'right', marginRight: 15 },
// //   addPlus: { color: '#6366F1', fontSize: 16 },
// //   divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 15 },
// //   subtitle: { fontSize: 18, fontWeight: '800', textAlign: 'right', marginBottom: 15 },
// //   memberRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 18, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9' },
// //   creatorRow: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
// //   memberName: { fontSize: 16, fontWeight: '700' },
// //   statusText: { fontSize: 12, fontWeight: '600' },
// //   adminControl: { flexDirection: 'row', alignItems: 'center' },
// //   adminLabel: { fontSize: 12, marginRight: 8, color: '#71717A' },
// //   createButton: { backgroundColor: '#6366F1', padding: 20, borderRadius: 24, alignItems: 'center', marginTop: 20, marginBottom: 40 },
// //   buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
// // });

// // export default CreateGroupScreen;
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, FlatList, TouchableOpacity, 
//   StyleSheet, Switch, Alert, ActivityIndicator 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { BASE_URL } from '../api/Constants';

// const CreateGroupScreen = ({ navigation, route }: any) => {
//   // קבלת פרמטרים (כולל פרמטרי עריכה אם הגיעו מ-MyGroups)
//   const { 
//     userName, 
//     realName, 
//     isEditing, 
//     groupId, 
//     initialName, 
//     initialMembers 
//   } = route.params || {};

//   const currentUserName = userName || 'אורח';
//   const currentRealName = realName || 'משתמש כללי';

//   // State לשם הקבוצה - מתמלא אוטומטית בעריכה
//   const [groupName, setGroupName] = useState(initialName || '');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // State לחברים - אם אנחנו בעריכה, טוען את הרשימה הקיימת
//   const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

//   // אתחול רשימת החברים
//   useEffect(() => {
//     if (isEditing && initialMembers) {
//       // מצב עריכה: טוען חברים קיימים
//       setSelectedMembers(initialMembers);
//     } else {
//       // מצב יצירה: מוסיף רק את היוצר
//       setSelectedMembers([
//         { 
//           username: currentUserName, 
//           fullName: currentRealName, 
//           isAdmin: true, 
//           isCreator: true, 
//           status: 'מנהל (אני)' 
//         }
//       ]);
//     }
//   }, [isEditing]);

//   // לוגיקת חיפוש חברים
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(async () => {
//       if (searchQuery.length >= 2) {
//         try {
//           const response = await fetch(`${BASE_URL}/users/search?name=${searchQuery}`);
//           const data = await response.json();
//           const filtered = data.filter((u: any) => 
//             !selectedMembers.find(m => m.username === u.username)
//           );
//           setSuggestions(filtered);
//         } catch (error) { 
//           console.log("Search error", error); 
//         }
//       } else { 
//         setSuggestions([]); 
//       }
//     }, 400);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery, selectedMembers]);

//   const addMember = (user: any) => {
//     const newMember = { 
//       ...user, 
//       isAdmin: false, 
//       isCreator: false, 
//       status: 'ממתין'
//     };
//     setSelectedMembers([...selectedMembers, newMember]);
//     setSearchQuery('');
//     setSuggestions([]);
//   };

//   const removeMember = (username: string) => {
//     if (username === currentUserName) {
//       Alert.alert("שגיאה", "אתה לא יכול להסיר את עצמך מהקבוצה");
//       return;
//     }
//     setSelectedMembers(selectedMembers.filter(m => m.username !== username));
//   };

//   const toggleAdmin = (username: string) => {
//     setSelectedMembers(selectedMembers.map(m => 
//       m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
//     ));
//   };

//   const handleSaveGroup = async () => {
//     if (!groupName.trim()) {
//       Alert.alert("שגיאה", "נא להזין שם לקבוצה");
//       return;
//     }

//     setLoading(true);
//     try {
//       // הכנת הנתונים למשלוח
//       const payload = {
//         groupName: groupName,
//         creator: currentUserName,
//         invitedMembers: selectedMembers.filter(m => !m.isCreator)
//       };

//       // קביעת ה-URL והמתודה לפי מצב עריכה/יצירה
//       const url = isEditing 
//         ? `${BASE_URL}/groups/update/${groupId}` 
//         : `${BASE_URL}/groups/create`;
      
//       const method = isEditing ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method: method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         Alert.alert("הצלחה!", isEditing ? "הקבוצה עודכנה בהצלחה" : "הקבוצה נוצרה בהצלחה");
//         navigation.navigate('MyGroups', { userName: currentUserName });
//       } else {
//         throw new Error("Server error");
//       }
//     } catch (error) {
//       Alert.alert("שגיאה", "הפעולה נכשלה. וודא שהשרת רץ כראוי.");
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.headerTitle}>{isEditing ? "עריכת קבוצה" : "יצירת קבוצה חדשה"}</Text>
      
//       <Text style={styles.label}>שם הקבוצה:</Text>
//       <TextInput 
//         style={styles.input} 
//         value={groupName} 
//         onChangeText={setGroupName} 
//         placeholder="למשל: צוות פיתוח..." 
//       />

//       <Text style={styles.label}>הוספת חברים חדשים:</Text>
//       <TextInput 
//         style={styles.input} 
//         value={searchQuery} 
//         onChangeText={setSearchQuery} 
//         placeholder="חפש לפי שם משתמש..." 
//       />

//       {suggestions.length > 0 && (
//         <View style={styles.suggestionsContainer}>
//           {suggestions.map((item: any) => (
//             <TouchableOpacity 
//               key={item.username} 
//               style={styles.suggestionItem} 
//               onPress={() => addMember(item)}
//             >
//               <Text style={styles.addPlus}>➕</Text>
//               <Text style={styles.suggestionText}>{item.username}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       <View style={styles.divider} />

//       <Text style={styles.subtitle}>חברי הקבוצה ({selectedMembers.length}):</Text>
      
//       <FlatList
//         data={selectedMembers}
//         keyExtractor={(item) => item.username}
//         renderItem={({ item }) => (
//           <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
//             <View style={styles.leftControls}>
//                {!item.isCreator && (
//                  <TouchableOpacity onPress={() => removeMember(item.username)}>
//                    <Text style={styles.deleteIcon}>🗑️</Text>
//                  </TouchableOpacity>
//                )}
//                <View style={styles.adminControl}>
//                   <Text style={styles.smallText}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
//                   <Switch 
//                     value={item.isAdmin} 
//                     disabled={item.isCreator} 
//                     onValueChange={() => toggleAdmin(item.username)} 
//                     trackColor={{ false: "#767577", true: "#81b0ff" }}
//                   />
//                </View>
//             </View>
            
//             <View style={{alignItems: 'flex-end'}}>
//               <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
//               <Text style={[styles.statusText, {color: item.isCreator ? '#6200EE' : '#f39c12'}]}>
//                 {item.isCreator ? 'מנהל מערכת' : 'חבר בקבוצה'}
//               </Text>
//             </View>
//           </View>
//         )}
//       />

//       <TouchableOpacity 
//         style={[styles.createButton, {backgroundColor: isEditing ? '#8B5CF6' : '#6200EE'}]} 
//         onPress={handleSaveGroup}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>{isEditing ? "שמור שינויים" : "צור קבוצה עכשיו"}</Text>
//         )}
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
//   headerTitle: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 20, color: '#1E293B' },
//   label: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 8, color: '#475569' },
//   input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 15, padding: 15, textAlign: 'right', marginBottom: 15, backgroundColor: '#FFF' },
//   suggestionsContainer: { backgroundColor: '#FFF', borderRadius: 12, elevation: 10, zIndex: 999, marginBottom: 15, borderWidth: 1, borderColor: '#6366F1' },
//   suggestionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
//   suggestionText: { fontSize: 16, fontWeight: '600' },
//   addPlus: { color: '#6366F1', fontSize: 18 },
//   divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
//   subtitle: { fontSize: 18, fontWeight: '800', textAlign: 'right', marginBottom: 15, color: '#6366F1' },
//   memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderRadius: 18, marginBottom: 10, elevation: 2 },
//   creatorRow: { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#6366F1' },
//   leftControls: { flexDirection: 'row', alignItems: 'center' },
//   adminControl: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
//   deleteIcon: { fontSize: 20, marginRight: 10 },
//   memberName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
//   statusText: { fontSize: 12, fontWeight: '700', marginTop: 2 },
//   smallText: { fontSize: 12, marginRight: 5, color: '#64748B' },
//   createButton: { padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 5 },
//   buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
// });

// export default CreateGroupScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Switch, Alert, ActivityIndicator 
} from 'react-native';
import { BASE_URL } from '../api/Constants';

const CreateGroupScreen = ({ navigation, route }: any) => {
  // 1. חילוץ הפרמטרים - גם ליצירה וגם לעריכה
  const { 
    userName, 
    realName, 
    isEditing, 
    groupId, 
    initialName, 
    initialMembers 
  } = route.params || {};

  const currentUserName = userName || 'אורח';
  const currentRealName = realName || 'משתמש כללי';

  const [groupName, setGroupName] = useState(initialName || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. אתחול רשימת החברים
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

  useEffect(() => {
    if (isEditing && initialMembers) {
      const mapped = initialMembers.map((m: any) => ({
        ...m,
        isCreator: m.username === currentUserName,
        // isAdmin נשמר מהדאטהבייס
      }));
      setSelectedMembers(mapped);
    } else {
      // ביצירה חדשה: הגדרת עצמך כמנהל עם isAdmin: true
      setSelectedMembers([
        { 
          username: currentUserName, 
          fullName: currentRealName, 
          isAdmin: true,   // <--- זה מה שמציג אותך כמנהל (הכתר)
          isCreator: true, 
        }
      ]);
    }
  }, [isEditing, initialMembers]);
  // לוגיקת חיפוש (נשארה כפי שהייתה)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const response = await fetch(`${BASE_URL}/users/search?name=${searchQuery}`);
          const data = await response.json();
          
          const filtered = data.filter((u: any) => 
            !selectedMembers.find(m => m.username === u.username)
          );
          setSuggestions(filtered);
        } catch (error) { 
          console.log("Search error", error); 
        }
      } else { 
        setSuggestions([]); 
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedMembers]);

  const addMember = (user: any) => {
    const newMember = { 
      ...user, 
      isAdmin: false, 
      isCreator: false, 
      status: 'ממתין'
    };
    setSelectedMembers([...selectedMembers, newMember]);
    setSearchQuery('');
    setSuggestions([]);
  };

  const toggleAdmin = (username: string) => {
    setSelectedMembers(selectedMembers.map(m => 
      m.username === username ? { ...m, isAdmin: !m.isAdmin } : m
    ));
  };

  const handleSaveGroup = async () => {
  if (!groupName.trim()) {
    Alert.alert("שגיאה", "נא להזין שם לקבוצה");
    return;
  }

  setLoading(true);
  try {
    // 1. ניקוי אגרסיבי של ה-ID מכל תו שאינו אות או מספר (מנקה \n, \r, רווחים ונקודות)
    const cleanId = isEditing && groupId 
      ? groupId.toString().replace(/[^a-zA-Z0-9]/g, '') 
      : '';

    const url = isEditing 
      ? `${BASE_URL}/groups/update/${cleanId}` 
      : `${BASE_URL}/groups/create`;

    // 2. בניית ה-Payload עם שמות שדות תואמים ל-Java (isAdmin)
    const payload = isEditing ? {
      name: groupName, 
      creator: currentUserName,
      members: selectedMembers.map(m => ({
        username: m.username,
        isAdmin: m.isAdmin // <--- חייב להיות isAdmin כדי להתאים ל-Java
      }))
    } : {
      groupName: groupName,
      creator: currentUserName,
      invitedMembers: selectedMembers
        .filter(m => !m.isCreator)
        .map(m => ({
          username: m.username,
          isAdmin: m.isAdmin
        }))
    };

    // הדפסות לדיבאג - וודא שה-URL ב-Log יוצא נקי בלי נקודות בסוף
    console.log("DEBUG: Sending to Clean URL:", url);
    console.log("DEBUG: Final Payload:", JSON.stringify(payload));

    const response = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Alert.alert("הצלחה!", isEditing ? "הקבוצה עודכנה" : "הקבוצה נוצרה");
      navigation.navigate('MyGroups', { userName: currentUserName });
    } else {
      const errorText = await response.text();
      console.error("SERVER ERROR:", errorText);
      Alert.alert("שגיאה", "השרת החזיר שגיאה. בדוק את ה-Log ב-IntelliJ.");
    }
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    Alert.alert("שגיאה", "לא ניתן להתחבר לשרת.");
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{isEditing ? 'עריכת קבוצה' : 'יצירת קבוצה חדשה'}</Text>
      
      <Text style={styles.label}>שם הקבוצה:</Text>
      <TextInput 
        style={styles.input} 
        value={groupName} 
        onChangeText={setGroupName} 
        placeholder="למשל: הטיול השנתי..." 
      />

      <Text style={styles.label}>הוסף חברים (חפש שם):</Text>
      <TextInput 
        style={styles.input} 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        placeholder="הקלד שם משתמש..." 
      />

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item: any) => (
            <TouchableOpacity 
              key={item.username} 
              style={styles.suggestionItem} 
              onPress={() => addMember(item)}
            >
              <Text style={styles.addPlus}>➕</Text>
              <Text style={styles.suggestionText}>{item.username}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.divider} />

      <Text style={styles.subtitle}>רשימת חברים ({selectedMembers.length}):</Text>
      
      <FlatList
        data={selectedMembers}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={[styles.memberRow, item.isCreator && styles.creatorRow]}>
            <View style={styles.adminControl}>
              <Text style={styles.smallText}>{item.isAdmin ? "מנהל" : "חבר"}</Text>
              <Switch 
                value={item.isAdmin} 
                disabled={item.isCreator} 
                onValueChange={() => toggleAdmin(item.username)} 
              />
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.memberName}>{item.username} {item.isCreator ? "(אני)" : ""}</Text>
              <Text style={[styles.statusText, {color: item.isAdmin || item.isCreator ? '#6200EE' : '#f39c12'}]}>
                {item.isCreator ? 'מנהל (יוצר)' : (item.isAdmin ? 'מנהל' : 'חבר')}
              </Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity 
        style={[styles.createButton, {opacity: loading ? 0.7 : 1}]} 
        onPress={handleSaveGroup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isEditing ? 'שמור שינויים' : 'אישור סופי ויצירת קבוצה'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, textAlign: 'right', marginBottom: 15, backgroundColor: '#fdfdfd' },
  suggestionsContainer: { backgroundColor: '#fff', borderRadius: 10, elevation: 8, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, zIndex: 999, marginBottom: 15, borderWidth: 1, borderColor: '#6200EE' },
  suggestionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  suggestionText: { fontSize: 17, fontWeight: '500' },
  addPlus: { color: '#6200EE', fontSize: 18 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10, color: '#6200EE' },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' },
  creatorRow: { backgroundColor: '#f3ebff', borderColor: '#6200EE' },
  memberName: { fontSize: 16, fontWeight: 'bold' },
  statusText: { fontSize: 13, marginTop: 3, fontWeight: '600' },
  adminControl: { flexDirection: 'row', alignItems: 'center' },
  smallText: { fontSize: 13, marginRight: 8, color: '#777' },
  createButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, shadowColor: '#6200EE', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreateGroupScreen;