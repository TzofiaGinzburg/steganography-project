import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from '@react-native-documents/picker';
import { BASE_URL } from '../api/Constants';

const CreatePostScreen = ({ route, navigation }: any) => {
  // מקבלים את היעד מה-MenuScreen
  const { target } = route.params || { target: 'world' };

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [file, setFile] = useState<any>(null); // שונה מ-DocumentPickerResponse ל-any בגלל המעבר ל-Expo
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const myGroups = [
    { id: '1', name: 'המשפחה שלי' },
    { id: '2', name: 'חברי לימודים' },
    { id: '3', name: 'צוות פיתוח' },
  ];

  const pickFile = async () => {
  try {
    const results = await DocumentPicker.pick({
      type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.audio],
    });

    const selectedFile = results[0];
    setFile({
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size
    });

  }  catch (err: any) {
    // במקום isCancel, אנחנו בודקים את קוד השגיאה ישירות
    if (err?.code === 'DOCUMENT_PICKER_CANCELED' || err?.message?.includes('cancel')) {
      console.log('המשתמש ביטל את הבחירה');
    } else {
      console.error("שגיאה בבחירת קובץ:", err);
      Alert.alert("שגיאה", "נכשלה בחירת הקובץ");
    }
  }
};
  const handlePublish = async () => {
    if (!file) {
      return Alert.alert("שגיאה", "אנא בחר קובץ להעלאה");
    }
    if (target === 'group' && !selectedGroupId) {
      return Alert.alert("שגיאה", "אנא בחר קבוצת יעד");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    formData.append('description', description);
    formData.append('secretMessage', secretMessage);
    formData.append('target', target === 'world' ? 'world' : selectedGroupId);

    try {
      const response = await fetch('http://10.0.2.2:8080/api/posts/create', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert("הצלחה!", "הפוסט נשמר בשרת");
        navigation.goBack();
      } else {
        const errorData = await response.text();
        console.log("Server Error:", errorData);
        Alert.alert("שגיאה", "השרת נכשל בעיבוד הפוסט");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("שגיאה", "לא ניתן להתחבר לשרת. וודא ש-Java רץ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>יצירת פוסט חדש ({target === 'world' ? 'ציבורי' : 'לקבוצה'})</Text>

        <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
          <Text style={styles.filePickerText}>
            {file ? `📎 קובץ נבחר: ${file.name}` : "📁 לחץ לבחירת תמונה / וידאו / שמע"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>תיאור גלוי (יוצג לכולם):</Text>
        <TextInput
          style={styles.input}
          placeholder="מה רואים בקובץ?"
          multiline
          onChangeText={setDescription}
        />

        <Text style={[styles.label, { color: '#D32F2F' }]}>🤐 מסר סודי (יוטמע בתוך הקובץ):</Text>
        <TextInput
          style={[styles.input, styles.secretInput]}
          placeholder="הכנס את המסר שרק חברי הקבוצה יראו..."
          onChangeText={setSecretMessage}
        />

        {target === 'group' && (
          <View style={styles.pickerSection}>
            <Text style={styles.label}>בחר קבוצה:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedGroupId}
                onValueChange={(value) => setSelectedGroupId(value)}
              >
                <Picker.Item label="בחר קבוצה מהרשימה..." value="" />
                {myGroups.map(group => (
                  <Picker.Item key={group.id} label={group.name} value={group.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>בצע סטגנוגרפיה ופרסם 🚀</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6200EE', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'right' },
  filePicker: { 
    height: 120, 
    borderWidth: 2, 
    borderColor: '#6200EE', 
    borderStyle: 'dashed', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
    backgroundColor: '#F3E5F5'
  },
  filePickerText: { color: '#6200EE', fontWeight: 'bold', textAlign: 'center', padding: 10 },
  input: { 
    backgroundColor: '#F5F5F5', 
    borderRadius: 8, 
    padding: 12, 
    textAlign: 'right', 
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  secretInput: { borderColor: '#FFCDD2', borderLeftWidth: 5 },
  pickerSection: { marginBottom: 20 },
  pickerWrapper: { backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  submitButton: { 
    backgroundColor: '#6200EE', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 4
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreatePostScreen;