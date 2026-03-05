// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { 
// // // // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // // // //   ScrollView, Alert, ActivityIndicator, Image 
// // // // // // } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import * as DocumentPicker from '@react-native-documents/picker';
// // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // // // //   // Extracting data from navigation params
// // // // // //   const { target, groupId, groupName, userName } = route.params || {};

// // // // // //   // --- ENGLISH CONSOLE LOGS ---
// // // // // //   useEffect(() => {
// // // // // //     console.log("======= NEW POST SCREEN LOADED =======");
// // // // // //     console.log("Current User:", userName ? userName : "MISSING USERNAME");
// // // // // //     console.log("Target Group ID:", groupId);
// // // // // //     console.log("Target Type:", target);
// // // // // //     console.log("======================================");
// // // // // //   }, []);

// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [description, setDescription] = useState('');
// // // // // //   const [secretMessage, setSecretMessage] = useState('');
// // // // // //   const [file, setFile] = useState<any>(null);
// // // // // // // --- States חדשים לחיפוש חברים ---
// // // // // //   const [groupMembers, setGroupMembers] = useState<any[]>([]); // רשימת כל החברים
// // // // // //   const [filteredMembers, setFilteredMembers] = useState<any[]>([]); // רשימה מסוננת לחיפוש
// // // // // //   const [searchQuery, setSearchQuery] = useState(''); // טקסט החיפוש
// // // // // //   const [selectedRecipient, setSelectedRecipient] = useState<any>(null); // החבר שנבחר

// // // // // //  useEffect(() => {
// // // // // //     if (target === 'group') {
// // // // // //       if (!groupId) {
// // // // // //         Alert.alert("שגיאה", "groupId חסר, לכן אי אפשר לשלוף חברים");
// // // // // //         return;
// // // // // //       }

// // // // // //       const url = `${BASE_URL}/api/groups/${groupId}/members`;
      
// // // // // //       // ההדפסה הזו תעזור לנו לראות את הכתובת המדויקת
// // // // // //       console.log("Fetching from:", url); 

// // // // // //       fetch(url)
// // // // // //         .then(res => {
// // // // // //           if (res.status === 404) {
// // // // // //              // אם זה קופץ, הכתובת פשוט לא נכונה בשרת
// // // // // //              Alert.alert("שגיאה 404", "השרת לא מכיר את הכתובת: " + url);
// // // // // //              throw new Error("Endpoint not found");
// // // // // //           }
// // // // // //           return res.json();
// // // // // //         })
// // // // // //         .then(data => {
// // // // // //           setGroupMembers(data);
// // // // // //           setFilteredMembers(data);
// // // // // //         })
// // // // // //         .catch(err => console.error("Error:", err));
// // // // // //     }
// // // // // // }, [groupId, target]);
// // // // // //   // לוגיקת החיפוש והסינון
// // // // // //   const handleUserSearch = (text: string) => {
// // // // // //     setSearchQuery(text);
// // // // // //     if (text.length > 0) {
// // // // // //       const filtered = groupMembers.filter(m => 
// // // // // //         m.username && m.username.toLowerCase().includes(text.toLowerCase())
// // // // // //       );
// // // // // //       setFilteredMembers(filtered);
// // // // // //     } else {
// // // // // //       setFilteredMembers(groupMembers);
// // // // // //     }
// // // // // //     // אם המשתמש משנה את הטקסט, נבטל את הבחירה הקודמת
// // // // // //     if (selectedRecipient && text !== selectedRecipient.username) {
// // // // // //       setSelectedRecipient(null);
// // // // // //     }
// // // // // //   };
// // // // // //   const pickFile = async () => {
// // // // // //     try {
// // // // // //       const results = await DocumentPicker.pick({
// // // // // //         type: [DocumentPicker.types.images],
// // // // // //       });
// // // // // //       const selectedFile = results[0];
// // // // // //       setFile({
// // // // // //         uri: selectedFile.uri,
// // // // // //         name: selectedFile.name,
// // // // // //         type: selectedFile.type,
// // // // // //       });
// // // // // //       console.log("FILE SELECTED:", selectedFile.name);
// // // // // //     } catch (err: any) {
// // // // // //       if (err?.code !== 'PICKER_CANCELLED') {
// // // // // //         console.log("PICKER ERROR:", err);
// // // // // //       }
// // // // // //     }
// // // // // //   };

// // // // // //   const handlePublish = async () => {
// // // // // //     // Validation
// // // // // //     if (!file) {
// // // // // //         return Alert.alert("Wait!", "Please select an image first.");
// // // // // //     }
// // // // // //     if (!userName || userName === 'אורח') {
// // // // // //         console.log("CRITICAL ERROR: 'userName' is undefined or Guest.");
// // // // // //         return Alert.alert("Auth Error", "User name not found. Go back and try again.");
// // // // // //     }

// // // // // //     setLoading(true);
// // // // // //     console.log("--- PUBLISHING START ---");
// // // // // //     console.log("Sender:", userName);

// // // // // //     const formData = new FormData();
    
// // // // // //     // Adding the file
// // // // // //     formData.append('file', {
// // // // // //       uri: file.uri,
// // // // // //       type: file.type || 'image/jpeg',
// // // // // //       name: file.name || 'upload.jpg',
// // // // // //     } as any);

// // // // // //     // Adding metadata
// // // // // //     formData.append('description', description);
// // // // // //     formData.append('senderUsername', userName); // The field expected by Java
// // // // // //     formData.append('target', target === 'group' ? groupId : 'world');

// // // // // //     // Handling secret message (Steganography data)
// // // // // //     if (secretMessage) {
// // // // // //       const messagesMap = { [userName]: secretMessage };
// // // // // //       formData.append('userMessagesJson', JSON.stringify(messagesMap));
// // // // // //       console.log("SECRET MESSAGE ATTACHED:", secretMessage);
// // // // // //     }

// // // // // //     try {
// // // // // //       const response = await fetch(`${BASE_URL}/posts/create`, {
// // // // // //         method: 'POST',
// // // // // //         body: formData,
// // // // // //         headers: {
// // // // // //           'Accept': 'application/json',
// // // // // //           // Note: Content-Type must NOT be set when using FormData
// // // // // //         },
// // // // // //       });

// // // // // //       if (response.ok) {
// // // // // //         console.log("✅ SERVER SUCCESS: Post published");
// // // // // //         Alert.alert("Success", "Post published successfully!");
// // // // // //         navigation.goBack();
// // // // // //       } else {
// // // // // //         const errorText = await response.text();
// // // // // //         console.log("❌ SERVER REJECTED:", errorText);
// // // // // //         Alert.alert("Failed", "Server error. Check logs.");
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error("❌ CONNECTION ERROR:", error);
// // // // // //       Alert.alert("Connection Error", "Is your server running?");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //       console.log("--- PUBLISHING END ---");
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
        
// // // // // //         <Text style={styles.title}>New Post</Text>
// // // // // //         <Text style={styles.userLabel}>Logged in as: <Text style={styles.boldText}>{userName || "Unknown"}</Text></Text>

// // // // // //         {/* Media Picker */}
// // // // // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // // // // //           {file ? (
// // // // // //             <Image source={{ uri: file.uri }} style={styles.previewImage} />
// // // // // //           ) : (
// // // // // //             <View style={styles.placeholderBox}>
// // // // // //               <Text style={styles.icon}>📷</Text>
// // // // // //               <Text style={styles.filePickerText}>Tap to select image</Text>
// // // // // //             </View>
// // // // // //           )}
// // // // // //         </TouchableOpacity>

// // // // // //         {/* Public Description */}
// // // // // //         <Text style={styles.label}>Caption</Text>
// // // // // //         <TextInput 
// // // // // //             style={styles.input} 
// // // // // //             placeholder="Write a caption..." 
// // // // // //             onChangeText={setDescription}
// // // // // //             placeholderTextColor="#999"
// // // // // //         />
// // // // // // {/* --- חלק 1: תיבת חיפוש ורשימת חברים --- */}
// // // // // // {target === 'group' && (
// // // // // //   <View style={{ marginBottom: 20 }}>
// // // // // //     <Text style={styles.label}>בחר למי מיועד המסר (חיפוש חבר)</Text>
// // // // // //     <TextInput
// // // // // //       style={styles.input}
// // // // // //       placeholder="הקלד שם חבר..."
// // // // // //       value={searchQuery}
// // // // // //       onChangeText={handleUserSearch} // הפונקציה שמסננת
// // // // // //       placeholderTextColor="#999"
// // // // // //     />
    
// // // // // //     {/* הצגת רשימת התוצאות רק כשמתחילים להקליד ועדיין לא נבחר חבר */}
// // // // // //     {searchQuery.length > 0 && !selectedRecipient && (
// // // // // //       <View style={styles.dropdown}>
// // // // // //         {filteredMembers.map((member: any) => (
// // // // // //           <TouchableOpacity 
// // // // // //             key={member.username} 
// // // // // //             style={styles.memberItem}
// // // // // //             onPress={() => {
// // // // // //               setSelectedRecipient(member); // שומר את החבר שנבחר
// // // // // //               setSearchQuery(member.username); // מעדכן את השדה לשם הנבחר
// // // // // //             }}
// // // // // //           >
// // // // // //             <Text style={{ color: '#333', fontWeight: 'bold' }}>{member.username}</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         ))}
// // // // // //       </View>
// // // // // //     )}

// // // // // //     {/* הצגת אישור שהחבר נבחר */}
// // // // // //     {selectedRecipient && (
// // // // // //       <Text style={styles.selectedText}>
// // // // // //         המסר יוסתר עבור: {selectedRecipient.username} ✅
// // // // // //       </Text>
// // // // // //     )}
// // // // // //   </View>
// // // // // // )}
// // // // // //         {/* Hidden Message Section */}
// // // // // //         <Text style={[styles.label, { color: '#D32F2F' }]}>Secret Message (Hidden in image)</Text>
// // // // // //         <TextInput 
// // // // // //             style={[styles.input, styles.secretInput]} 
// // // // // //             placeholder="Type secret message here..." 
// // // // // //             onChangeText={setSecretMessage}
// // // // // //             placeholderTextColor="#FFCDD2"
// // // // // //         />

// // // // // //         {/* Action Buttons */}
// // // // // //         <TouchableOpacity 
// // // // // //             style={[styles.submitButton, loading && { backgroundColor: '#ccc' }]} 
// // // // // //             onPress={handlePublish} 
// // // // // //             disabled={loading}
// // // // // //         >
// // // // // //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Publish Now 🚀</Text>}
// // // // // //         </TouchableOpacity>

// // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
// // // // // //           <Text style={styles.cancelButtonText}>Discard</Text>
// // // // // //         </TouchableOpacity>

// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#fff' },
// // // // // //   scrollContent: { padding: 25 },
// // // // // //   title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5, textAlign: 'center' },
// // // // // //   userLabel: { textAlign: 'center', marginBottom: 25, color: '#666', fontSize: 14 },
// // // // // //   boldText: { fontWeight: 'bold', color: '#075E54' },
// // // // // //   label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#444' },
// // // // // //   filePicker: { 
// // // // // //     height: 220, 
// // // // // //     borderWidth: 2, 
// // // // // //     borderColor: '#075E54', 
// // // // // //     borderStyle: 'dashed', 
// // // // // //     borderRadius: 15, 
// // // // // //     marginBottom: 25, 
// // // // // //     backgroundColor: '#f9f9f9', 
// // // // // //     overflow: 'hidden' 
// // // // // //   },
// // // // // //   placeholderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// // // // // //   previewImage: { width: '100%', height: '100%' },
// // // // // //   icon: { fontSize: 40, marginBottom: 10 },
// // // // // //   filePickerText: { color: '#075E54', fontWeight: 'bold' },
// // // // // //   input: { 
// // // // // //     backgroundColor: '#fff', 
// // // // // //     borderRadius: 10, 
// // // // // //     padding: 15, 
// // // // // //     marginBottom: 20, 
// // // // // //     borderWidth: 1, 
// // // // // //     borderColor: '#eee',
// // // // // //     fontSize: 16,
// // // // // //     color: '#000'
// // // // // //   },
// // // // // //   secretInput: { borderColor: '#FFCDD2', color: '#B71C1C' },
// // // // // //   submitButton: { 
// // // // // //     backgroundColor: '#075E54', 
// // // // // //     padding: 18, 
// // // // // //     borderRadius: 12, 
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.2,
// // // // // //     elevation: 4
// // // // // //   },
// // // // // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// // // // // //   cancelButton: { marginTop: 20, alignItems: 'center' },
// // // // // //   cancelButtonText: { color: '#999', fontSize: 14 },
// // // // // //   // --- תוסיף את אלו בסוף ה-StyleSheet ---
// // // // // //   dropdown: {
// // // // // //     backgroundColor: '#fff',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#ddd',
// // // // // //     borderRadius: 8,
// // // // // //     marginTop: 2,
// // // // // //     marginBottom: 10,
// // // // // //     maxHeight: 150, // גובה מקסימלי לרשימה כדי שלא תתפוס את כל המסך
// // // // // //     elevation: 5, // צל באנדרואיד
// // // // // //     shadowColor: '#000', // צל באייפון
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     zIndex: 1000, // גורם לרשימה לצוף מעל שדות אחרים
// // // // // //   },
// // // // // //   memberItem: {
// // // // // //     padding: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f0',
// // // // // //   },
// // // // // //   selectedText: {
// // // // // //     color: '#075E54', // צבע ירוק כהה (כמו וואטסאפ)
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: 'bold',
// // // // // //     marginTop: 5,
// // // // // //     marginBottom: 10,
// // // // // //     textAlign: 'right', // מתאים לעברית
// // // // // //   },
// // // // // // });

// // // // // // export default CreatePostScreen;
// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { 
// // // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // // //   ScrollView, Alert, ActivityIndicator, Image 
// // // // // } from 'react-native';
// // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // import * as DocumentPicker from '@react-native-documents/picker';
// // // // // import { BASE_URL } from '../api/Constants';

// // // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // // //   const { target, groupId, userName } = route.params || {};

// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [description, setDescription] = useState('');
// // // // //   const [file, setFile] = useState<any>(null);

// // // // //   // --- States לניהול חברים ומסרים ---
// // // // //   const [groupMembers, setGroupMembers] = useState<any[]>([]);
// // // // //   const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
// // // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // // //   // מצב עבודה: 'individual' (לכל אחד בנפרד) או 'group' (לכל הקבוצה)
// // // // //   const [sendMode, setSendMode] = useState<'individual' | 'group'>('individual');
// // // // //   const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});
// // // // //   const [currentSecretMessage, setCurrentSecretMessage] = useState('');

// // // // //   useEffect(() => {
// // // // //     if (target === 'group' && groupId) {
// // // // //       const url = `${BASE_URL}/groups/${groupId}/members`;
// // // // //       fetch(url)
// // // // //         .then(res => res.ok ? res.json() : Promise.reject())
// // // // //         .then(data => {
// // // // //           setGroupMembers(data);
// // // // //           setFilteredMembers(data);
// // // // //         })
// // // // //         .catch(err => console.error("Fetch Error:", err));
// // // // //     }
// // // // //   }, [groupId, target]);

// // // // //   const handleUserSearch = (text: string) => {
// // // // //     setSearchQuery(text);
// // // // //     const filtered = groupMembers.filter(m => 
// // // // //       m.username && m.username.toLowerCase().includes(text.toLowerCase())
// // // // //     );
// // // // //     setFilteredMembers(filtered);
// // // // //   };

// // // // //   // פונקציה להוספת חבר בנפרד
// // // // //   const addRecipient = (member: any) => {
// // // // //     if (!currentSecretMessage.trim()) {
// // // // //       Alert.alert("חסר מסר", "אנא כתוב מסר סודי לפני בחירת החבר.");
// // // // //       return;
// // // // //     }
// // // // //     setSelectedRecipients(prev => ({ ...prev, [member.username]: currentSecretMessage }));
// // // // //     setCurrentSecretMessage('');
// // // // //     setSearchQuery('');
// // // // //   };

// // // // //   // פונקציה להחלת המסר על כל חברי הקבוצה
// // // // //   const applyToAll = () => {
// // // // //     if (!currentSecretMessage.trim()) {
// // // // //       Alert.alert("חסר מסר", "אנא כתוב את המסר שברצונך לשלוח לכולם.");
// // // // //       return;
// // // // //     }
// // // // //     const allMessages: { [key: string]: string } = {};
// // // // //     groupMembers.forEach(m => {
// // // // //       allMessages[m.username] = currentSecretMessage;
// // // // //     });
// // // // //     setSelectedRecipients(allMessages);
// // // // //     Alert.alert("הצלחה", `המסר הוצמד ל-${groupMembers.length} חברים`);
// // // // //   };

// // // // //   const pickFile = async () => {
// // // // //     try {
// // // // //       const results = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
// // // // //       setFile({ uri: results[0].uri, name: results[0].name, type: results[0].type });
// // // // //     } catch (err) { /* Handle cancel */ }
// // // // //   };

// // // // //   const handlePublish = async () => {
// // // // //     if (!file) return Alert.alert("Wait!", "Select an image.");
// // // // //     setLoading(true);
// // // // //     const formData = new FormData();
// // // // //     formData.append('file', { uri: file.uri, type: file.type || 'image/jpeg', name: file.name || 'upload.jpg' } as any);
// // // // //     formData.append('description', description);
// // // // //     formData.append('senderUsername', userName);
// // // // //     formData.append('target', target === 'group' ? groupId : 'world');

// // // // //     if (Object.keys(selectedRecipients).length > 0) {
// // // // //       formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
// // // // //     }

// // // // //     try {
// // // // //       const res = await fetch(`${BASE_URL}/posts/create`, { method: 'POST', body: formData });
// // // // //       if (res.ok) { navigation.goBack(); } else { Alert.alert("Error", "Server failed."); }
// // // // //     } catch (e) { Alert.alert("Error", "Check connection."); } finally { setLoading(false); }
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // // //         <Text style={styles.title}>פוסט חדש</Text>

// // // // //         {/* בחירת תמונה */}
// // // // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // // // //           {file ? <Image source={{ uri: file.uri }} style={styles.previewImage} /> : <Text>📷 בחר תמונה</Text>}
// // // // //         </TouchableOpacity>

// // // // //         <Text style={styles.label}>תיאור גלוי</Text>
// // // // //         <TextInput style={styles.input} placeholder="מה רואים בתמונה?" onChangeText={setDescription} />

// // // // //         {target === 'group' && (
// // // // //           <View style={styles.cryptoSection}>
// // // // //             <Text style={styles.cryptoTitle}>🔐 הגדרות הצפנה סודית</Text>
            
// // // // //             <TextInput 
// // // // //               style={[styles.input, styles.secretInput]} 
// // // // //               placeholder="כתוב כאן את המסר הסודי..." 
// // // // //               value={currentSecretMessage}
// // // // //               onChangeText={setCurrentSecretMessage}
// // // // //             />

// // // // //             {/* כפתורי בחירת מצב */}
// // // // //             <View style={styles.modeContainer}>
// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.modeButton, sendMode === 'individual' && styles.activeMode]} 
// // // // //                 onPress={() => { setSendMode('individual'); setSelectedRecipients({}); }}
// // // // //               >
// // // // //                 <Text style={sendMode === 'individual' ? styles.activeText : styles.inactiveText}>לכל אחד בנפרד</Text>
// // // // //               </TouchableOpacity>
              
// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.modeButton, sendMode === 'group' && styles.activeMode]} 
// // // // //                 onPress={() => setSendMode('group')}
// // // // //               >
// // // // //                 <Text style={sendMode === 'group' ? styles.activeText : styles.inactiveText}>לכל חברי הקבוצה</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             {sendMode === 'group' ? (
// // // // //               <TouchableOpacity style={styles.applyAllBtn} onPress={applyToAll}>
// // // // //                 <Text style={styles.applyAllText}>הצפן לכל {groupMembers.length} החברים ✅</Text>
// // // // //               </TouchableOpacity>
// // // // //             ) : (
// // // // //               <View>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="חפש חבר לשיוך המסר..."
// // // // //                   value={searchQuery}
// // // // //                   onChangeText={handleUserSearch}
// // // // //                 />
// // // // //                 {searchQuery.length > 0 && (
// // // // //                   <View style={styles.dropdown}>
// // // // //                     {filteredMembers.map(m => (
// // // // //                       <TouchableOpacity key={m.username} style={styles.memberItem} onPress={() => addRecipient(m)}>
// // // // //                         <Text style={styles.memberText}>{m.username} (לחץ לשיוך)</Text>
// // // // //                       </TouchableOpacity>
// // // // //                     ))}
// // // // //                   </View>
// // // // //                 )}
// // // // //               </View>
// // // // //             )}

// // // // //             {/* רשימת סיכום */}
// // // // //             {Object.keys(selectedRecipients).length > 0 && (
// // // // //               <View style={styles.summary}>
// // // // //                 <Text style={styles.smallLabel}>רשימת נמענים סודיים ({Object.keys(selectedRecipients).length}):</Text>
// // // // //                 {Object.entries(selectedRecipients).slice(0, 5).map(([name, msg]) => (
// // // // //                   <View key={name} style={styles.badge}>
// // // // //                     <Text style={styles.badgeText}>{name}: {msg}</Text>
// // // // //                     <TouchableOpacity onPress={() => {
// // // // //                       const n = {...selectedRecipients}; delete n[name]; setSelectedRecipients(n);
// // // // //                     }}><Text style={{color:'red'}}>✖</Text></TouchableOpacity>
// // // // //                   </View>
// // // // //                 ))}
// // // // //                 {Object.keys(selectedRecipients).length > 5 && <Text>... ועוד {Object.keys(selectedRecipients).length - 5} חברים</Text>}
// // // // //               </View>
// // // // //             )}
// // // // //           </View>
// // // // //         )}

// // // // //         <TouchableOpacity style={styles.submitButton} onPress={handlePublish} disabled={loading}>
// // // // //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>פרסם עכשיו 🚀</Text>}
// // // // //         </TouchableOpacity>
// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#fff' },
// // // // //   scrollContent: { padding: 20 },
// // // // //   title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
// // // // //   label: { fontWeight: 'bold', marginTop: 10 },
// // // // //   input: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginTop: 5 },
// // // // //   cryptoSection: { marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee', elevation: 3 },
// // // // //   cryptoTitle: { fontSize: 16, fontWeight: 'bold', color: '#075E54', marginBottom: 10 },
// // // // //   secretInput: { borderWidth: 1, borderColor: '#FFCDD2', backgroundColor: '#FFF5F5' },
// // // // //   modeContainer: { flexDirection: 'row', marginTop: 15, marginBottom: 15, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#075E54' },
// // // // //   modeButton: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#fff' },
// // // // //   activeMode: { backgroundColor: '#075E54' },
// // // // //   activeText: { color: '#fff', fontWeight: 'bold' },
// // // // //   inactiveText: { color: '#075E54' },
// // // // //   applyAllBtn: { backgroundColor: '#E8F5E9', padding: 15, borderRadius: 8, alignItems: 'center', borderColor: '#4CAF50' },
// // // // //   applyAllText: { color: '#2E7D32', fontWeight: 'bold' },
// // // // //   dropdown: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, maxHeight: 150, marginTop: 5 },
// // // // //   memberItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
// // // // //   memberText: { fontWeight: 'bold' },
// // // // //   summary: { marginTop: 15 },
// // // // //   smallLabel: { fontSize: 12, color: '#666', marginBottom: 5 },
// // // // //   badge: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F1F8E9', padding: 8, borderRadius: 6, marginBottom: 4 },
// // // // //   badgeText: { fontSize: 13, color: '#1B5E20' },
// // // // //   submitButton: { backgroundColor: '#075E54', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 25 },
// // // // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// // // // //   filePicker: { height: 180, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ccc' },
// // // // //   previewImage: { width: '100%', height: '100%', borderRadius: 12 }
// // // // // });

// // // // // export default CreatePostScreen;
// // // // import React, { useState, useEffect } from 'react';
// // // // import { 
// // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // //   ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
// // // // } from 'react-native';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import * as DocumentPicker from '@react-native-documents/picker';
// // // // import { BASE_URL } from '../api/Constants';

// // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // //   const { target, groupId, userName } = route.params || {};

// // // //   const [loading, setLoading] = useState(false);
// // // //   const [description, setDescription] = useState('');
// // // //   const [file, setFile] = useState<any>(null);

// // // //   // --- States לניהול חברים ומסרים ---
// // // //   const [groupMembers, setGroupMembers] = useState<any[]>([]);
// // // //   const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
// // // //   const [searchQuery, setSearchQuery] = useState('');
  
// // // //   const [sendMode, setSendMode] = useState<'individual' | 'group' | null>(null);
// // // //   const [activeRecipient, setActiveRecipient] = useState<any>(null); 
// // // //   const [currentSecretMessage, setCurrentSecretMessage] = useState('');
// // // //   const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});

// // // //   useEffect(() => {
// // // //     if (target === 'group' && groupId) {
// // // //       fetch(`${BASE_URL}/groups/${groupId}/members`)
// // // //         .then(res => res.json())
// // // //         .then(data => {
// // // //           setGroupMembers(data);
// // // //           setFilteredMembers(data);
// // // //         })
// // // //         .catch(err => console.error(err));
// // // //     }
// // // //   }, [groupId]);

// // // //   const handleUserSearch = (text: string) => {
// // // //     setSearchQuery(text);
// // // //     setFilteredMembers(groupMembers.filter(m => 
// // // //       m.username?.toLowerCase().includes(text.toLowerCase())
// // // //     ));
// // // //   };

// // // //   // --- פונקציית הקסם החדשה ---
// // // //   const saveMessageToRecipient = () => {
// // // //     if (!currentSecretMessage.trim()) return Alert.alert("שגיאה", "נא להזין מסר סודי");
    
// // // //     if (sendMode === 'group') {
// // // //       // כאן אנחנו רצים על כל חברי הקבוצה ונותנים לכולם את אותו מסר
// // // //       const allMessages: { [key: string]: string } = {};
// // // //       groupMembers.forEach(member => {
// // // //         allMessages[member.username] = currentSecretMessage;
// // // //       });
// // // //       setSelectedRecipients(allMessages);
// // // //       Alert.alert("בוצע!", `המסר הוצמד לכל ${groupMembers.length} חברי הקבוצה`);
// // // //     } else {
// // // //       // הצפנה ליחיד
// // // //       setSelectedRecipients(prev => ({ ...prev, [activeRecipient.username]: currentSecretMessage }));
// // // //     }

// // // //     // איפוס לבחירה הבאה
// // // //     setCurrentSecretMessage('');
// // // //     setActiveRecipient(null);
// // // //     setSearchQuery('');
// // // //     setSendMode(null);
// // // //   };

// // // //   const pickFile = async () => {
// // // //     try {
// // // //       const res = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
// // // //       setFile({ uri: res[0].uri, name: res[0].name, type: res[0].type });
// // // //     } catch (e) {}
// // // //   };

// // // //   const handlePublish = async () => {
// // // //     if (!file) return Alert.alert("חסרה תמונה", "יש לבחור תמונה לפני הפרסום");
// // // //     setLoading(true);
// // // //     const formData = new FormData();
// // // //     formData.append('file', { uri: file.uri, type: file.type || 'image/jpeg', name: file.name || 'img.jpg' } as any);
// // // //     formData.append('description', description);
// // // //     formData.append('senderUsername', userName);
// // // //     formData.append('target', target === 'group' ? groupId : 'world');

// // // //     if (Object.keys(selectedRecipients).length > 0) {
// // // //       formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
// // // //     }

// // // //     try {
// // // //       const res = await fetch(`${BASE_URL}/posts/create`, { method: 'POST', body: formData });
// // // //       if (res.ok) navigation.goBack();
// // // //       else Alert.alert("שגיאה", "השרת נכשל בפרסום");
// // // //     } catch (e) { Alert.alert("שגיאת חיבור"); } finally { setLoading(false); }
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
// // // //         <ScrollView contentContainerStyle={styles.scrollContent}>
          
// // // //           <Text style={styles.headerTitle}>פוסט קבוצתי מאובטח</Text>

// // // //           {/* בחירת מדיה */}
// // // //           <TouchableOpacity style={styles.mediaCard} onPress={pickFile}>
// // // //             {file ? (
// // // //               <Image source={{ uri: file.uri }} style={styles.fullImage} />
// // // //             ) : (
// // // //               <View style={styles.uploadPlaceholder}>
// // // //                 <Text style={{fontSize: 50}}>🖼️</Text>
// // // //                 <Text style={styles.uploadText}>לחץ לבחירת תמונה</Text>
// // // //               </View>
// // // //             )}
// // // //           </TouchableOpacity>

// // // //           <TextInput 
// // // //             style={styles.captionInput} 
// // // //             placeholder="תיאור גלוי לכולם..." 
// // // //             multiline
// // // //             onChangeText={setDescription}
// // // //           />

// // // //           {target === 'group' && (
// // // //             <View style={styles.cryptoSection}>
// // // //               <Text style={styles.sectionTitle}>🔒 למי נצפין מסר סודי?</Text>
              
// // // //               {!sendMode && !activeRecipient && (
// // // //                 <View style={styles.modeGrid}>
// // // //                   <TouchableOpacity style={[styles.modeCard, {borderColor: '#38A169', borderWidth: 1}]} onPress={() => setSendMode('group')}>
// // // //                     <Text style={styles.modeEmoji}>📢</Text>
// // // //                     <Text style={styles.modeLabel}>כל הקבוצה</Text>
// // // //                     <Text style={{fontSize: 10, color: '#666'}}>מסר אחד לכולם</Text>
// // // //                   </TouchableOpacity>
// // // //                   <TouchableOpacity style={[styles.modeCard, {borderColor: '#3182CE', borderWidth: 1}]} onPress={() => setSendMode('individual')}>
// // // //                     <Text style={styles.modeEmoji}>👤</Text>
// // // //                     <Text style={styles.modeLabel}>חבר ספציפי</Text>
// // // //                     <Text style={{fontSize: 10, color: '#666'}}>מסר אישי</Text>
// // // //                   </TouchableOpacity>
// // // //                 </View>
// // // //               )}

// // // //               {sendMode === 'individual' && !activeRecipient && (
// // // //                 <View>
// // // //                   <TextInput 
// // // //                     style={styles.searchBar} 
// // // //                     placeholder="חפש חבר מהקבוצה..." 
// // // //                     onChangeText={handleUserSearch}
// // // //                   />
// // // //                   <View style={styles.resultsContainer}>
// // // //                     {filteredMembers.map(m => (
// // // //                       <TouchableOpacity key={m.username} style={styles.userRow} onPress={() => setActiveRecipient(m)}>
// // // //                         <Text style={styles.userNameText}>{m.username}</Text>
// // // //                         <Text style={styles.plusIcon}>בחר 👤</Text>
// // // //                       </TouchableOpacity>
// // // //                     ))}
// // // //                   </View>
// // // //                 </View>
// // // //               )}

// // // //               {(activeRecipient || sendMode === 'group') && (
// // // //                 <View style={styles.messageEditor}>
// // // //                   <Text style={styles.editingFor}>
// // // //                     נמען: <Text style={{fontWeight:'bold', color: '#2D3748'}}>{activeRecipient?.username || `כל חברי הקבוצה (${groupMembers.length})`}</Text>
// // // //                   </Text>
// // // //                   <TextInput 
// // // //                     style={styles.secretInput} 
// // // //                     placeholder="מהו המסר הסודי שיוטמן בתמונה?"
// // // //                     value={currentSecretMessage}
// // // //                     onChangeText={setCurrentSecretMessage}
// // // //                     autoFocus
// // // //                   />
// // // //                   <View style={styles.editorButtons}>
// // // //                     <TouchableOpacity style={styles.cancelBtn} onPress={() => {setSendMode(null); setActiveRecipient(null);}}>
// // // //                       <Text style={{color:'#666'}}>ביטול</Text>
// // // //                     </TouchableOpacity>
// // // //                     <TouchableOpacity style={styles.saveBtn} onPress={saveMessageToRecipient}>
// // // //                       <Text style={{color:'#fff', fontWeight:'bold'}}>אשר והצפן ✅</Text>
// // // //                     </TouchableOpacity>
// // // //                   </View>
// // // //                 </View>
// // // //               )}

// // // //               {/* רשימת סיכום */}
// // // //               {Object.keys(selectedRecipients).length > 0 && (
// // // //                 <View style={styles.summaryBox}>
// // // //                   <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
// // // //                     <Text style={styles.summaryTitle}>נמענים מאושרים:</Text>
// // // //                     <TouchableOpacity onPress={() => setSelectedRecipients({})}>
// // // //                        <Text style={{color: 'red', fontSize: 12}}>נקה הכל</Text>
// // // //                     </TouchableOpacity>
// // // //                   </View>
// // // //                   {Object.entries(selectedRecipients).slice(0, 3).map(([name, msg]) => (
// // // //                     <View key={name} style={styles.summaryRow}>
// // // //                       <Text style={styles.summaryText} numberOfLines={1}>• {name}: {msg}</Text>
// // // //                     </View>
// // // //                   ))}
// // // //                   {Object.keys(selectedRecipients).length > 3 && (
// // // //                     <Text style={{fontSize: 12, color: '#718096', textAlign: 'center', marginTop: 5}}>
// // // //                       ... ועוד {Object.keys(selectedRecipients).length - 3} חברים ברשימה
// // // //                     </Text>
// // // //                   )}
// // // //                 </View>
// // // //               )}
// // // //             </View>
// // // //           )}

// // // //           <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={loading}>
// // // //             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>שלח פוסט לקבוצה 🚀</Text>}
// // // //           </TouchableOpacity>

// // // //         </ScrollView>
// // // //       </KeyboardAvoidingView>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#F0F4F8' },
// // // //   scrollContent: { padding: 20 },
// // // //   headerTitle: { fontSize: 22, fontWeight: '800', color: '#2D3748', textAlign: 'center', marginBottom: 20 },
// // // //   mediaCard: { height: 200, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', elevation: 3, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E0' },
// // // //   fullImage: { width: '100%', height: '100%' },
// // // //   uploadPlaceholder: { alignItems: 'center' },
// // // //   uploadText: { marginTop: 10, color: '#718096', fontWeight: 'bold' },
// // // //   captionInput: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginTop: 15, fontSize: 16, textAlignVertical: 'top', minHeight: 60 },
// // // //   cryptoSection: { marginTop: 20, backgroundColor: '#fff', borderRadius: 20, padding: 15, elevation: 2 },
// // // //   sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748', marginBottom: 15 },
// // // //   modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
// // // //   modeCard: { backgroundColor: '#F7FAFC', width: '48%', padding: 15, borderRadius: 15, alignItems: 'center' },
// // // //   modeEmoji: { fontSize: 25, marginBottom: 5 },
// // // //   modeLabel: { fontWeight: 'bold', color: '#2D3748' },
// // // //   searchBar: { backgroundColor: '#EDF2F7', padding: 12, borderRadius: 10 },
// // // //   resultsContainer: { marginTop: 10, maxHeight: 150 },
// // // //   userRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
// // // //   userNameText: { fontWeight: '600' },
// // // //   plusIcon: { color: '#3182CE', fontSize: 12 },
// // // //   messageEditor: { backgroundColor: '#F0FFF4', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#38A169' },
// // // //   editingFor: { marginBottom: 10, fontSize: 14 },
// // // //   secretInput: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#C6F6D5', fontSize: 16 },
// // // //   editorButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
// // // //   cancelBtn: { padding: 10, marginRight: 10 },
// // // //   saveBtn: { backgroundColor: '#38A169', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
// // // //   summaryBox: { marginTop: 15, backgroundColor: '#F7FAFC', padding: 10, borderRadius: 10 },
// // // //   summaryTitle: { fontSize: 13, fontWeight: 'bold', color: '#4A5568' },
// // // //   summaryRow: { paddingVertical: 3 },
// // // //   summaryText: { fontSize: 12, color: '#4A5568' },
// // // //   publishBtn: { backgroundColor: '#2D3748', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 25, marginBottom: 30 },
// // // //   publishBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // // });

// // // // export default CreatePostScreen;
// // // import React, { useState, useEffect } from 'react';
// // // import { 
// // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // //   ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import * as DocumentPicker from '@react-native-documents/picker';
// // // import { BASE_URL } from '../api/Constants';

// // // const CreatePostScreen = ({ route, navigation }: any) => {
// // //   const { target, groupId, userName } = route.params || {};

// // //   const [loading, setLoading] = useState(false);
// // //   const [description, setDescription] = useState('');
// // //   const [file, setFile] = useState<any>(null);

// // //   const [groupMembers, setGroupMembers] = useState<any[]>([]);
// // //   const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
// // //   const [searchQuery, setSearchQuery] = useState('');
  
// // //   const [sendMode, setSendMode] = useState<'individual' | 'group' | null>(null);
// // //   const [activeRecipient, setActiveRecipient] = useState<any>(null); 
// // //   const [currentSecretMessage, setCurrentSecretMessage] = useState('');
// // //   const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});

// // //   useEffect(() => {
// // //     if (target === 'group' && groupId) {
// // //       fetch(`${BASE_URL}/groups/${groupId}/members`)
// // //         .then(res => res.json())
// // //         .then(data => {
// // //           setGroupMembers(data);
// // //           setFilteredMembers(data);
// // //         })
// // //         .catch(err => console.error(err));
// // //     }
// // //   }, [groupId]);

// // //   // פונקציית סינון: מציגה רק מי שלא נבחר וגם מתאימה לחיפוש
// // //   const updateFilteredList = (text: string, currentSelected: any) => {
// // //     const remaining = groupMembers.filter(m => !currentSelected[m.username]);
// // //     const filtered = remaining.filter(m => 
// // //       m.username?.toLowerCase().includes(text.toLowerCase())
// // //     );
// // //     setFilteredMembers(filtered);
// // //   };

// // //   const handleUserSearch = (text: string) => {
// // //     setSearchQuery(text);
// // //     updateFilteredList(text, selectedRecipients);
// // //   };

// // //   const saveMessageToRecipient = () => {
// // //     if (!currentSecretMessage.trim()) return Alert.alert("שגיאה", "נא להזין מסר");
    
// // //     const newSelected = { ...selectedRecipients };
    
// // //     if (sendMode === 'group') {
// // //       groupMembers.forEach(m => { newSelected[m.username] = currentSecretMessage; });
// // //       setSendMode(null);
// // //     } else {
// // //       newSelected[activeRecipient.username] = currentSecretMessage;
// // //       setActiveRecipient(null); // סוגר את תיבת הטקסט
// // //       setSearchQuery(''); // מאפס חיפוש
// // //     }

// // //     setSelectedRecipients(newSelected);
// // //     setCurrentSecretMessage('');
// // //     // עדכון הרשימה מיד אחרי השמירה כדי שהחבר שנבחר ייעלם מהרשימה
// // //     updateFilteredList('', newSelected);
// // //   };

// // //   const pickFile = async () => {
// // //     try {
// // //       const res = await DocumentPicker.pick({ type: [DocumentPicker.types.images] });
// // //       setFile({ uri: res[0].uri, name: res[0].name, type: res[0].type });
// // //     } catch (e) {}
// // //   };

// // //   const handlePublish = async () => {
// // //     if (!file) return Alert.alert("חסרה תמונה", "בחר תמונה");
// // //     setLoading(true);
// // //     const formData = new FormData();
// // //     formData.append('file', { uri: file.uri, type: file.type || 'image/jpeg', name: file.name || 'img.jpg' } as any);
// // //     formData.append('description', description);
// // //     formData.append('senderUsername', userName);
// // //     formData.append('target', target === 'group' ? groupId : 'world');
// // //     if (Object.keys(selectedRecipients).length > 0) {
// // //       formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
// // //     }
// // //     try {
// // //       const res = await fetch(`${BASE_URL}/posts/create`, { method: 'POST', body: formData });
// // //       if (res.ok) navigation.goBack();
// // //       else Alert.alert("שגיאה בשרת");
// // //     } catch (e) { Alert.alert("שגיאת חיבור"); } finally { setLoading(false); }
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
// // //         <ScrollView contentContainerStyle={styles.scrollContent}>
          
// // //           <Text style={styles.headerTitle}>פוסט חדש</Text>

// // //           <TouchableOpacity style={styles.mediaCard} onPress={pickFile}>
// // //             {file ? <Image source={{ uri: file.uri }} style={styles.fullImage} /> : (
// // //               <Text style={{color: '#718096'}}>📷 לחץ לבחירת תמונה</Text>
// // //             )}
// // //           </TouchableOpacity>

// // //           <TextInput style={styles.captionInput} placeholder="תיאור גלוי..." multiline onChangeText={setDescription} />

// // //           {target === 'group' && (
// // //             <View style={styles.cryptoSection}>
// // //               <Text style={styles.sectionTitle}>🔐 הגדרות הצפנה</Text>
              
// // //               {!sendMode && (
// // //                 <View style={styles.modeGrid}>
// // //                   <TouchableOpacity style={styles.modeCard} onPress={() => setSendMode('group')}>
// // //                     <Text style={styles.modeLabel}>לכל הקבוצה</Text>
// // //                   </TouchableOpacity>
// // //                   <TouchableOpacity style={styles.modeCard} onPress={() => {
// // //                     setSendMode('individual');
// // //                     updateFilteredList('', selectedRecipients);
// // //                   }}>
// // //                     <Text style={styles.modeLabel}>בחירת חברים</Text>
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               )}

// // //               {sendMode === 'individual' && !activeRecipient && (
// // //                 <View>
// // //                   <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 5}}>
// // //                     <TouchableOpacity onPress={() => setSendMode(null)}><Text style={{color:'red'}}>✖ ביטול</Text></TouchableOpacity>
// // //                     <Text style={styles.smallLabel}>בחר חבר להוספת מסר:</Text>
// // //                   </View>
// // //                   <TextInput style={styles.searchBar} placeholder="חפש שם..." onChangeText={handleUserSearch} value={searchQuery} />
// // //                   {filteredMembers.map(m => (
// // //                     <TouchableOpacity key={m.username} style={styles.userRow} onPress={() => setActiveRecipient(m)}>
// // //                       <Text style={styles.userRowText}>👤 {m.username}</Text>
// // //                       <Text style={{color: '#3182CE', fontSize: 12}}>בחר +</Text>
// // //                     </TouchableOpacity>
// // //                   ))}
// // //                   {filteredMembers.length === 0 && <Text style={{textAlign:'center', color:'#999'}}>אין חברים נוספים לבחירה</Text>}
// // //                 </View>
// // //               )}

// // //               {activeRecipient && (
// // //                 <View style={styles.messageEditor}>
// // //                   <Text style={styles.smallLabel}>מסר סודי ל: {activeRecipient.username}</Text>
// // //                   <TextInput style={styles.secretInput} placeholder="כתוב מסר..." multiline value={currentSecretMessage} onChangeText={setCurrentSecretMessage} autoFocus />
// // //                   <View style={styles.editorButtons}>
// // //                     <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveRecipient(null)}><Text>חזור</Text></TouchableOpacity>
// // //                     <TouchableOpacity style={styles.saveBtn} onPress={saveMessageToRecipient}><Text style={{color:'#fff'}}>שמור ✅</Text></TouchableOpacity>
// // //                   </View>
// // //                 </View>
// // //               )}

// // //               {Object.keys(selectedRecipients).length > 0 && (
// // //                 <View style={styles.summaryList}>
// // //                   <Text style={styles.summaryTitle}>נמענים שנבחרו:</Text>
// // //                   {Object.entries(selectedRecipients).map(([name, msg]) => (
// // //                     <View key={name} style={styles.badge}>
// // //                       <TouchableOpacity onPress={() => {
// // //                         const n = {...selectedRecipients}; delete n[name];
// // //                         setSelectedRecipients(n);
// // //                         updateFilteredList(searchQuery, n);
// // //                       }}><Text style={{color:'red'}}>🗑️</Text></TouchableOpacity>
// // //                       <Text style={styles.badgeText}>{name}: {msg}</Text>
// // //                     </View>
// // //                   ))}
// // //                 </View>
// // //               )}
// // //             </View>
// // //           )}

// // //           <TouchableOpacity style={styles.submitButton} onPress={handlePublish} disabled={loading}>
// // //             {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>פרסם פוסט</Text>}
// // //           </TouchableOpacity>
// // //         </ScrollView>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#fff' },
// // //   scrollContent: { padding: 15 },
// // //   headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
// // //   mediaCard: { height: 150, backgroundColor: '#f9f9f9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', marginBottom: 15 },
// // //   fullImage: { width: '100%', height: '100%', borderRadius: 10 },
// // //   captionInput: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, fontSize: 16, textAlign: 'right', marginBottom: 15 },
// // //   cryptoSection: { backgroundColor: '#f0f7ff', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#d0e5ff' },
// // //   sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2b6cb0', marginBottom: 10, textAlign: 'center' },
// // //   modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
// // //   modeCard: { flex: 0.48, backgroundColor: '#fff', padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
// // //   modeLabel: { fontSize: 14, fontWeight: 'bold' },
// // //   smallLabel: { fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
// // //   searchBar: { backgroundColor: '#fff', padding: 8, borderRadius: 8, fontSize: 14, textAlign: 'right', marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
// // //   userRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 4, borderWidth: 1, borderColor: '#eee' },
// // //   userRowText: { fontSize: 14 },
// // //   messageEditor: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#3182ce' },
// // //   secretInput: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, fontSize: 15, textAlign: 'right', minHeight: 60, marginTop: 5 },
// // //   editorButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
// // //   saveBtn: { backgroundColor: '#38a169', padding: 8, borderRadius: 8, flex: 0.5, alignItems: 'center' },
// // //   cancelBtn: { padding: 8, flex: 0.4, alignItems: 'center' },
// // //   summaryList: { marginTop: 15 },
// // //   summaryTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 5 },
// // //   badge: { flexDirection: 'row', backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 5, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#eee' },
// // //   badgeText: { fontSize: 13, textAlign: 'right' },
// // //   submitButton: { backgroundColor: '#2b6cb0', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
// // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // });

// // // export default CreatePostScreen;
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// //   ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import * as DocumentPicker from '@react-native-documents/picker';
// // import { BASE_URL } from '../api/Constants';

// // const CreatePostScreen = ({ route, navigation }: any) => {
// //   const { target, groupId, userName } = route.params || {};

// //   const [loading, setLoading] = useState(false);
// //   const [description, setDescription] = useState('');
// //   const [file, setFile] = useState<any>(null);

// //   const [groupMembers, setGroupMembers] = useState<any[]>([]);
// //   const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
// //   const [searchQuery, setSearchQuery] = useState('');
  
// //   const [sendMode, setSendMode] = useState<'individual' | 'group' | null>(null);
// //   const [activeRecipient, setActiveRecipient] = useState<any>(null); 
// //   const [currentSecretMessage, setCurrentSecretMessage] = useState('');
// //   const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});

// //   useEffect(() => {
// //     if (target === 'group' && groupId) {
// //       fetch(`${BASE_URL}/groups/${groupId}/members`)
// //         .then(res => res.json())
// //         .then(data => {
// //           setGroupMembers(data);
// //           setFilteredMembers(data);
// //         })
// //         .catch(err => console.error(err));
// //     }
// //   }, [groupId]);

// //   const updateFilteredList = (text: string, currentSelected: any) => {
// //     const remaining = groupMembers.filter(m => !currentSelected[m.username]);
// //     const filtered = remaining.filter(m => 
// //       m.username?.toLowerCase().includes(text.toLowerCase())
// //     );
// //     setFilteredMembers(filtered);
// //   };

// //   const handleUserSearch = (text: string) => {
// //     setSearchQuery(text);
// //     updateFilteredList(text, selectedRecipients);
// //   };

// //   const saveMessageToRecipient = () => {
// //     if (!currentSecretMessage.trim()) return Alert.alert("חסר מסר", "כתוב משהו סודי...");
// //     const newSelected = { ...selectedRecipients };
// //     if (sendMode === 'group') {
// //       groupMembers.forEach(m => { newSelected[m.username] = currentSecretMessage; });
// //       setSendMode(null);
// //     } else {
// //       newSelected[activeRecipient.username] = currentSecretMessage;
// //       setActiveRecipient(null);
// //       setSearchQuery('');
// //     }
// //     setSelectedRecipients(newSelected);
// //     setCurrentSecretMessage('');
// //     updateFilteredList('', newSelected);
// //   };

// //   const pickFile = async () => {
// //     try {
// //       const res = await DocumentPicker.pick({
// //         // מאפשר לבחור כל סוג קובץ (PDF, תמונות, וידאו וכו')
// //         type: [DocumentPicker.types.allFiles], 
// //       });
// //       setFile({ uri: res[0].uri, name: res[0].name, type: res[0].type });
// //     } catch (e) {
// //       console.log("User cancelled picker");
// //     }
// //   };

// //   const handlePublish = async () => {
// //     if (!file) return Alert.alert("עצור!", "חובה לבחור קובץ לפני הפרסום");
// //     setLoading(true);
// //     const formData = new FormData();
// //     formData.append('file', { uri: file.uri, type: file.type || 'application/octet-stream', name: file.name || 'file' } as any);
// //     formData.append('description', description);
// //     formData.append('senderUsername', userName);
// //     formData.append('target', target === 'group' ? groupId : 'world');
// //     if (Object.keys(selectedRecipients).length > 0) {
// //       formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
// //     }
// //     try {
// //       const res = await fetch(`${BASE_URL}/posts/create`, { method: 'POST', body: formData });
// //       if (res.ok) navigation.goBack();
// //       else Alert.alert("שגיאה בפרסום");
// //     } catch (e) { Alert.alert("שגיאת חיבור"); } finally { setLoading(false); }
// //   };

// //   const isImage = file?.type?.startsWith('image/');

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
// //         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
// //           <Text style={styles.headerTitle}>יצירת פוסט חכם ✨</Text>

// //           {/* אזור בחירת קובץ מעוצב */}
// //           <TouchableOpacity style={[styles.mediaCard, file && styles.mediaCardActive]} onPress={pickFile}>
// //             {file ? (
// //               isImage ? (
// //                 <Image source={{ uri: file.uri }} style={styles.fullImage} />
// //               ) : (
// //                 <View style={styles.fileInfo}>
// //                   <Text style={styles.fileEmoji}>📄</Text>
// //                   <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
// //                 </View>
// //               )
// //             ) : (
// //               <View style={styles.uploadPlaceholder}>
// //                 <View style={styles.plusCircle}><Text style={styles.plusText}>+</Text></View>
// //                 <Text style={styles.uploadText}>לחץ לבחירת כל סוג קובץ</Text>
// //               </View>
// //             )}
// //           </TouchableOpacity>

// //           <View style={styles.inputContainer}>
// //             <Text style={styles.inputLabel}>מה בראש שלך? ✍️</Text>
// //             <TextInput 
// //               style={styles.captionInput} 
// //               placeholder="כתוב תיאור גלוי לכולם..." 
// //               multiline 
// //               onChangeText={setDescription} 
// //               placeholderTextColor="#A0AEC0"
// //             />
// //           </View>

// //           {target === 'group' && (
// //             <View style={styles.cryptoBox}>
// //               <View style={styles.cryptoHeader}>
// //                 <Text style={styles.cryptoEmoji}>🔐</Text>
// //                 <Text style={styles.cryptoTitle}>הצפנה לפי נמענים</Text>
// //               </View>
              
// //               {!sendMode && (
// //                 <View style={styles.modeGrid}>
// //                   <TouchableOpacity style={[styles.modeCard, styles.groupCard]} onPress={() => setSendMode('group')}>
// //                     <Text style={styles.cardEmoji}>📣</Text>
// //                     <Text style={styles.cardText}>כל הקבוצה</Text>
// //                   </TouchableOpacity>
// //                   <TouchableOpacity style={[styles.modeCard, styles.individualCard]} onPress={() => {
// //                     setSendMode('individual');
// //                     updateFilteredList('', selectedRecipients);
// //                   }}>
// //                     <Text style={styles.cardEmoji}>🎯</Text>
// //                     <Text style={styles.cardText}>בחירת חברים</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               )}

// //               {sendMode === 'individual' && !activeRecipient && (
// //                 <View style={styles.selectionArea}>
// //                   <View style={styles.selectionHeader}>
// //                     <TouchableOpacity onPress={() => setSendMode(null)} style={styles.backBtn}>
// //                       <Text style={styles.backBtnText}>✕ סגור</Text>
// //                     </TouchableOpacity>
// //                     <Text style={styles.searchTitle}>מי יראה את המסר?</Text>
// //                   </View>
// //                   <TextInput style={styles.searchBar} placeholder="חפש חבר ברשימה..." onChangeText={handleUserSearch} value={searchQuery} />
// //                   <ScrollView style={styles.memberList} nestedScrollEnabled>
// //                     {filteredMembers.map(m => (
// //                       <TouchableOpacity key={m.username} style={styles.userRow} onPress={() => setActiveRecipient(m)}>
// //                         <Text style={styles.userRowText}>👤 {m.username}</Text>
// //                         <View style={styles.addCircle}><Text style={styles.addPlus}>+</Text></View>
// //                       </TouchableOpacity>
// //                     ))}
// //                     {filteredMembers.length === 0 && <Text style={styles.emptyText}>אין חברים נוספים...</Text>}
// //                   </ScrollView>
// //                 </View>
// //               )}

// //               {activeRecipient && (
// //                 <View style={styles.editorContainer}>
// //                   <Text style={styles.editorLabel}>מסר סודי עבור: <Text style={{color:'#667EEA'}}>{activeRecipient.username}</Text></Text>
// //                   <TextInput 
// //                     style={styles.secretInput} 
// //                     placeholder="הקלד כאן את המסר שיוצפן..." 
// //                     multiline 
// //                     value={currentSecretMessage} 
// //                     onChangeText={setCurrentSecretMessage} 
// //                     autoFocus 
// //                   />
// //                   <View style={styles.editorActions}>
// //                     <TouchableOpacity style={styles.saveBtn} onPress={saveMessageToRecipient}>
// //                       <Text style={styles.saveBtnText}>שמור ✅</Text>
// //                     </TouchableOpacity>
// //                     <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveRecipient(null)}>
// //                       <Text style={styles.cancelBtnText}>ביטול</Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                 </View>
// //               )}

// //               {/* רשימת סיכום מעוצבת כ-Badges */}
// //               {Object.keys(selectedRecipients).length > 0 && (
// //                 <View style={styles.summarySection}>
// //                   <Text style={styles.summaryHeading}>נמענים מוצפנים:</Text>
// //                   <View style={styles.badgeContainer}>
// //                     {Object.entries(selectedRecipients).map(([name, msg]) => (
// //                       <View key={name} style={styles.badge}>
// //                         <Text style={styles.badgeName}>{name}</Text>
// //                         <TouchableOpacity onPress={() => {
// //                           const n = {...selectedRecipients}; delete n[name];
// //                           setSelectedRecipients(n);
// //                           updateFilteredList(searchQuery, n);
// //                         }} style={styles.deleteBadge}>
// //                           <Text style={styles.deleteBadgeText}>✕</Text>
// //                         </TouchableOpacity>
// //                       </View>
// //                     ))}
// //                   </View>
// //                 </View>
// //               )}
// //             </View>
// //           )}

// //           <TouchableOpacity style={[styles.mainButton, loading && styles.btnDisabled]} onPress={handlePublish} disabled={loading}>
// //             {loading ? <ActivityIndicator color="#fff" /> : (
// //               <Text style={styles.mainButtonText}>שלח פוסט לעולם 🚀</Text>
// //             )}
// //           </TouchableOpacity>

// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F8FAFC' },
// //   scrollContent: { padding: 20 },
// //   headerTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: '#1A202C', marginBottom: 20 },
  
// //   // בחירת מדיה
// //   mediaCard: { height: 160, backgroundColor: '#EDF2F7', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#CBD5E0', borderStyle: 'dashed', marginBottom: 20 },
// //   mediaCardActive: { borderStyle: 'solid', borderColor: '#667EEA', backgroundColor: '#fff' },
// //   fullImage: { width: '100%', height: '100%', borderRadius: 22 },
// //   uploadPlaceholder: { alignItems: 'center' },
// //   plusCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
// //   plusText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
// //   uploadText: { color: '#4A5568', fontWeight: '600', fontSize: 14 },
// //   fileInfo: { alignItems: 'center', padding: 10 },
// //   fileEmoji: { fontSize: 40, marginBottom: 5 },
// //   fileName: { fontSize: 14, color: '#2D3748', fontWeight: 'bold' },

// //   // תיאור
// //   inputContainer: { marginBottom: 20 },
// //   inputLabel: { fontSize: 15, fontWeight: 'bold', color: '#4A5568', marginBottom: 8, textAlign: 'right' },
// //   captionInput: { backgroundColor: '#fff', padding: 15, borderRadius: 16, fontSize: 16, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', color: '#2D3748' },

// //   // תיבת הצפנה
// //   cryptoBox: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 20 },
// //   cryptoHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
// //   cryptoEmoji: { fontSize: 22, marginLeft: 8 },
// //   cryptoTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  
// //   modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
// //   modeCard: { flex: 0.48, padding: 15, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
// //   groupCard: { backgroundColor: '#EBF8FF' },
// //   individualCard: { backgroundColor: '#F0FFF4' },
// //   cardEmoji: { fontSize: 28, marginBottom: 5 },
// //   cardText: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },

// //   // בחירת חברים
// //   selectionArea: { marginTop: 10 },
// //   selectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
// //   backBtnText: { color: '#E53E3E', fontWeight: 'bold' },
// //   backBtn: { backgroundColor: '#FFF5F5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FEB2B2' },
// //   searchTitle: { fontSize: 14, fontWeight: 'bold', color: '#4A5568' },
// //   searchBar: { backgroundColor: '#F7FAFC', padding: 12, borderRadius: 12, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
// //   memberList: { maxHeight: 150 },
// //   userRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 6, alignItems: 'center' },
// //   userRowText: { fontSize: 15, fontWeight: '500' },
// //   addCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center' },
// //   addPlus: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
// //   emptyText: { textAlign: 'center', color: '#A0AEC0', marginTop: 10 },

// //   // עורך מסר
// //   editorContainer: { backgroundColor: '#F7FAFC', padding: 15, borderRadius: 18, borderWidth: 1, borderColor: '#667EEA' },
// //   editorLabel: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
// //   secretInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, textAlign: 'right', minHeight: 80, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0' },
// //   editorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
// //   saveBtn: { backgroundColor: '#667EEA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
// //   saveBtnText: { color: '#fff', fontWeight: 'bold' },
// //   cancelBtn: { padding: 10 },
// //   cancelBtnText: { color: '#718096' },

// //   // באדג'ים של נמענים
// //   summarySection: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#EDF2F7', paddingTop: 15 },
// //   summaryHeading: { fontSize: 14, fontWeight: 'bold', color: '#4A5568', marginBottom: 10, textAlign: 'right' },
// //   badgeContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap' },
// //   badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDF2F7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginLeft: 8, marginBottom: 8 },
// //   badgeName: { fontSize: 13, fontWeight: '600', color: '#2D3748' },
// //   deleteBadge: { marginRight: 6, backgroundColor: '#CBD5E0', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
// //   deleteBadgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },

// //   // כפתור ראשי
// //   mainButton: { backgroundColor: '#667EEA', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 30, shadowColor: '#667EEA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
// //   mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// //   btnDisabled: { backgroundColor: '#A0AEC0', shadowOpacity: 0 }
// // });

// // export default CreatePostScreen;
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, StyleSheet, 
//   ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as DocumentPicker from '@react-native-documents/picker';
// import { BASE_URL } from '../api/Constants';

// const CreatePostScreen = ({ route, navigation }: any) => {
//   const { target, groupId, userName } = route.params || {};

//   const [loading, setLoading] = useState(false);
//   const [description, setDescription] = useState('');
//   const [file, setFile] = useState<any>(null);

//   const [groupMembers, setGroupMembers] = useState<any[]>([]);
//   const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const [sendMode, setSendMode] = useState<'individual' | 'group' | null>(null);
//   const [activeRecipient, setActiveRecipient] = useState<any>(null); 
//   const [currentSecretMessage, setCurrentSecretMessage] = useState('');
//   const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     if (target === 'group' && groupId) {
//       fetch(`${BASE_URL}/groups/${groupId}/members`)
//         .then(res => res.json())
//         .then(data => {
//           setGroupMembers(data);
//           setFilteredMembers(data);
//         })
//         .catch(err => console.error(err));
//     }
//   }, [groupId]);

//   const updateFilteredList = (text: string, currentSelected: any) => {
//     const remaining = groupMembers.filter(m => !currentSelected[m.username]);
//     const filtered = remaining.filter(m => 
//       m.username?.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredMembers(filtered);
//   };

//   const handleUserSearch = (text: string) => {
//     setSearchQuery(text);
//     updateFilteredList(text, selectedRecipients);
//   };

//   const saveMessageToRecipient = () => {
//     if (!currentSecretMessage.trim()) return Alert.alert("חסר מסר", "כתוב משהו סודי...");
    
//     const newSelected = { ...selectedRecipients };
    
//     if (sendMode === 'group') {
//       // לוגיקה שביקשת: רץ על כל חברי הקבוצה ומצפין עבורם את המסר
//       groupMembers.forEach(m => {
//         newSelected[m.username] = currentSecretMessage;
//       });
//       setSendMode(null);
//     } else {
//       // בחירה פרטנית
//       newSelected[activeRecipient.username] = currentSecretMessage;
//       setActiveRecipient(null);
//       setSearchQuery('');
//     }

//     setSelectedRecipients(newSelected);
//     setCurrentSecretMessage('');
//     updateFilteredList('', newSelected);
//   };

//   const pickFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles], 
//       });
//       setFile({ uri: res[0].uri, name: res[0].name, type: res[0].type });
//     } catch (e) {
//       console.log("User cancelled picker");
//     }
//   };

//   const handlePublish = async () => {
//     if (!file) return Alert.alert("עצור!", "חובה לבחור קובץ לפני הפרסום");
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('file', { uri: file.uri, type: file.type || 'application/octet-stream', name: file.name || 'file' } as any);
//     formData.append('description', description);
//     formData.append('senderUsername', userName);
//     formData.append('target', target === 'group' ? groupId : 'world');
//     if (Object.keys(selectedRecipients).length > 0) {
//       formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
//     }
//     try {
//       const res = await fetch(`${BASE_URL}/posts/create`, { method: 'POST', body: formData });
//       if (res.ok) navigation.goBack();
//       else Alert.alert("שגיאה בפרסום");
//     } catch (e) { Alert.alert("שגיאת חיבור"); } finally { setLoading(false); }
//   };

//   const isImage = file?.type?.startsWith('image/');

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
//         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
//           <Text style={styles.headerTitle}>יצירת פוסט חכם ✨</Text>

//           <TouchableOpacity style={[styles.mediaCard, file && styles.mediaCardActive]} onPress={pickFile}>
//             {file ? (
//               isImage ? (
//                 <Image source={{ uri: file.uri }} style={styles.fullImage} />
//               ) : (
//                 <View style={styles.fileInfo}>
//                   <Text style={styles.fileEmoji}>📄</Text>
//                   <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
//                 </View>
//               )
//             ) : (
//               <View style={styles.uploadPlaceholder}>
//                 <View style={styles.plusCircle}><Text style={styles.plusText}>+</Text></View>
//                 <Text style={styles.uploadText}>לחץ לבחירת כל סוג קובץ</Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>מה בראש שלך? ✍️</Text>
//             <TextInput 
//               style={styles.captionInput} 
//               placeholder="כתוב תיאור גלוי לכולם..." 
//               multiline 
//               onChangeText={setDescription} 
//               placeholderTextColor="#A0AEC0"
//             />
//           </View>

//           {target === 'group' && (
//             <View style={styles.cryptoBox}>
//               <View style={styles.cryptoHeader}>
//                 <Text style={styles.cryptoEmoji}>🔐</Text>
//                 <Text style={styles.cryptoTitle}>הצפנה לפי נמענים</Text>
//               </View>
              
//               {!sendMode && (
//                 <View style={styles.modeGrid}>
//                   <TouchableOpacity style={[styles.modeCard, styles.groupCard]} onPress={() => setSendMode('group')}>
//                     <Text style={styles.cardEmoji}>📣</Text>
//                     <Text style={styles.cardText}>כל הקבוצה</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.modeCard, styles.individualCard]} onPress={() => {
//                     setSendMode('individual');
//                     updateFilteredList('', selectedRecipients);
//                   }}>
//                     <Text style={styles.cardEmoji}>🎯</Text>
//                     <Text style={styles.cardText}>בחירת חברים</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               {sendMode === 'individual' && !activeRecipient && (
//                 <View style={styles.selectionArea}>
//                   <View style={styles.selectionHeader}>
//                     <TouchableOpacity onPress={() => setSendMode(null)} style={styles.backBtn}>
//                       <Text style={styles.backBtnText}>✕ סגור</Text>
//                     </TouchableOpacity>
//                     <Text style={styles.searchTitle}>מי יראה את המסר?</Text>
//                   </View>
//                   <TextInput style={styles.searchBar} placeholder="חפש חבר ברשימה..." onChangeText={handleUserSearch} value={searchQuery} />
//                   <ScrollView style={styles.memberList} nestedScrollEnabled>
//                     {filteredMembers.map(m => (
//                       <TouchableOpacity key={m.username} style={styles.userRow} onPress={() => setActiveRecipient(m)}>
//                         <Text style={styles.userRowText}>👤 {m.username}</Text>
//                         <View style={styles.addCircle}><Text style={styles.addPlus}>+</Text></View>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                 </View>
//               )}

//               {/* הלוגיקה החדשה: החלונית שביקשת שנפתחת גם עבור "כל הקבוצה" וגם עבור בודד */}
//               {(activeRecipient || sendMode === 'group') && (
//                 <View style={styles.editorContainer}>
//                   <Text style={styles.editorLabel}>
//                     {sendMode === 'group' ? "מסר עבור כל חברי הקבוצה:" : `מסר עבור: ${activeRecipient?.username}`}
//                   </Text>
//                   <TextInput 
//                     style={styles.secretInput} 
//                     placeholder="הקלד כאן את המסר שיוצפן..." 
//                     multiline 
//                     value={currentSecretMessage} 
//                     onChangeText={setCurrentSecretMessage} 
//                     autoFocus 
//                   />
//                   <View style={styles.editorActions}>
//                     <TouchableOpacity style={styles.saveBtn} onPress={saveMessageToRecipient}>
//                       <Text style={styles.saveBtnText}>{sendMode === 'group' ? "הצפן לכולם 🔐" : "שמור ✅"}</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.cancelBtn} onPress={() => { setActiveRecipient(null); if(sendMode === 'group') setSendMode(null); }}>
//                       <Text style={styles.cancelBtnText}>ביטול</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}

//               {Object.keys(selectedRecipients).length > 0 && (
//                 <View style={styles.summarySection}>
//                   <Text style={styles.summaryHeading}>נמענים מוצפנים ({Object.keys(selectedRecipients).length}):</Text>
//                   <View style={styles.badgeContainer}>
//                     {Object.entries(selectedRecipients).map(([name, msg]) => (
//                       <View key={name} style={styles.badge}>
//                         <Text style={styles.badgeName}>{name}</Text>
//                         <TouchableOpacity onPress={() => {
//                           const n = {...selectedRecipients}; delete n[name];
//                           setSelectedRecipients(n);
//                           updateFilteredList(searchQuery, n);
//                         }} style={styles.deleteBadge}>
//                           <Text style={styles.deleteBadgeText}>✕</Text>
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//               )}
//             </View>
//           )}

//           <TouchableOpacity style={[styles.mainButton, loading && styles.btnDisabled]} onPress={handlePublish} disabled={loading}>
//             {loading ? <ActivityIndicator color="#fff" /> : (
//               <Text style={styles.mainButtonText}>שלח פוסט לעולם 🚀</Text>
//             )}
//           </TouchableOpacity>

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   scrollContent: { padding: 20 },
//   headerTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: '#1A202C', marginBottom: 20 },
//   mediaCard: { height: 160, backgroundColor: '#EDF2F7', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#CBD5E0', borderStyle: 'dashed', marginBottom: 20 },
//   mediaCardActive: { borderStyle: 'solid', borderColor: '#667EEA', backgroundColor: '#fff' },
//   fullImage: { width: '100%', height: '100%', borderRadius: 22 },
//   uploadPlaceholder: { alignItems: 'center' },
//   plusCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
//   plusText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
//   uploadText: { color: '#4A5568', fontWeight: '600', fontSize: 14 },
//   fileInfo: { alignItems: 'center', padding: 10 },
//   fileEmoji: { fontSize: 40, marginBottom: 5 },
//   fileName: { fontSize: 14, color: '#2D3748', fontWeight: 'bold' },
//   inputContainer: { marginBottom: 20 },
//   inputLabel: { fontSize: 15, fontWeight: 'bold', color: '#4A5568', marginBottom: 8, textAlign: 'right' },
//   captionInput: { backgroundColor: '#fff', padding: 15, borderRadius: 16, fontSize: 16, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', color: '#2D3748' },
//   cryptoBox: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 20 },
//   cryptoHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
//   cryptoEmoji: { fontSize: 22, marginLeft: 8 },
//   cryptoTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
//   modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
//   modeCard: { flex: 0.48, padding: 15, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
//   groupCard: { backgroundColor: '#EBF8FF' },
//   individualCard: { backgroundColor: '#F0FFF4' },
//   cardEmoji: { fontSize: 28, marginBottom: 5 },
//   cardText: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
//   selectionArea: { marginTop: 10 },
//   selectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   backBtnText: { color: '#E53E3E', fontWeight: 'bold' },
//   backBtn: { backgroundColor: '#FFF5F5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FEB2B2' },
//   searchTitle: { fontSize: 14, fontWeight: 'bold', color: '#4A5558' },
//   searchBar: { backgroundColor: '#F7FAFC', padding: 12, borderRadius: 12, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
//   memberList: { maxHeight: 150 },
//   userRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 6, alignItems: 'center' },
//   userRowText: { fontSize: 15, fontWeight: '500' },
//   addCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center' },
//   addPlus: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   editorContainer: { backgroundColor: '#F7FAFC', padding: 15, borderRadius: 18, borderWidth: 1, borderColor: '#667EEA' },
//   editorLabel: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
//   secretInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, textAlign: 'right', minHeight: 80, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0' },
//   editorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
//   saveBtn: { backgroundColor: '#667EEA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
//   saveBtnText: { color: '#fff', fontWeight: 'bold' },
//   cancelBtn: { padding: 10 },
//   cancelBtnText: { color: '#718096' },
//   summarySection: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#EDF2F7', paddingTop: 15 },
//   summaryHeading: { fontSize: 14, fontWeight: 'bold', color: '#4A5568', marginBottom: 10, textAlign: 'right' },
//   badgeContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap' },
//   badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDF2F7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginLeft: 8, marginBottom: 8 },
//   badgeName: { fontSize: 13, fontWeight: '600', color: '#2D3748' },
//   deleteBadge: { marginRight: 6, backgroundColor: '#CBD5E0', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
//   deleteBadgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
//   mainButton: { backgroundColor: '#667EEA', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 30, shadowColor: '#667EEA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
//   mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   btnDisabled: { backgroundColor: '#A0AEC0', shadowOpacity: 0 }
// });

// export default CreatePostScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from '@react-native-documents/picker';
import { BASE_URL } from '../api/Constants';

const CreatePostScreen = ({ route, navigation }: any) => {
  const { target, groupId, userName } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<any>(null);

  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [sendMode, setSendMode] = useState<'individual' | 'group' | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<any>(null); 
  const [currentSecretMessage, setCurrentSecretMessage] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (target === 'group' && groupId) {
      fetch(`${BASE_URL}/groups/${groupId}/members`)
        .then(res => res.json())
        .then(data => {
          setGroupMembers(data);
          setFilteredMembers(data);
        })
        .catch(err => console.error(err));
    }
  }, [groupId]);

  const updateFilteredList = (text: string, currentSelected: any) => {
    const remaining = groupMembers.filter(m => !currentSelected[m.username]);
    const filtered = remaining.filter(m => 
      m.username?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleUserSearch = (text: string) => {
    setSearchQuery(text);
    updateFilteredList(text, selectedRecipients);
  };

  const saveMessageToRecipient = () => {
    if (!currentSecretMessage.trim()) return Alert.alert("חסר מסר", "כתוב משהו סודי...");
    
    const newSelected = { ...selectedRecipients };
    
    if (sendMode === 'group') {
      groupMembers.forEach(m => {
        newSelected[m.username] = currentSecretMessage;
      });
      setSendMode(null);
    } else {
      newSelected[activeRecipient.username] = currentSecretMessage;
      setActiveRecipient(null);
      setSearchQuery('');
    }

    setSelectedRecipients(newSelected);
    setCurrentSecretMessage('');
    updateFilteredList('', newSelected);
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], 
      });
      setFile({ uri: res[0].uri, name: res[0].name, type: res[0].type });
    } catch (e) {
      console.log("User cancelled picker");
    }
  };

  const handlePublish = async () => {
    if (!file) return Alert.alert("עצור!", "חובה לבחור קובץ לפני הפרסום");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', { uri: file.uri, type: file.type || 'application/octet-stream', name: file.name || 'file' } as any);
    formData.append('description', description);
    formData.append('senderUsername', userName);
    formData.append('target', target === 'group' ? groupId : 'world');
    if (Object.keys(selectedRecipients).length > 0) {
      formData.append('userMessagesJson', JSON.stringify(selectedRecipients));
    }
    try {
      const res = await fetch(`${BASE_URL}/posts/create`, { method: 'POST', body: formData });
      if (res.ok) navigation.goBack();
      else Alert.alert("שגיאה בפרסום");
    } catch (e) { Alert.alert("שגיאת חיבור"); } finally { setLoading(false); }
  };

  const isImage = file?.type?.startsWith('image/');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.headerTitle}>יצירת פוסט חכם ✨</Text>

          <TouchableOpacity style={[styles.mediaCard, file && styles.mediaCardActive]} onPress={pickFile}>
            {file ? (
              isImage ? (
                <Image source={{ uri: file.uri }} style={styles.fullImage} />
              ) : (
                <View style={styles.fileInfo}>
                  <Text style={styles.fileEmoji}>📄</Text>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                </View>
              )
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.plusCircle}><Text style={styles.plusText}>+</Text></View>
                <Text style={styles.uploadText}>לחץ לבחירת כל סוג קובץ</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>מה בראש שלך? ✍️</Text>
            <TextInput 
              style={styles.captionInput} 
              placeholder="כתוב תיאור גלוי לכולם..." 
              multiline 
              onChangeText={setDescription} 
              placeholderTextColor="#A0AEC0"
            />
          </View>

          {target === 'group' && (
            <View style={styles.cryptoBox}>
              <View style={styles.cryptoHeader}>
                <Text style={styles.cryptoEmoji}>🔐</Text>
                <Text style={styles.cryptoTitle}>הצפנה לפי נמענים</Text>
              </View>
              
              {!sendMode && (
                <View style={styles.modeGrid}>
                  <TouchableOpacity style={[styles.modeCard, styles.groupCard]} onPress={() => setSendMode('group')}>
                    <Text style={styles.cardEmoji}>📣</Text>
                    <Text style={styles.cardText}>כל הקבוצה</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modeCard, styles.individualCard]} onPress={() => {
                    setSendMode('individual');
                    updateFilteredList('', selectedRecipients);
                  }}>
                    <Text style={styles.cardEmoji}>🎯</Text>
                    <Text style={styles.cardText}>בחירת חברים</Text>
                  </TouchableOpacity>
                </View>
              )}

              {sendMode === 'individual' && !activeRecipient && (
                <View style={styles.selectionArea}>
                  <View style={styles.selectionHeader}>
                    <TouchableOpacity onPress={() => setSendMode(null)} style={styles.backBtn}>
                      <Text style={styles.backBtnText}>✕ סגור</Text>
                    </TouchableOpacity>
                    <Text style={styles.searchTitle}>מי יראה את המסר?</Text>
                  </View>
                  <TextInput style={styles.searchBar} placeholder="חפש חבר ברשימה..." onChangeText={handleUserSearch} value={searchQuery} />
                  <ScrollView style={styles.memberList} nestedScrollEnabled>
                    {filteredMembers.map(m => (
                      <TouchableOpacity key={m.username} style={styles.userRow} onPress={() => setActiveRecipient(m)}>
                        <Text style={styles.userRowText}>👤 {m.username}</Text>
                        <View style={styles.addCircle}><Text style={styles.addPlus}>+</Text></View>
                      </TouchableOpacity>
                    ))}
                    {/* הודעה כאשר כל חברי הקבוצה נבחרו */}
                    {filteredMembers.length === 0 && groupMembers.length > 0 && (
                      <View style={styles.allSelectedBox}>
                        <Text style={styles.allSelectedText}>כל חברי הקבוצה נבחרו! ✅</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}

              {(activeRecipient || sendMode === 'group') && (
                <View style={styles.editorContainer}>
                  <Text style={styles.editorLabel}>
                    {sendMode === 'group' ? "📝 מסר סודי עבור כל הקבוצה:" : `🔐 מסר סודי עבור: ${activeRecipient?.username}`}
                  </Text>
                  <TextInput 
                    style={styles.secretInput} 
                    placeholder="הקלד כאן את המסר שיוצפן..." 
                    multiline 
                    value={currentSecretMessage} 
                    onChangeText={setCurrentSecretMessage} 
                    autoFocus 
                  />
                  <View style={styles.editorActions}>
                    <TouchableOpacity style={styles.saveBtn} onPress={saveMessageToRecipient}>
                      <Text style={styles.saveBtnText}>{sendMode === 'group' ? "הצפן לכולם 🔐" : "שמור ✅"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtnRed} onPress={() => { setActiveRecipient(null); if(sendMode === 'group') setSendMode(null); }}>
                      <Text style={styles.cancelBtnTextRed}>ביטול ✖</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* תצוגת רשימה סופית - שורה מתחת שורה */}
              {Object.keys(selectedRecipients).length > 0 && (
                <View style={styles.finalListContainer}>
                  <Text style={styles.finalListHeading}>נמענים ומסרים שהוצפנו:</Text>
                  {Object.entries(selectedRecipients).map(([name, msg]) => (
                    <View key={name} style={styles.finalUserRow}>
                      <TouchableOpacity 
                        onPress={() => {
                          const n = {...selectedRecipients}; delete n[name];
                          setSelectedRecipients(n);
                          updateFilteredList(searchQuery, n);
                        }} 
                        style={styles.removeUserBtn}
                      >
                        <Text style={styles.removeUserIcon}>🗑️</Text>
                      </TouchableOpacity>
                      
                      <View style={styles.finalUserInfo}>
                        <Text style={styles.finalUserName}>@{name}</Text>
                        <Text style={styles.finalUserMsg} numberOfLines={1}>{msg}</Text>
                      </View>
                      
                      <View style={styles.statusIndicator} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={[styles.mainButton, loading && styles.btnDisabled]} onPress={handlePublish} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.mainButtonText}>שלח פוסט לעולם 🚀</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: '#1A202C', marginBottom: 20 },
  mediaCard: { height: 160, backgroundColor: '#EDF2F7', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#CBD5E0', borderStyle: 'dashed', marginBottom: 20 },
  mediaCardActive: { borderStyle: 'solid', borderColor: '#667EEA', backgroundColor: '#fff' },
  fullImage: { width: '100%', height: '100%', borderRadius: 22 },
  uploadPlaceholder: { alignItems: 'center' },
  plusCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  plusText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  uploadText: { color: '#4A5568', fontWeight: '600', fontSize: 14 },
  fileInfo: { alignItems: 'center', padding: 10 },
  fileEmoji: { fontSize: 40, marginBottom: 5 },
  fileName: { fontSize: 14, color: '#2D3748', fontWeight: 'bold' },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 15, fontWeight: 'bold', color: '#4A5568', marginBottom: 8, textAlign: 'right' },
  captionInput: { backgroundColor: '#fff', padding: 15, borderRadius: 16, fontSize: 16, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', color: '#2D3748' },
  cryptoBox: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 20 },
  cryptoHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
  cryptoEmoji: { fontSize: 22, marginLeft: 8 },
  cryptoTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  modeGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  modeCard: { flex: 0.48, padding: 15, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  groupCard: { backgroundColor: '#EBF8FF' },
  individualCard: { backgroundColor: '#F0FFF4' },
  cardEmoji: { fontSize: 28, marginBottom: 5 },
  cardText: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  selectionArea: { marginTop: 10 },
  selectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  backBtnText: { color: '#E53E3E', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#FFF5F5', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FEB2B2' },
  searchTitle: { fontSize: 14, fontWeight: 'bold', color: '#4A5568' },
  searchBar: { backgroundColor: '#F7FAFC', padding: 12, borderRadius: 12, textAlign: 'right', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  memberList: { maxHeight: 150 },
  userRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 6, alignItems: 'center' },
  userRowText: { fontSize: 15, fontWeight: '500' },
  addCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#667EEA', justifyContent: 'center', alignItems: 'center' },
  addPlus: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  allSelectedBox: { padding: 20, alignItems: 'center' },
  allSelectedText: { color: '#38A169', fontWeight: 'bold', fontSize: 15 },

  editorContainer: { backgroundColor: '#F7FAFC', padding: 15, borderRadius: 18, borderWidth: 1, borderColor: '#667EEA' },
  editorLabel: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 10, color: '#2D3748' },
  secretInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, textAlign: 'right', minHeight: 80, fontSize: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  editorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  saveBtn: { backgroundColor: '#667EEA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  
  cancelBtnRed: { padding: 10, backgroundColor: '#FFF5F5', borderRadius: 10, borderWidth: 1, borderColor: '#FEB2B2' },
  cancelBtnTextRed: { color: '#C53030', fontWeight: 'bold' },

  // רשימה סופית מעוצבת
  finalListContainer: { marginTop: 25, borderTopWidth: 1, borderTopColor: '#EDF2F7', paddingTop: 15 },
  finalListHeading: { fontSize: 14, fontWeight: 'bold', color: '#4A5568', marginBottom: 12, textAlign: 'right' },
  finalUserRow: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 8, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  removeUserBtn: { padding: 8, backgroundColor: '#FFF5F5', borderRadius: 10, marginLeft: 12 },
  removeUserIcon: { fontSize: 14 },
  finalUserInfo: { flex: 1, alignItems: 'flex-end' },
  finalUserName: { fontSize: 14, fontWeight: 'bold', color: '#2D3748' },
  finalUserMsg: { fontSize: 12, color: '#718096', marginTop: 2 },
  statusIndicator: { width: 4, height: 25, backgroundColor: '#667EEA', borderRadius: 2, marginRight: 10 },

  mainButton: { backgroundColor: '#667EEA', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 30, shadowColor: '#667EEA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  mainButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  btnDisabled: { backgroundColor: '#A0AEC0', shadowOpacity: 0 }
});

export default CreatePostScreen;