// // // // // // import React, { useState } from 'react';
// // // // // // import { 
// // // // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // // // //   ScrollView, Alert, ActivityIndicator 
// // // // // // } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import { Picker } from '@react-native-picker/picker';
// // // // // // import * as DocumentPicker from '@react-native-documents/picker';
// // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // // // //   // מקבלים את היעד מה-MenuScreen
// // // // // //   const { target } = route.params || { target: 'world' };

// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [description, setDescription] = useState('');
// // // // // //   const [secretMessage, setSecretMessage] = useState('');
// // // // // //   const [file, setFile] = useState<any>(null); // שונה מ-DocumentPickerResponse ל-any בגלל המעבר ל-Expo
// // // // // //   const [selectedGroupId, setSelectedGroupId] = useState('');

// // // // // //   const myGroups = [
// // // // // //     { id: '1', name: 'המשפחה שלי' },
// // // // // //     { id: '2', name: 'חברי לימודים' },
// // // // // //     { id: '3', name: 'צוות פיתוח' },
// // // // // //   ];

// // // // // //   const pickFile = async () => {
// // // // // //   try {
// // // // // //     const results = await DocumentPicker.pick({
// // // // // //       type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.audio],
// // // // // //     });

// // // // // //     const selectedFile = results[0];
// // // // // //     setFile({
// // // // // //       uri: selectedFile.uri,
// // // // // //       name: selectedFile.name,
// // // // // //       type: selectedFile.type,
// // // // // //       size: selectedFile.size
// // // // // //     });

// // // // // //   }  catch (err: any) {
// // // // // //     // במקום isCancel, אנחנו בודקים את קוד השגיאה ישירות
// // // // // //     if (err?.code === 'DOCUMENT_PICKER_CANCELED' || err?.message?.includes('cancel')) {
// // // // // //       console.log('המשתמש ביטל את הבחירה');
// // // // // //     } else {
// // // // // //       console.error("שגיאה בבחירת קובץ:", err);
// // // // // //       Alert.alert("שגיאה", "נכשלה בחירת הקובץ");
// // // // // //     }
// // // // // //   }
// // // // // // };
// // // // // //   const handlePublish = async () => {
// // // // // //     if (!file) {
// // // // // //       return Alert.alert("שגיאה", "אנא בחר קובץ להעלאה");
// // // // // //     }
// // // // // //     if (target === 'group' && !selectedGroupId) {
// // // // // //       return Alert.alert("שגיאה", "אנא בחר קבוצת יעד");
// // // // // //     }

// // // // // //     setLoading(true);

// // // // // //     const formData = new FormData();
// // // // // //     formData.append('file', {
// // // // // //       uri: file.uri,
// // // // // //       type: file.type,
// // // // // //       name: file.name,
// // // // // //     } as any);

// // // // // //     formData.append('description', description);
// // // // // //     formData.append('secretMessage', secretMessage);
// // // // // //     formData.append('target', target === 'world' ? 'world' : selectedGroupId);

// // // // // //     try {
// // // // // //       const response = await fetch('http://10.0.2.2:8080/api/posts/create', {
// // // // // //         method: 'POST',
// // // // // //         body: formData,
// // // // // //         headers: {
// // // // // //           'Accept': 'application/json',
// // // // // //         },
// // // // // //       });

// // // // // //       if (response.ok) {
// // // // // //         Alert.alert("הצלחה!", "הפוסט נשמר בשרת");
// // // // // //         navigation.goBack();
// // // // // //       } else {
// // // // // //         const errorData = await response.text();
// // // // // //         console.log("Server Error:", errorData);
// // // // // //         Alert.alert("שגיאה", "השרת נכשל בעיבוד הפוסט");
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error("Fetch Error:", error);
// // // // // //       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. וודא ש-Java רץ");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // // // //         <Text style={styles.title}>יצירת פוסט חדש ({target === 'world' ? 'ציבורי' : 'לקבוצה'})</Text>

// // // // // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // // // // //           <Text style={styles.filePickerText}>
// // // // // //             {file ? `📎 קובץ נבחר: ${file.name}` : "📁 לחץ לבחירת תמונה / וידאו / שמע"}
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>

// // // // // //         <Text style={styles.label}>תיאור גלוי (יוצג לכולם):</Text>
// // // // // //         <TextInput
// // // // // //           style={styles.input}
// // // // // //           placeholder="מה רואים בקובץ?"
// // // // // //           multiline
// // // // // //           onChangeText={setDescription}
// // // // // //         />

// // // // // //         <Text style={[styles.label, { color: '#D32F2F' }]}>🤐 מסר סודי (יוטמע בתוך הקובץ):</Text>
// // // // // //         <TextInput
// // // // // //           style={[styles.input, styles.secretInput]}
// // // // // //           placeholder="הכנס את המסר שרק חברי הקבוצה יראו..."
// // // // // //           onChangeText={setSecretMessage}
// // // // // //         />

// // // // // //         {target === 'group' && (
// // // // // //           <View style={styles.pickerSection}>
// // // // // //             <Text style={styles.label}>בחר קבוצה:</Text>
// // // // // //             <View style={styles.pickerWrapper}>
// // // // // //               <Picker
// // // // // //                 selectedValue={selectedGroupId}
// // // // // //                 onValueChange={(value) => setSelectedGroupId(value)}
// // // // // //               >
// // // // // //                 <Picker.Item label="בחר קבוצה מהרשימה..." value="" />
// // // // // //                 {myGroups.map(group => (
// // // // // //                   <Picker.Item key={group.id} label={group.name} value={group.id} />
// // // // // //                 ))}
// // // // // //               </Picker>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}

// // // // // //         <TouchableOpacity 
// // // // // //           style={styles.submitButton} 
// // // // // //           onPress={handlePublish}
// // // // // //           disabled={loading}
// // // // // //         >
// // // // // //           {loading ? (
// // // // // //             <ActivityIndicator color="#fff" />
// // // // // //           ) : (
// // // // // //             <Text style={styles.submitButtonText}>בצע סטגנוגרפיה ופרסם 🚀</Text>
// // // // // //           )}
// // // // // //         </TouchableOpacity>
// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#fff' },
// // // // // //   scrollContent: { padding: 20 },
// // // // // //   title: { fontSize: 22, fontWeight: 'bold', color: '#6200EE', textAlign: 'center', marginBottom: 20 },
// // // // // //   label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
// // // // // //   filePicker: { 
// // // // // //     height: 120, 
// // // // // //     borderWidth: 2, 
// // // // // //     borderColor: '#6200EE', 
// // // // // //     borderStyle: 'dashed', 
// // // // // //     borderRadius: 12, 
// // // // // //     justifyContent: 'center', 
// // // // // //     alignItems: 'center', 
// // // // // //     marginBottom: 20,
// // // // // //     backgroundColor: '#F3E5F5'
// // // // // //   },
// // // // // //   filePickerText: { color: '#6200EE', fontWeight: 'bold', textAlign: 'center', padding: 10 },
// // // // // //   input: { 
// // // // // //     backgroundColor: '#F5F5F5', 
// // // // // //     borderRadius: 8, 
// // // // // //     padding: 12, 
// // // // // //     textAlign: 'right', 
// // // // // //     marginBottom: 20,
// // // // // //     fontSize: 16,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#E0E0E0'
// // // // // //   },
// // // // // //   secretInput: { borderColor: '#FFCDD2', borderLeftWidth: 5 },
// // // // // //   pickerSection: { marginBottom: 20 },
// // // // // //   pickerWrapper: { backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
// // // // // //   submitButton: { 
// // // // // //     backgroundColor: '#6200EE', 
// // // // // //     padding: 18, 
// // // // // //     borderRadius: 12, 
// // // // // //     alignItems: 'center', 
// // // // // //     marginTop: 10,
// // // // // //     elevation: 4
// // // // // //   },
// // // // // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // // // // });

// // // // // // export default CreatePostScreen;
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { 
// // // // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // // // //   ScrollView, Alert, ActivityIndicator, Image 
// // // // // // } from 'react-native';
// // // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // // import { Picker } from '@react-native-picker/picker';

// // // // // //  import * as DocumentPicker from '@react-native-documents/picker';
// // // // // // // import * as DocumentPicker from 'expo-document-picker'; // מומלץ לאקספו
// // // // // // import { BASE_URL } from '../api/Constants';

// // // // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // // // //   const { userName, target } = route.params || { userName: 'אורח', target: 'world' };

// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [description, setDescription] = useState('');
// // // // // //   const [secretMessage, setSecretMessage] = useState('');
// // // // // //   const [file, setFile] = useState<any>(null);
// // // // // //   const [selectedGroupId, setSelectedGroupId] = useState('');
// // // // // //   const [myGroups, setMyGroups] = useState<any[]>([]);

// // // // // //   // 1. שליפת הקבוצות האמיתיות של המשתמש מהשרת
// // // // // //   useEffect(() => {
// // // // // //     const fetchGroups = async () => {
// // // // // //       try {
// // // // // //         const response = await fetch(`${BASE_URL}/groups/my-groups/${userName}`);
// // // // // //         const data = await response.json();
// // // // // //         setMyGroups(data);
// // // // // //       } catch (e) {
// // // // // //         console.error("Failed to fetch groups", e);
// // // // // //       }
// // // // // //     };
// // // // // //     if (target === 'group') fetchGroups();
// // // // // //   }, []);

// // // // // //   const pickFile = async () => {
// // // // // //   try {
// // // // // //     const results = await DocumentPicker.pick({
// // // // // //       // שימוש ב-types מתוך הספרייה
// // // // // //       type: [
// // // // // //         DocumentPicker.types.images,
// // // // // //         DocumentPicker.types.video,
// // // // // //         DocumentPicker.types.audio,
// // // // // //       ],
// // // // // //     });

// // // // // //     const res = results[0];
// // // // // //     setFile({
// // // // // //       uri: res.uri,
// // // // // //       type: res.type,
// // // // // //       name: res.name,
// // // // // //     });

// // // // // //   } catch (err: any) {
// // // // // //     // התיקון ל"אדום": בודקים אם הקוד הוא 'PICKER_CANCELLED'
// // // // // //     if (err?.code === 'PICKER_CANCELLED') {
// // // // // //       console.log('המשתמש ביטל את הבחירה');
// // // // // //     } else {
// // // // // //       console.error('שגיאה בבחירת קובץ:', err);
// // // // // //       Alert.alert("שגיאה", "נכשלה בחירת הקובץ");
// // // // // //     }
// // // // // //   }
// // // // // // };

// // // // // //   const handlePublish = async () => {
// // // // // //     if (!file) return Alert.alert("שגיאה", "אנא בחר קובץ");
// // // // // //     if (target === 'group' && !selectedGroupId) return Alert.alert("שגיאה", "בחר קבוצה");

// // // // // //     setLoading(true);
// // // // // //     const formData = new FormData();
// // // // // //     formData.append('file', {
// // // // // //       uri: file.uri,
// // // // // //       type: file.type,
// // // // // //       name: file.name,
// // // // // //     } as any);

// // // // // //     formData.append('senderUsername', userName);
// // // // // //     formData.append('description', description);
// // // // // //     formData.append('secretMessage', secretMessage);
// // // // // //     formData.append('groupId', target === 'world' ? 'world' : selectedGroupId);

// // // // // //     try {
// // // // // //       const response = await fetch(`${BASE_URL}/posts/create`, {
// // // // // //         method: 'POST',
// // // // // //         body: formData,
// // // // // //         headers: { 'Accept': 'application/json' },
// // // // // //       });

// // // // // //       if (response.ok) {
// // // // // //         Alert.alert("הצלחה!", "הפוסט פורסם בקבוצה 🚀");
// // // // // //         navigation.goBack();
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       Alert.alert("שגיאה", "החיבור לשרת נכשל");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // // // //         <Text style={styles.title}>פרסום פוסט חדש</Text>

// // // // // //         {/* --- תצוגה מקדימה של הקובץ --- */}
// // // // // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // // // // //           {file && file.type.includes('image') ? (
// // // // // //             <Image source={{ uri: file.uri }} style={styles.previewImage} />
// // // // // //           ) : file ? (
// // // // // //             <View style={styles.fileIconContainer}>
// // // // // //                <Text style={{fontSize: 40}}>📄</Text>
// // // // // //                <Text style={styles.filePickerText}>{file.name}</Text>
// // // // // //             </View>
// // // // // //           ) : (
// // // // // //             <Text style={styles.filePickerText}>📁 לחץ לבחירת מדיה</Text>
// // // // // //           )}
// // // // // //         </TouchableOpacity>

// // // // // //         {/* בחירת קבוצה רק אם המשתמש ביקש לשלוח לקבוצה */}
// // // // // //         {target === 'group' && (
// // // // // //           <View style={styles.pickerSection}>
// // // // // //             <Text style={styles.label}>בחר קבוצה מהרשימה שלי:</Text>
// // // // // //             <View style={styles.pickerWrapper}>
// // // // // //               <Picker
// // // // // //                 selectedValue={selectedGroupId}
// // // // // //                 onValueChange={(value) => setSelectedGroupId(value)}
// // // // // //               >
// // // // // //                 <Picker.Item label="לחץ לבחירת קבוצה..." value="" />
// // // // // //                 {myGroups.map(g => (
// // // // // //                   <Picker.Item key={g.id} label={g.name || g.groupName} value={g.id} />
// // // // // //                 ))}
// // // // // //               </Picker>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         )}

// // // // // //         <Text style={styles.label}>תיאור הפוסט:</Text>
// // // // // //         <TextInput style={styles.input} placeholder="ספר משהו על הקובץ..." onChangeText={setDescription} />

// // // // // //         <Text style={[styles.label, {color: '#D32F2F'}]}>🤐 מסר סטגנוגרפי (יוחבא בקובץ):</Text>
// // // // // //         <TextInput style={[styles.input, styles.secretInput]} placeholder="הודעה שרק חברי הקבוצה יגלו..." onChangeText={setSecretMessage} />

// // // // // //         <TouchableOpacity style={styles.submitButton} onPress={handlePublish} disabled={loading}>
// // // // // //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>פרסם פוסט 🚀</Text>}
// // // // // //         </TouchableOpacity>
// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#fff' },
// // // // // //   scrollContent: { padding: 20 },
// // // // // //   title: { fontSize: 22, fontWeight: 'bold', color: '#6200EE', textAlign: 'center', marginBottom: 20 },
// // // // // //   filePicker: { 
// // // // // //     height: 200, borderWidth: 2, borderColor: '#6200EE', borderStyle: 'dashed', 
// // // // // //     borderRadius: 15, justifyContent: 'center', alignItems: 'center', 
// // // // // //     marginBottom: 20, backgroundColor: '#F3E5F5', overflow: 'hidden'
// // // // // //   },
// // // // // //   previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
// // // // // //   fileIconContainer: { alignItems: 'center' },
// // // // // //   filePickerText: { color: '#6200EE', fontWeight: 'bold', marginTop: 10 },
// // // // // //   label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
// // // // // //   input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, textAlign: 'right', marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
// // // // // //   secretInput: { borderColor: '#FFCDD2', borderLeftWidth: 5 },
// // // // // //   pickerSection: { marginBottom: 20 },
// // // // // //   pickerWrapper: { backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
// // // // // //   submitButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 12, alignItems: 'center' },
// // // // // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // // // // });

// // // // // // export default CreatePostScreen;
// // // // // import React, { useState } from 'react';
// // // // // import { 
// // // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // // //   ScrollView, Alert, ActivityIndicator, Image 
// // // // // } from 'react-native';
// // // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // // import * as DocumentPicker from '@react-native-documents/picker';
// // // // // import { BASE_URL } from '../api/Constants';

// // // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // // //   // מקבלים את הפרמטרים שנשלחו ממסך הקבוצה
// // // // //   // target יהיה 'group' או 'world'
// // // // //   const { target, groupId, groupName, userName } = route.params || {};

// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [description, setDescription] = useState('');
// // // // //   const [secretMessage, setSecretMessage] = useState('');
// // // // //   const [file, setFile] = useState<any>(null);

// // // // //   // פונקציית בחירת קובץ מותאמת ל-CLI
// // // // //   const pickFile = async () => {
// // // // //     try {
// // // // //       const results = await DocumentPicker.pick({
// // // // //         type: [
// // // // //           DocumentPicker.types.images, 
// // // // //           DocumentPicker.types.video, 
// // // // //           DocumentPicker.types.audio
// // // // //         ],
// // // // //       });

// // // // //       const selectedFile = results[0];
// // // // //       setFile({
// // // // //         uri: selectedFile.uri,
// // // // //         name: selectedFile.name,
// // // // //         type: selectedFile.type,
// // // // //       });

// // // // //     } catch (err: any) {
// // // // //       if (err?.code === 'PICKER_CANCELLED') {
// // // // //         console.log('User cancelled');
// // // // //       } else {
// // // // //         Alert.alert("שגיאה", "נכשלה בחירת הקובץ");
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handlePublish = async () => {
// // // // //     if (!file) return Alert.alert("שגיאה", "אנא בחר קובץ להעלאה");
    
// // // // //     setLoading(true);

// // // // //     const formData = new FormData();
// // // // //     formData.append('file', {
// // // // //       uri: file.uri,
// // // // //       type: file.type,
// // // // //       name: file.name,
// // // // //     } as any);

// // // // //     formData.append('description', description);
// // // // //     formData.append('secretMessage', secretMessage);
// // // // //     formData.append('senderUsername', userName); // השם שקיבלנו מהניווט
    
// // // // //     // שליחה ל-ID של הקבוצה או ל-world
// // // // //     formData.append('target', target === 'group' ? groupId : 'world');

// // // // //     try {
// // // // //       const response = await fetch(`${BASE_URL}/posts/create`, {
// // // // //         method: 'POST',
// // // // //         body: formData,
// // // // //         headers: {
// // // // //           'Accept': 'application/json',
// // // // //         },
// // // // //       });

// // // // //       if (response.ok) {
// // // // //         Alert.alert("הצלחה!", "הפוסט פורסם בהצלחה");
// // // // //         // חזרה אוטומטית למסך הקודם (הקבוצה)
// // // // //         navigation.goBack();
// // // // //       } else {
// // // // //         Alert.alert("שגיאה", "השרת נכשל בעיבוד הפוסט");
// // // // //       }
// // // // //     } catch (error) {
// // // // //       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. וודא ש-Java רץ");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
        
// // // // //         <Text style={styles.title}>
// // // // //           פרסום ב{target === 'group' ? `קבוצת ${groupName}` : 'פיד הכללי'}
// // // // //         </Text>

// // // // //         {/* --- אזור בחירת קובץ עם תצוגה מקדימה --- */}
// // // // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // // // //           {file && file.type?.includes('image') ? (
// // // // //             <Image source={{ uri: file.uri }} style={styles.previewImage} />
// // // // //           ) : file ? (
// // // // //             <View style={styles.filePlaceholder}>
// // // // //                <Text style={{fontSize: 50}}>📎</Text>
// // // // //                <Text style={styles.filePickerText}>{file.name}</Text>
// // // // //             </View>
// // // // //           ) : (
// // // // //             <View style={styles.filePlaceholder}>
// // // // //                <Text style={{fontSize: 50}}>📁</Text>
// // // // //                <Text style={styles.filePickerText}>לחץ לבחירת תמונה / וידאו / שמע</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         </TouchableOpacity>

// // // // //         <Text style={styles.label}>תיאור גלוי:</Text>
// // // // //         <TextInput
// // // // //           style={styles.input}
// // // // //           placeholder="מה רואים בקובץ?"
// // // // //           multiline
// // // // //           onChangeText={setDescription}
// // // // //         />

// // // // //         <Text style={[styles.label, { color: '#D32F2F' }]}>🤐 מסר סודי (סטגנוגרפיה):</Text>
// // // // //         <TextInput
// // // // //           style={[styles.input, styles.secretInput]}
// // // // //           placeholder="הכנס מסר שיוחבא בתוך הקובץ..."
// // // // //           onChangeText={setSecretMessage}
// // // // //         />

// // // // //         <TouchableOpacity 
// // // // //           style={styles.submitButton} 
// // // // //           onPress={handlePublish}
// // // // //           disabled={loading}
// // // // //         >
// // // // //           {loading ? (
// // // // //             <ActivityIndicator color="#fff" />
// // // // //           ) : (
// // // // //             <Text style={styles.submitButtonText}>פרסם עכשיו 🚀</Text>
// // // // //           )}
// // // // //         </TouchableOpacity>

// // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
// // // // //           <Text style={styles.cancelButtonText}>ביטול</Text>
// // // // //         </TouchableOpacity>

// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#fff' },
// // // // //   scrollContent: { padding: 20 },
// // // // //   title: { fontSize: 22, fontWeight: 'bold', color: '#075E54', textAlign: 'center', marginBottom: 20 },
// // // // //   label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
  
// // // // //   filePicker: { 
// // // // //     height: 220, 
// // // // //     borderWidth: 2, 
// // // // //     borderColor: '#075E54', 
// // // // //     borderStyle: 'dashed', 
// // // // //     borderRadius: 15, 
// // // // //     marginBottom: 20,
// // // // //     backgroundColor: '#F5F5F5',
// // // // //     overflow: 'hidden'
// // // // //   },
// // // // //   previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
// // // // //   filePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
// // // // //   filePickerText: { color: '#075E54', fontWeight: 'bold', textAlign: 'center', marginTop: 10 },

// // // // //   input: { 
// // // // //     backgroundColor: '#F9F9F9', 
// // // // //     borderRadius: 10, 
// // // // //     padding: 12, 
// // // // //     textAlign: 'right', 
// // // // //     marginBottom: 20,
// // // // //     fontSize: 16,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#E0E0E0'
// // // // //   },
// // // // //   secretInput: { borderColor: '#FFCDD2', borderLeftWidth: 8 },
  
// // // // //   submitButton: { 
// // // // //     backgroundColor: '#075E54', 
// // // // //     padding: 18, 
// // // // //     borderRadius: 30, 
// // // // //     alignItems: 'center', 
// // // // //     marginTop: 10,
// // // // //     elevation: 3
// // // // //   },
// // // // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
// // // // //   cancelButton: { marginTop: 15, alignItems: 'center' },
// // // // //   cancelButtonText: { color: '#999', fontSize: 16 }
// // // // // });

// // // // // export default CreatePostScreen;
// // // // import React, { useState, useEffect } from 'react';
// // // // import { 
// // // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // // //   ScrollView, Alert, ActivityIndicator, Image, FlatList 
// // // // } from 'react-native';
// // // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // // import * as DocumentPicker from '@react-native-documents/picker';
// // // // import { BASE_URL } from '../api/Constants';

// // // // const CreatePostScreen = ({ route, navigation }: any) => {
// // // //   const { target, groupId, groupName, userName } = route.params || {};

// // // //   const [loading, setLoading] = useState(false);
// // // //   const [description, setDescription] = useState('');
// // // //   const [file, setFile] = useState<any>(null);
  
// // // //   // ניהול חברים ומסרים
// // // //   const [members, setMembers] = useState<string[]>([]); // כל חברי הקבוצה מהשרת
// // // //   const [filteredMembers, setFilteredMembers] = useState<string[]>([]);
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [selectedMessages, setSelectedMessages] = useState<{[key: string]: string}>({});
// // // //   const [isUniform, setIsUniform] = useState(true); // האם מסר אחיד או אישי
// // // //   const [uniformMessage, setUniformMessage] = useState('');

// // // //   // 1. שליפת חברי הקבוצה מהשרת
// // // //   useEffect(() => {
// // // //     if (target === 'group') {
// // // //       fetch(`${BASE_URL}/groups/${groupId}/members`)
// // // //         .then(res => res.json())
// // // //         .then(data => {
// // // //           // סינון המשתמש הנוכחי מהרשימה
// // // //           const otherMembers = data.filter((m: string) => m !== userName);
// // // //           setMembers(otherMembers);
// // // //           setFilteredMembers(otherMembers);
// // // //         })
// // // //         .catch(err => console.error("Error fetching members:", err));
// // // //     }
// // // //   }, [groupId]);

// // // //   // 2. פונקציית חיפוש
// // // //   const handleSearch = (text: string) => {
// // // //     setSearchQuery(text);
// // // //     const filtered = members.filter(m => m.includes(text));
// // // //     setFilteredMembers(filtered);
// // // //   };

// // // //   // 3. עדכון מסר עבור חבר ספציפי
// // // //   const toggleMember = (member: string) => {
// // // //     const newSelected = { ...selectedMessages };
// // // //     if (newSelected[member] !== undefined) {
// // // //       delete newSelected[member]; // הסרה
// // // //     } else {
// // // //       newSelected[member] = isUniform ? uniformMessage : ""; // הוספה
// // // //     }
// // // //     setSelectedMessages(newSelected);
// // // //   };

// // // //   const updateIndividualMessage = (member: string, text: string) => {
// // // //     setSelectedMessages(prev => ({ ...prev, [member]: text }));
// // // //   };

// // // //   const pickFile = async () => {
// // // //   try {
// // // //     const results = await DocumentPicker.pick({
// // // //       // מאפשר לבחור הכל: תמונות, וידאו, PDF ושמע
// // // //       type: [
// // // //         DocumentPicker.types.images,
// // // //         DocumentPicker.types.video,
// // // //         DocumentPicker.types.pdf,
// // // //         DocumentPicker.types.audio,
// // // //       ],
// // // //     });

// // // //     const res = results[0];
// // // //     setFile({
// // // //       uri: res.uri,
// // // //       type: res.type || 'application/octet-stream',
// // // //       name: res.name,
// // // //     });
// // // //   } catch (err: any) {
// // // //     if (err?.code === 'PICKER_CANCELLED' || err?.message?.includes('cancel')) {
// // // //       console.log('User cancelled');
// // // //     } else {
// // // //       Alert.alert("שגיאה", "נכשלה בחירת הקובץ");
// // // //     }
// // // //   }
// // // // };

// // // //   const handlePublish = async () => {
// // // //   if (!file) return Alert.alert("שגיאה", "אנא בחר קובץ");
  
// // // //   // אם לא נבחרו חברים, אין טעם לשלוח מפה ריקה
// // // //   if (Object.keys(selectedMessages).length === 0) {
// // // //     return Alert.alert("שגיאה", "בחר לפחות חבר אחד שיוכל לראות את המסר הסודי");
// // // //   }

// // // //   setLoading(true);

// // // //   // 1. הכנת המפה הסופית לפי הבחירה (אחיד או אישי)
// // // //   const finalMap: {[key: string]: string} = {};
// // // //   Object.keys(selectedMessages).forEach(user => {
// // // //     finalMap[user] = isUniform ? uniformMessage : selectedMessages[user];
// // // //   });

// // // //   const formData = new FormData();
  
// // // //   // הקובץ (תמונה/וידאו)
// // // //   formData.append('file', {
// // // //     uri: file.uri,
// // // //     type: file.type || 'image/jpeg',
// // // //     name: file.name || 'upload.jpg',
// // // //   } as any);

// // // //   // שדות המידע ל-Java
// // // //   formData.append('description', description);
// // // //   formData.append('senderUsername', userName); // השם שלך (היוצר)
// // // //   formData.append('target', target === 'group' ? groupId : 'world'); // שם/ID הקבוצה
// // // //   formData.append('userMessagesJson', JSON.stringify(finalMap)); // המפה הסודית

// // // //   try {
// // // //     // שים לב לתוספת של /api/ לפני ה-posts
// // // //     const response = await fetch(`${BASE_URL}/api/posts/create`, {
// // // //       method: 'POST',
// // // //       body: formData,
// // // //       headers: {
// // // //         'Accept': 'application/json',
// // // //       },
// // // //     });

// // // //     if (response.ok) {
// // // //       Alert.alert("הצלחה!", "הפוסט פורסם והמסרים הוטמעו בהצלחה 🚀");
// // // //       navigation.goBack();
// // // //     } else {
// // // //       const errorMsg = await response.text();
// // // //       console.log("Server Error:", errorMsg);
// // // //       Alert.alert("שגיאה מהשרת", "נכשל בפרסום הפוסט");
// // // //     }
// // // //   } catch (error) {
// // // //     console.error("Fetch Error:", error);
// // // //     Alert.alert("שגיאה", "לא ניתן להתחבר לשרת");
// // // //   } finally {
// // // //     setLoading(false);
// // // //   }
// // // // };

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // //         <Text style={styles.title}>יצירת פוסט ב{groupName}</Text>

// // // //         {/* בחירת קובץ */}
// // // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // // //           {file ? <Image source={{ uri: file.uri }} style={styles.previewImage} /> : <Text style={styles.filePickerText}>📁 בחר תמונה / וידאו</Text>}
// // // //         </TouchableOpacity>

// // // //         <Text style={styles.label}>מה רואים בתמונה? (תיאור גלוי)</Text>
// // // //         <TextInput style={styles.input} placeholder="תיאור חופשי..." onChangeText={setDescription} />

// // // //         <View style={styles.separator} />

// // // //         {/* ניהול מסרים סודיים */}
// // // //         <Text style={styles.sectionTitle}>🤐 מי יראה את המסר הסודי?</Text>
        
// // // //         <View style={styles.toggleContainer}>
// // // //           <TouchableOpacity 
// // // //             style={[styles.toggleBtn, isUniform && styles.activeToggle]} 
// // // //             onPress={() => setIsUniform(true)}
// // // //           >
// // // //             <Text style={isUniform ? styles.activeToggleText : {}}>מסר אחיד</Text>
// // // //           </TouchableOpacity>
// // // //           <TouchableOpacity 
// // // //             style={[styles.toggleBtn, !isUniform && styles.activeToggle]} 
// // // //             onPress={() => setIsUniform(false)}
// // // //           >
// // // //             <Text style={!isUniform ? styles.activeToggleText : {}}>מסר אישי לכל אחד</Text>
// // // //           </TouchableOpacity>
// // // //         </View>

// // // //         {isUniform && (
// // // //           <TextInput 
// // // //             style={[styles.input, styles.secretBorder]} 
// // // //             placeholder="כתוב כאן את המסר שכולם יראו..." 
// // // //             onChangeText={setUniformMessage}
// // // //           />
// // // //         )}

// // // //         {/* חיפוש חברים */}
// // // //         <TextInput 
// // // //           style={styles.searchInput} 
// // // //           placeholder="🔍 חפש חבר בקבוצה..." 
// // // //           value={searchQuery}
// // // //           onChangeText={handleSearch}
// // // //         />

// // // //         <View style={styles.membersList}>
// // // //           {filteredMembers.map(member => (
// // // //             <View key={member} style={styles.memberItem}>
// // // //               <TouchableOpacity 
// // // //                 style={[styles.checkbox, selectedMessages[member] !== undefined && styles.checked]} 
// // // //                 onPress={() => toggleMember(member)}
// // // //               />
// // // //               <View style={{flex: 1}}>
// // // //                 <Text style={styles.memberName}>{member}</Text>
// // // //                 {!isUniform && selectedMessages[member] !== undefined && (
// // // //                   <TextInput 
// // // //                     style={styles.individualInput}
// // // //                     placeholder={`מסר אישי ל${member}...`}
// // // //                     onChangeText={(txt) => updateIndividualMessage(member, txt)}
// // // //                   />
// // // //                 )}
// // // //               </View>
// // // //             </View>
// // // //           ))}
// // // //         </View>

// // // //         <TouchableOpacity style={styles.submitButton} onPress={handlePublish} disabled={loading}>
// // // //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>פרסם פוסט סטגנוגרפי 🚀</Text>}
// // // //         </TouchableOpacity>
// // // //       </ScrollView>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#fff' },
// // // //   scrollContent: { padding: 20 },
// // // //   title: { fontSize: 20, fontWeight: 'bold', color: '#075E54', textAlign: 'center', marginBottom: 15 },
// // // //   label: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 5 },
// // // //   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', textAlign: 'right', marginTop: 10, marginBottom: 10 },
// // // //   filePicker: { height: 150, borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
// // // //   previewImage: { width: '100%', height: '100%', borderRadius: 10 },
// // // //   filePickerText: { color: '#666' },
// // // //   input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 10, textAlign: 'right', marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
// // // //   secretBorder: { borderColor: '#FFCDD2', borderRightWidth: 5 },
// // // //   separator: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
// // // //   toggleContainer: { flexDirection: 'row-reverse', marginBottom: 15 },
// // // //   toggleBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 5, marginLeft: 5 },
// // // //   activeToggle: { backgroundColor: '#075E54' },
// // // //   activeToggleText: { color: '#fff', fontWeight: 'bold' },
// // // //   searchInput: { backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ccc', padding: 8, textAlign: 'right', marginBottom: 10 },
// // // //   membersList: { marginBottom: 20 },
// // // //   memberItem: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
// // // //   checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#075E54', borderRadius: 4, marginLeft: 10 },
// // // //   checked: { backgroundColor: '#075E54' },
// // // //   memberName: { fontSize: 16, textAlign: 'right' },
// // // //   individualInput: { backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#D32F2F', padding: 4, textAlign: 'right', fontSize: 13 },
// // // //   submitButton: { backgroundColor: '#075E54', padding: 15, borderRadius: 25, alignItems: 'center' },
// // // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // // });

// // // // export default CreatePostScreen;
// // // import React, { useState, useEffect } from 'react';
// // // import { 
// // //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// // //   ScrollView, Alert, ActivityIndicator, Image 
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import * as DocumentPicker from '@react-native-documents/picker';
// // // import { BASE_URL } from '../api/Constants';

// // // const CreatePostScreen = ({ route, navigation }: any) => {
// // //   // מקבלים את הפרמטרים: target (group/world), groupId, groupName, userName
// // //   const { target, groupId, groupName, userName } = route.params || {};

// // //   const [loading, setLoading] = useState(false);
// // //   const [description, setDescription] = useState(''); // תיאור גלוי
// // //   const [file, setFile] = useState<any>(null);

// // //   // ניהול חברים ומסרים סודיים
// // //   const [members, setMembers] = useState<string[]>([]); // רשימת המקור מהשרת
// // //   const [filteredMembers, setFilteredMembers] = useState<string[]>([]); // הרשימה שמוצגת בחיפוש
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [selectedMessages, setSelectedMessages] = useState<{[key: string]: string}>({});
// // //   const [isUniform, setIsUniform] = useState(true); // מסר אחיד או אישי
// // //   const [uniformMessage, setUniformMessage] = useState('');

// // //   // 1. שליפת חברי הקבוצה מהשרת בעת טעינה
// // //   useEffect(() => {
// // //     if (target === 'group' && groupId) {
// // //       fetch(`${BASE_URL}/api/groups/${groupId}/members`)
// // //         .then(res => res.json())
// // //         .then(data => {
// // //           const others = data.filter((m: string) => m !== userName);
// // //           setMembers(others);
// // //           setFilteredMembers(others);
// // //         })
// // //         .catch(err => console.error("Error fetching members:", err));
// // //     }
// // //   }, [groupId]);

// // //   // 2. פונקציית חיפוש עם השלמה אוטומטית (Autocomplete)
// // //   const handleSearch = (text: string) => {
// // //     setSearchQuery(text);
// // //     if (text.trim() === '') {
// // //       setFilteredMembers(members);
// // //     } else {
// // //       const filtered = members.filter(m => 
// // //         m.toLowerCase().includes(text.toLowerCase())
// // //       );
// // //       setFilteredMembers(filtered);
// // //     }
// // //   };

// // //   const clearSearch = () => {
// // //     setSearchQuery('');
// // //     setFilteredMembers(members);
// // //   };

// // //   // 3. בחירת קובץ - תומך בהכל (PDF, Audio, Video, Image)
// // //   const pickFile = async () => {
// // //     try {
// // //       const results = await DocumentPicker.pick({
// // //         type: [
// // //           DocumentPicker.types.images,
// // //           DocumentPicker.types.video,
// // //           DocumentPicker.types.pdf,
// // //           DocumentPicker.types.audio,
// // //           DocumentPicker.types.allFiles
// // //         ],
// // //       });

// // //       const res = results[0];
// // //       setFile({
// // //         uri: res.uri,
// // //         name: res.name,
// // //         type: res.type || 'application/octet-stream',
// // //       });
// // //     } catch (err: any) {
// // //       const isCancel = err?.message?.includes('cancel') || err?.code === 'PICKER_CANCELLED';
// // //       if (!isCancel) {
// // //         Alert.alert("שגיאה", "נכשלה בחירת הקובץ");
// // //       }
// // //     }
// // //   };

// // //   const toggleMember = (member: string) => {
// // //     const newSelected = { ...selectedMessages };
// // //     if (newSelected[member] !== undefined) {
// // //       delete newSelected[member];
// // //     } else {
// // //       newSelected[member] = ""; // ברירת מחדל ריק, יתמלא לפי isUniform
// // //     }
// // //     setSelectedMessages(newSelected);
// // //   };

// // //   const updateIndividualMessage = (member: string, text: string) => {
// // //     setSelectedMessages(prev => ({ ...prev, [member]: text }));
// // //   };

// // //   // 4. שליחת הפוסט לשרת
// // //   const handlePublish = async () => {
// // //     if (!file) return Alert.alert("שגיאה", "אנא בחר קובץ להעלאה");
// // //     if (target === 'group' && Object.keys(selectedMessages).length === 0) {
// // //       return Alert.alert("שגיאה", "בחר לפחות חבר אחד למסר הסודי");
// // //     }

// // //     setLoading(true);

// // //     const finalMap: {[key: string]: string} = {};
// // //     Object.keys(selectedMessages).forEach(user => {
// // //       finalMap[user] = isUniform ? uniformMessage : selectedMessages[user];
// // //     });

// // //     const formData = new FormData();
// // //     formData.append('file', {
// // //       uri: file.uri,
// // //       type: file.type,
// // //       name: file.name,
// // //     } as any);

// // //     formData.append('description', description); // מידע על התמונה/קובץ
// // //     formData.append('senderUsername', userName); // שם היוצר
// // //     formData.append('target', target === 'group' ? groupId : 'world'); // מזהה הקבוצה
// // //     formData.append('userMessagesJson', JSON.stringify(finalMap)); // המפה הסודית

// // //     try {
// // //       const response = await fetch(`${BASE_URL}/api/posts/create`, {
// // //         method: 'POST',
// // //         body: formData,
// // //         headers: { 'Accept': 'application/json' },
// // //       });

// // //       if (response.ok) {
// // //         Alert.alert("הצלחה!", "הפוסט פורסם בהצלחה 🚀");
// // //         navigation.goBack();
// // //       } else {
// // //         Alert.alert("שגיאה", "השרת נכשל בעיבוד הפוסט");
// // //       }
// // //     } catch (error) {
// // //       Alert.alert("שגיאה", "לא ניתן להתחבר לשרת");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <ScrollView contentContainerStyle={styles.scrollContent}>
        
// // //         <Text style={styles.title}>
// // //           פרסום ב{target === 'group' ? `קבוצת ${groupName}` : 'פיד הכללי'}
// // //         </Text>

// // //         {/* בחירת קובץ עם תצוגה מקדימה */}
// // //         <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
// // //           {file && file.type?.includes('image') ? (
// // //             <Image source={{ uri: file.uri }} style={styles.previewImage} />
// // //           ) : (
// // //             <View style={styles.filePlaceholder}>
// // //                <Text style={{fontSize: 50}}>{file ? '📎' : '📁'}</Text>
// // //                <Text style={styles.filePickerText}>
// // //                  {file ? file.name : "לחץ לבחירת תמונה / וידאו / PDF / שמע"}
// // //                </Text>
// // //             </View>
// // //           )}
// // //         </TouchableOpacity>

// // //         <Text style={styles.label}>תיאור גלוי (מידע על הקובץ):</Text>
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="מה רואים בקובץ? (יוצג לכולם)"
// // //           multiline
// // //           onChangeText={setDescription}
// // //         />

// // //         {target === 'group' && (
// // //           <View style={styles.secretSection}>
// // //             <Text style={styles.sectionTitle}>🤐 הגדרת מסרים סודיים</Text>
            
// // //             <View style={styles.toggleRow}>
// // //               <TouchableOpacity 
// // //                 style={[styles.toggleBtn, isUniform && styles.activeToggle]} 
// // //                 onPress={() => setIsUniform(true)}
// // //               >
// // //                 <Text style={isUniform ? styles.whiteText : {}}>מסר אחיד</Text>
// // //               </TouchableOpacity>
// // //               <TouchableOpacity 
// // //                 style={[styles.toggleBtn, !isUniform && styles.activeToggle]} 
// // //                 onPress={() => setIsUniform(false)}
// // //               >
// // //                 <Text style={!isUniform ? styles.whiteText : {}}>מסר אישי</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             {isUniform && (
// // //               <TextInput 
// // //                 style={[styles.input, styles.uniformInput]} 
// // //                 placeholder="כתוב כאן את המסר הסודי לכולם..." 
// // //                 onChangeText={setUniformMessage}
// // //               />
// // //             )}

// // //             {/* חיפוש חברים עם Autocomplete וכפתור X */}
// // //             <View style={styles.searchWrapper}>
// // //               <TextInput 
// // //                 style={styles.searchInput} 
// // //                 placeholder="🔍 חפש חבר להוספה..." 
// // //                 value={searchQuery}
// // //                 onChangeText={handleSearch}
// // //               />
// // //               {searchQuery.length > 0 && (
// // //                 <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
// // //                   <Text style={{fontWeight:'bold', color: '#666'}}>X</Text>
// // //                 </TouchableOpacity>
// // //               )}
// // //             </View>

// // //             <View style={styles.membersList}>
// // //               {filteredMembers.map(member => (
// // //                 <View key={member} style={styles.memberCard}>
// // //                   <TouchableOpacity 
// // //                     style={[styles.checkbox, selectedMessages[member] !== undefined && styles.checked]} 
// // //                     onPress={() => toggleMember(member)}
// // //                   />
// // //                   <View style={{flex: 1, marginRight: 10}}>
// // //                     <Text style={styles.memberName}>{member}</Text>
// // //                     {!isUniform && selectedMessages[member] !== undefined && (
// // //                       <TextInput 
// // //                         style={styles.individualInput}
// // //                         placeholder={`מסר סודי ל${member}...`}
// // //                         onChangeText={(txt) => updateIndividualMessage(member, txt)}
// // //                         autoFocus
// // //                       />
// // //                     )}
// // //                   </View>
// // //                 </View>
// // //               ))}
// // //             </View>
// // //           </View>
// // //         )}

// // //         <TouchableOpacity style={styles.submitButton} onPress={handlePublish} disabled={loading}>
// // //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>פרסם פוסט סטגנוגרפי 🚀</Text>}
// // //         </TouchableOpacity>

// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#fff' },
// // //   scrollContent: { padding: 20 },
// // //   title: { fontSize: 22, fontWeight: 'bold', color: '#075E54', textAlign: 'center', marginBottom: 20 },
// // //   label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
// // //   sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', textAlign: 'right', marginBottom: 15 },
  
// // //   filePicker: { height: 180, borderWidth: 2, borderColor: '#075E54', borderStyle: 'dashed', borderRadius: 15, marginBottom: 20, backgroundColor: '#F5F5F5', overflow: 'hidden' },
// // //   previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
// // //   filePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
// // //   filePickerText: { color: '#075E54', fontWeight: 'bold', textAlign: 'center', marginTop: 10 },

// // //   input: { backgroundColor: '#F9F9F9', borderRadius: 10, padding: 12, textAlign: 'right', marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
// // //   uniformInput: { borderColor: '#FFCDD2', borderRightWidth: 8 },
  
// // //   secretSection: { backgroundColor: '#FFF9F9', padding: 15, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#FFEBEE' },
// // //   toggleRow: { flexDirection: 'row-reverse', marginBottom: 15 },
// // //   toggleBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, marginLeft: 5 },
// // //   activeToggle: { backgroundColor: '#D32F2F' },
// // //   whiteText: { color: '#fff', fontWeight: 'bold' },

// // //   searchWrapper: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10 },
// // //   searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, textAlign: 'right', borderWidth: 1, borderColor: '#ccc' },
// // //   clearIcon: { position: 'absolute', left: 10, padding: 5 },

// // //   membersList: { marginTop: 10 },
// // //   memberCard: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, elevation: 1 },
// // //   checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#D32F2F', borderRadius: 5, marginLeft: 10 },
// // //   checked: { backgroundColor: '#D32F2F' },
// // //   memberName: { fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
// // //   individualInput: { borderBottomWidth: 1, borderColor: '#D32F2F', padding: 4, textAlign: 'right', fontSize: 14, marginTop: 5 },

// // //   submitButton: { backgroundColor: '#075E54', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 10 },
// // //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // // });

// // // export default CreatePostScreen;
// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, Text, TextInput, TouchableOpacity, StyleSheet, 
// //   ScrollView, Alert, ActivityIndicator, Image 
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import * as DocumentPicker from '@react-native-documents/picker';
// // import { BASE_URL } from '../api/Constants';

// // const CreatePostScreen = ({ route, navigation }: any) => {
// //   const { target, groupId, groupName, userName } = route.params || {};

// //   const [loading, setLoading] = useState(false);
// //   const [description, setDescription] = useState('');
// //   const [file, setFile] = useState<any>(null);

// //   // --- ניהול חברים וחיפוש ---
// //   const [allMembers, setAllMembers] = useState<string[]>([]); // הרשימה המלאה מהשרת
// //   const [filteredMembers, setFilteredMembers] = useState<string[]>([]); // הרשימה המוצגת (מסוננת)
// //   const [searchQuery, setSearchQuery] = useState('');
  
// //   // --- ניהול מסרים סודיים ---
// //   const [selectedMembers, setSelectedMembers] = useState<string[]>([]); 
// //   const [isUniform, setIsUniform] = useState(true); 
// //   const [uniformMessage, setUniformMessage] = useState('');
// //   const [individualMessages, setIndividualMessages] = useState<{[key: string]: string}>({});

// //   // 1. שליפת חברים מהשרת (עם טיפול בשגיאות למניעת מסך שחור)
// //   useEffect(() => {
// //     const fetchMembers = async () => {
// //       try {
// //         const response = await fetch(`${BASE_URL}/api/groups/${groupId}/members`);
// //         const data = await response.json();
// //         const others = Array.isArray(data) ? data.filter((m: string) => m !== userName) : [];
// //         setAllMembers(others);
// //         setFilteredMembers(others);
// //       } catch (e) {
// //         console.error("Fetch members failed", e);
// //         // רשימת דוגמה לטסטים אם השרת לא זמין
// //         const testMembers = ["אבי כהן", "מיכל לוי", "דניאל גבאי", "נועה זיו"];
// //         setAllMembers(testMembers);
// //         setFilteredMembers(testMembers);
// //       }
// //     };
// //     if (target === 'group') fetchMembers();
// //   }, [groupId]);

// //   // 2. סינון אוטומטי בזמן הקלדה (Autocomplete)
// //   const handleSearch = (text: string) => {
// //     setSearchQuery(text);
// //     const filtered = allMembers.filter(m => 
// //       m.toLowerCase().includes(text.toLowerCase())
// //     );
// //     setFilteredMembers(filtered);
// //   };

// //   const toggleMember = (name: string) => {
// //     if (selectedMembers.includes(name)) {
// //       setSelectedMembers(prev => prev.filter(m => m !== name));
// //     } else {
// //       setSelectedMembers(prev => [...prev, name]);
// //     }
// //   };

// //   const pickFile = async () => {
// //     try {
// //       const results = await DocumentPicker.pick({
// //         type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.pdf],
// //       });
// //       setFile(results[0]);
// //     } catch (err) {
// //       console.log("Picker cancelled or failed");
// //     }
// //   };

// //   const handlePublish = async () => {
// //     if (!file) return Alert.alert("חסר קובץ", "אנא בחר תמונה או מסמך");
// //     setLoading(true);

// //     const finalMessages: {[key: string]: string} = {};
// //     selectedMembers.forEach(m => {
// //       finalMessages[m] = isUniform ? uniformMessage : (individualMessages[m] || "");
// //     });

// //     const formData = new FormData();
// //     formData.append('file', { uri: file.uri, type: file.type, name: file.name } as any);
// //     formData.append('description', description);
// //     formData.append('senderUsername', userName);
// //     formData.append('target', target === 'group' ? groupId : 'world');
// //     formData.append('userMessagesJson', JSON.stringify(finalMessages));

// //     try {
// //       const res = await fetch(`${BASE_URL}/api/posts/create`, { method: 'POST', body: formData });
// //       if (res.ok) {
// //         Alert.alert("הצלחה", "הפוסט פורסם!");
// //         navigation.goBack();
// //       }
// //     } catch (e) {
// //       Alert.alert("שגיאה", "נכשל בחיבור לשרת");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView contentContainerStyle={styles.scrollContent}>
        
// //         <Text style={styles.headerTitle}>יצירת פוסט ב-{groupName}</Text>

// //         {/* בחירת קובץ */}
// //         <TouchableOpacity style={styles.fileUploadBox} onPress={pickFile}>
// //           {file ? (
// //             <Text style={styles.fileSelectedText}>✅ קובץ נבחר: {file.name}</Text>
// //           ) : (
// //             <Text style={styles.filePlaceholderText}>📁 לחץ להעלאת תמונה / וידאו / PDF</Text>
// //           )}
// //         </TouchableOpacity>

// //         <Text style={styles.label}>תיאור גלוי (לכולם):</Text>
// //         <TextInput 
// //           style={styles.input} 
// //           placeholder="מה רואים בתמונה?" 
// //           onChangeText={setDescription}
// //           multiline
// //         />

// //         <View style={styles.divider} />

// //         {/* אזור מסר סודי */}
// //         <View style={styles.secretCard}>
// //           <Text style={styles.secretTitle}>🤐 הגדרת מסרים סודיים</Text>
          
// //           <View style={styles.tabContainer}>
// //             <TouchableOpacity 
// //               style={[styles.tab, isUniform && styles.activeTab]} 
// //               onPress={() => setIsUniform(true)}
// //             >
// //               <Text style={isUniform ? styles.activeTabText : styles.tabText}>מסר אחיד</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity 
// //               style={[styles.tab, !isUniform && styles.activeTab]} 
// //               onPress={() => setIsUniform(false)}
// //             >
// //               <Text style={!isUniform ? styles.activeTabText : styles.tabText}>מסר אישי</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {isUniform && (
// //             <TextInput 
// //               style={[styles.input, styles.uniformInput]} 
// //               placeholder="כתוב את המסר הסודי לכל הנבחרים..." 
// //               onChangeText={setUniformMessage}
// //             />
// //           )}

// //           <View style={styles.searchWrapper}>
// //             <TextInput 
// //               style={styles.searchInput} 
// //               placeholder="🔍 חפש חבר להוספה..." 
// //               value={searchQuery}
// //               onChangeText={handleSearch}
// //             />
// //             {searchQuery !== '' && (
// //               <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearBtn}>
// //                 <Text>✕</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>

// //           <View style={styles.membersList}>
// //             {filteredMembers.map((member) => {
// //               const isSelected = selectedMembers.includes(member);
// //               return (
// //                 <View key={member} style={styles.memberRow}>
// //                   <View style={styles.memberTop}>
// //                     <TouchableOpacity 
// //                       style={[styles.checkbox, isSelected && styles.checkedBox]} 
// //                       onPress={() => toggleMember(member)} 
// //                     />
// //                     <Text style={styles.memberName}>{member}</Text>
// //                   </View>

// //                   {!isUniform && isSelected && (
// //                     <TextInput 
// //                       style={styles.personalInput}
// //                       placeholder={`מסר סודי ייחודי ל-${member}...`}
// //                       onChangeText={(text) => setIndividualMessages({...individualMessages, [member]: text})}
// //                       autoFocus
// //                     />
// //                   )}
// //                 </View>
// //               );
// //             })}
// //           </View>
// //         </View>

// //         <TouchableOpacity 
// //           style={[styles.publishBtn, loading && {opacity: 0.6}]} 
// //           onPress={handlePublish}
// //           disabled={loading}
// //         >
// //           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>פרסם פוסט 🚀</Text>}
// //         </TouchableOpacity>

// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F0F2F5' },
// //   scrollContent: { padding: 16 },
// //   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#075E54', textAlign: 'center', marginBottom: 20 },
// //   fileUploadBox: { height: 120, backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 2, borderColor: '#075E54', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
// //   fileSelectedText: { color: '#075E54', fontWeight: 'bold' },
// //   filePlaceholderText: { color: '#666' },
// //   label: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 5, color: '#444' },
// //   input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, textAlign: 'right', borderWidth: 1, borderColor: '#ddd', marginBottom: 15 },
// //   divider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },
  
// //   secretCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, elevation: 3 },
// //   secretTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', textAlign: 'right', marginBottom: 15 },
// //   tabContainer: { flexDirection: 'row-reverse', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 4, marginBottom: 15 },
// //   tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 8 },
// //   activeTab: { backgroundColor: '#D32F2F' },
// //   tabText: { color: '#666' },
// //   activeTabText: { color: '#fff', fontWeight: 'bold' },
// //   uniformInput: { borderColor: '#D32F2F', borderRightWidth: 5 },

// //   searchWrapper: { flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', marginBottom: 10 },
// //   searchInput: { flex: 1, padding: 10, textAlign: 'right', fontSize: 16 },
// //   clearBtn: { padding: 10 },

// //   membersList: { marginTop: 5 },
// //   memberRow: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
// //   memberTop: { flexDirection: 'row-reverse', alignItems: 'center' },
// //   checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#D32F2F', borderRadius: 6, marginLeft: 12 },
// //   checkedBox: { backgroundColor: '#D32F2F' },
// //   memberName: { fontSize: 16, color: '#333' },
// //   personalInput: { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10, paddingTop: 8, textAlign: 'right', color: '#D32F2F', fontWeight: '500' },

// //   publishBtn: { backgroundColor: '#075E54', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 25, elevation: 5 },
// //   publishBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // });

// // export default CreatePostScreen;
// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, StyleSheet, 
//   ScrollView, Alert, ActivityIndicator, FlatList 
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { BASE_URL } from '../api/Constants';

// const CreatePostScreen = ({ route, navigation }: any) => {
//   const { target, groupId, groupName, userName } = route.params || {};

//   // רשימות חברים
//   const [allMembers, setAllMembers] = useState<string[]>([]); // כל חברי הקבוצה מהשרת
//   const [filteredResults, setFilteredResults] = useState<string[]>([]); // מה שצץ בחיפוש
//   const [searchQuery, setSearchQuery] = useState('');

//   // בחירות ומסרים
//   const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // חברים שנבחרו סופית
//   const [individualMessages, setIndividualMessages] = useState<{[key: string]: string}>({});
//   const [isUniform, setIsUniform] = useState(true);
//   const [uniformMessage, setUniformMessage] = useState('');
// const pickFile = async () => {
//     try {
//       const results = await DocumentPicker.pick({
//         type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.pdf],
//       });
//       setFile(results[0]);
//     } catch (err) {
//       console.log("Picker cancelled or failed");
//     }
//   };

//   const handlePublish = async () => {
//     if (!file) return Alert.alert("חסר קובץ", "אנא בחר תמונה או מסמך");
//     setLoading(true);

//     const finalMessages: {[key: string]: string} = {};
//     selectedMembers.forEach(m => {
//       finalMessages[m] = isUniform ? uniformMessage : (individualMessages[m] || "");
//     });

//     const formData = new FormData();
//     formData.append('file', { uri: file.uri, type: file.type, name: file.name } as any);
//     formData.append('description', description);
//     formData.append('senderUsername', userName);
//     formData.append('target', target === 'group' ? groupId : 'world');
//     formData.append('userMessagesJson', JSON.stringify(finalMessages));

//     try {
//       const res = await fetch(`${BASE_URL}/api/posts/create`, { method: 'POST', body: formData });
//       if (res.ok) {
//         Alert.alert("הצלחה", "הפוסט פורסם!");
//         navigation.goBack();
//       }
//     } catch (e) {
//       Alert.alert("שגיאה", "נכשל בחיבור לשרת");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         <Text style={styles.headerTitle}>יצירת פוסט ב-{groupName}</Text>

//         {/* בחירת קובץ */}
//         <TouchableOpacity style={styles.fileUploadBox} onPress={pickFile}>
//           {file ? (
//             <Text style={styles.fileSelectedText}>✅ קובץ נבחר: {file.name}</Text>
//           ) : (
//             <Text style={styles.filePlaceholderText}>📁 לחץ להעלאת תמונה / וידאו / PDF</Text>
//           )}
//         </TouchableOpacity>

//         <Text style={styles.label}>תיאור גלוי (לכולם):</Text>
//         <TextInput 
//           style={styles.input} 
//           placeholder="מה רואים בתמונה?" 
//           onChangeText={setDescription}
//           multiline
//         />

//         <View style={styles.divider} />

//         {/* אזור מסר סודי */}
//         <View style={styles.secretCard}>
//           <Text style={styles.secretTitle}>🤐 הגדרת מסרים סודיים</Text>
          
//           <View style={styles.tabContainer}>
//             <TouchableOpacity 
//               style={[styles.tab, isUniform && styles.activeTab]} 
//               onPress={() => setIsUniform(true)}
//             >
//               <Text style={isUniform ? styles.activeTabText : styles.tabText}>מסר אחיד</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[styles.tab, !isUniform && styles.activeTab]} 
//               onPress={() => setIsUniform(false)}
//             >
//               <Text style={!isUniform ? styles.activeTabText : styles.tabText}>מסר אישי</Text>
//             </TouchableOpacity>
//           </View>
//   // 1. שליפת חברי הקבוצה
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/api/groups/${groupId}/members`);
//         const data = await response.json();
//         const others = data.filter((m: string) => m !== userName);
//         setAllMembers(others);
//       } catch (e) {
//         // רשימת גיבוי לטסטים
//         setAllMembers(["אברהם", "יצחק", "יעקב", "שרה", "רבקה", "רחל", "לאה"]);
//       }
//     };
//     if (target === 'group') fetchMembers();
//   }, []);

//   // 2. לוגיקת החיפוש (Autocomplete) - מופעל מ-2 אותיות
//   const handleSearch = (text: string) => {
//     setSearchQuery(text);
//     if (text.length >= 2) {
//       const filtered = allMembers.filter(m => 
//         m.includes(text) && !selectedMembers.includes(m)
//       );
//       setFilteredResults(filtered);
//     } else {
//       setFilteredResults([]);
//     }
//   };

//   // 3. בחירת חבר מהרשימה הקופצת
//   const selectMember = (name: string) => {
//     if (!selectedMembers.includes(name)) {
//       setSelectedMembers([...selectedMembers, name]);
//     }
//     setSearchQuery(''); // מנקה את החיפוש אחרי בחירה
//     setFilteredResults([]); // סוגר את הרשימה הקופצת
//   };

//   const removeMember = (name: string) => {
//     setSelectedMembers(selectedMembers.filter(m => m !== name));
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
//         <Text style={styles.headerTitle}>פוסט חדש ל-{groupName}</Text>

//         {/* --- אזור החיפוש וההקפצה --- */}
//         <View style={styles.searchSection}>
//           <Text style={styles.label}>🔍 חפש חבר להוספת מסר סודי:</Text>
//           <TextInput 
//             style={styles.searchInput}
//             placeholder="הקלד לפחות 2 אותיות..."
//             value={searchQuery}
//             onChangeText={handleSearch}
//           />
          
//           {/* הרשימה ש"קופצת" מתחת לחיפוש */}
//           {filteredResults.length > 0 && (
//             <View style={styles.autocompleteDropdown}>
//               {filteredResults.map(item => (
//                 <TouchableOpacity 
//                   key={item} 
//                   style={styles.dropdownItem} 
//                   onPress={() => selectMember(item)}
//                 >
//                   <Text style={styles.dropdownText}>{item}</Text>
//                   <Text style={styles.addPlus}>+</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* --- רשימת הנבחרים והמסרים --- */}
//         <View style={styles.selectedSection}>
//           <Text style={styles.sectionTitle}>👥 חברים שנבחרו ({selectedMembers.length})</Text>
          
//           {selectedMembers.length === 0 && (
//             <Text style={styles.emptyText}>טרם נבחרו חברים למסר סודי</Text>
//           )}

//           {selectedMembers.map(member => (
//             <View key={member} style={styles.memberCard}>
//               <View style={styles.memberHeader}>
//                 <TouchableOpacity onPress={() => removeMember(member)}>
//                   <Text style={styles.removeBtn}>✕ הסר</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.memberName}>{member}</Text>
//               </View>

//               {/* שדה מסר אישי - מופיע רק אם לא נבחר "מסר אחיד" */}
//               {!isUniform && (
//                 <TextInput 
//                   style={styles.personalMsgInput}
//                   placeholder={`כתוב מסר סודי רק ל${member}...`}
//                   onChangeText={(txt) => setIndividualMessages({...individualMessages, [member]: txt})}
//                   multiline
//                 />
//               )}
//             </View>
//           ))}
//         </View>

//         {/* --- בחירת סוג מסר --- */}
//         <View style={styles.messageTypeCard}>
//           <View style={styles.toggleRow}>
//             <TouchableOpacity 
//               style={[styles.toggleBtn, isUniform && styles.activeToggle]} 
//               onPress={() => setIsUniform(true)}
//             >
//               <Text style={isUniform ? styles.activeText : {}}>מסר אחיד לכולם</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[styles.toggleBtn, !isUniform && styles.activeToggle]} 
//               onPress={() => setIsUniform(false)}
//             >
//               <Text style={!isUniform ? styles.activeText : {}}>מסר אישי לכל אחד</Text>
//             </TouchableOpacity>
//           </View>

//           {isUniform && (
//             <TextInput 
//               style={styles.uniformInput}
//               placeholder="כתוב כאן את המסר שכולם יראו..."
//               onChangeText={setUniformMessage}
//               multiline
//             />
//           )}
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },
//   scrollContent: { padding: 20 },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#075E54' },
//   label: { textAlign: 'right', fontWeight: 'bold', marginBottom: 5 },
  
//   searchSection: { zIndex: 100, marginBottom: 20 }, // zIndex חשוב כדי שהרשימה תצוף מעל הכל
//   searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 10, textAlign: 'right', borderWidth: 1, borderColor: '#ddd' },
  
//   autocompleteDropdown: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginTop: 5,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: '#eee',
//     position: 'absolute', // גורם לזה "לקפוץ" מעל שאר המסך
//     top: 70,
//     left: 0,
//     right: 0,
//     zIndex: 1000
//   },
//   dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },
//   dropdownText: { fontSize: 16, fontWeight: '500' },
//   addPlus: { color: '#075E54', fontWeight: 'bold', fontSize: 18 },

//   selectedSection: { marginBottom: 20 },
//   sectionTitle: { textAlign: 'right', fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#D32F2F' },
//   memberCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
//   memberHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   memberName: { fontSize: 16, fontWeight: 'bold' },
//   removeBtn: { color: '#ff4444', fontSize: 12 },
//   personalMsgInput: { textAlign: 'right', color: '#075E54', fontSize: 14, paddingTop: 10 },

//   messageTypeCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20 },
//   toggleRow: { flexDirection: 'row-reverse', marginBottom: 15 },
//   toggleBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, marginLeft: 5 },
//   activeToggle: { backgroundColor: '#075E54' },
//   activeText: { color: '#fff', fontWeight: 'bold' },
//   uniformInput: { textAlign: 'right', borderTopWidth: 1, borderColor: '#eee', paddingTop: 15 },
//   emptyText: { textAlign: 'center', color: '#999', marginTop: 10 }
// });

// export default CreatePostScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from '@react-native-documents/picker';
import { BASE_URL } from '../api/Constants';

const CreatePostScreen = ({ route, navigation }: any) => {
  const { target, groupId, groupName, userName } = route.params || {};

  // State כללי
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<any>(null);

  // State לניהול חברים ומסרים
  const [allMembers, setAllMembers] = useState<string[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isUniform, setIsUniform] = useState(true);
  const [uniformMessage, setUniformMessage] = useState('');
  const [individualMessages, setIndividualMessages] = useState<{[key: string]: string}>({});

  // 1. שליפת חברי הקבוצה מהשרת
  useEffect(() => {
    if (target === 'group') {
      fetch(`${BASE_URL}/api/groups/${groupId}/members`)
        .then(res => res.json())
        .then(data => {
          const others = data.filter((m: string) => m !== userName);
          setAllMembers(others);
        })
        .catch(() => setAllMembers(["בדיקה: אבי", "בדיקה: מיכל", "בדיקה: דני"])); // גיבוי לטסטים
    }
  }, []);

  // 2. לוגיקת חיפוש (Autocomplete)
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length >= 2) {
      const filtered = allMembers.filter(m => 
        m.includes(text) && !selectedMembers.includes(m)
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };

  const selectMember = (name: string) => {
    setSelectedMembers([...selectedMembers, name]);
    setSearchQuery('');
    setFilteredResults([]);
  };

  // 3. בחירת קובץ
  const pickFile = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.pdf],
      });
      setFile(results[0]);
     } catch (err: any) {
  // בדיקה אם המשתמש פשוט סגר את החלונית בלי לבחור
  if (err?.code === 'DOCUMENT_PICKER_CANCELED' || err?.message?.includes('cancel')) {
    console.log('User cancelled the picker');
  } else {
    Alert.alert("שגיאה", "בחירת קובץ נכשלה");
  }
}
  };

  // 4. פרסום לשרת
  const handlePublish = async () => {
    if (!file) return Alert.alert("שגיאה", "אנא בחר קובץ");
    if (selectedMembers.length === 0) return Alert.alert("שגיאה", "בחר לפחות חבר אחד למסר סודי");

    setLoading(true);
    const finalMessages: {[key: string]: string} = {};
    selectedMembers.forEach(m => {
      finalMessages[m] = isUniform ? uniformMessage : (individualMessages[m] || "");
    });

    const formData = new FormData();
    formData.append('file', { uri: file.uri, type: file.type, name: file.name } as any);
    formData.append('description', description);
    formData.append('senderUsername', userName);
    formData.append('target', target === 'group' ? groupId : 'world');
    formData.append('userMessagesJson', JSON.stringify(finalMessages));

    try {
      const res = await fetch(`${BASE_URL}/api/posts/create`, { method: 'POST', body: formData });
      if (res.ok) {
        Alert.alert("הצלחה", "הפוסט פורסם!");
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert("שגיאה", "החיבור לשרת נכשל");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.headerTitle}>פרסום ב-{groupName || 'פיד'}</Text>

        {/* בחירת קובץ */}
        <TouchableOpacity style={styles.fileBox} onPress={pickFile}>
          {file && file.type?.includes('image') ? (
            <Image source={{ uri: file.uri }} style={styles.preview} />
          ) : (
            <Text style={styles.fileText}>{file ? `✅ ${file.name}` : "📁 בחר תמונה / וידאו / PDF"}</Text>
          )}
        </TouchableOpacity>

        <TextInput 
          style={styles.input} 
          placeholder="תיאור גלוי לכולם..." 
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.divider} />

        {/* הגדרת מסר סודי */}
        <View style={styles.secretCard}>
          <Text style={styles.sectionTitle}>🤐 מסרים סודיים</Text>
          
          <View style={styles.toggleRow}>
            <TouchableOpacity style={[styles.tab, isUniform && styles.activeTab]} onPress={() => setIsUniform(true)}>
              <Text style={isUniform ? styles.activeTabText : {}}>אחיד</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, !isUniform && styles.activeTab]} onPress={() => setIsUniform(false)}>
              <Text style={!isUniform ? styles.activeTabText : {}}>אישי</Text>
            </TouchableOpacity>
          </View>

          {isUniform && (
            <TextInput 
              style={[styles.input, styles.uniformInput]} 
              placeholder="מסר סודי לכל הנבחרים..." 
              onChangeText={setUniformMessage}
            />
          )}

          {/* חיפוש חבר */}
          <View style={styles.searchWrapper}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="🔍 חפש חבר (2 אותיות...)" 
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {filteredResults.length > 0 && (
              <View style={styles.dropdown}>
                {filteredResults.map(name => (
                  <TouchableOpacity key={name} style={styles.dropItem} onPress={() => selectMember(name)}>
                    <Text>{name}</Text>
                    <Text style={{color: 'green'}}>+</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* רשימת נבחרים */}
          {selectedMembers.map(member => (
            <View key={member} style={styles.selectedMember}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberName}>{member}</Text>
                <TouchableOpacity onPress={() => setSelectedMembers(prev => prev.filter(m => m !== member))}>
                  <Text style={{color: 'red'}}>✕</Text>
                </TouchableOpacity>
              </View>
              {!isUniform && (
                <TextInput 
                  style={styles.personalInput}
                  placeholder={`מסר אישי ל${member}...`}
                  onChangeText={txt => setIndividualMessages({...individualMessages, [member]: txt})}
                />
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>פרסם פוסט 🚀</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#075E54' },
  fileBox: { height: 150, backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 2, borderColor: '#075E54', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
  preview: { width: '100%', height: '100%' },
  fileText: { color: '#075E54', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, textAlign: 'right', marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 15 },
  secretCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 3, zIndex: 1000 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F', textAlign: 'right', marginBottom: 10 },
  toggleRow: { flexDirection: 'row-reverse', marginBottom: 15, backgroundColor: '#eee', borderRadius: 10, padding: 5 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#D32F2F' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  uniformInput: { borderColor: '#D32F2F', borderRightWidth: 5 },
  searchWrapper: { zIndex: 2000, position: 'relative' },
  searchInput: { borderBottomWidth: 1, borderColor: '#075E54', padding: 10, textAlign: 'right' },
  dropdown: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: '#fff', elevation: 5, borderRadius: 10, borderColor: '#eee', zIndex: 3000 },
  dropItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row-reverse', justifyContent: 'space-between' },
  selectedMember: { backgroundColor: '#F9F9F9', padding: 10, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#eee' },
  memberHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  memberName: { fontWeight: 'bold' },
  personalInput: { borderTopWidth: 1, borderTopColor: '#ddd', marginTop: 10, paddingTop: 5, textAlign: 'right', color: '#075E54' },
  publishBtn: { backgroundColor: '#075E54', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 30 },
  publishBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreatePostScreen;