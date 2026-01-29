import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform, Alert, Image 
} from 'react-native';
import { Theme } from '../styles/theme';

const RegisterScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1); // שלב 1: הסבר, שלב 2: פרטים
  
  // State לכל השדות
  const [formData, setFormData] = useState({
    id: '', firstName: '', phone: '', email: '', 
    address: '', birthDate: '', username: '', 
    password: '', confirmPassword: ''
  });

  const handleNextStep = () => setStep(2);

  const validateAndSubmit = async () => {
    // ולידציה בסיסית
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("שגיאה", "הסיסמאות אינן תואמות");
      return;
    }
    if (Object.values(formData).some(val => val === '')) {
      Alert.alert("שגיאה", "נא למלא את כל השדות");
      return;
    }

    try {
      // כאן תבוא קריאת ה-API ל-JAVA
      const response = await fetch('http://YOUR_IP:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const success = await response.json(); // מקבל בוליאני מהשרת
      if (success) {
        Alert.alert("הצלחה", "החשבון נוצר בהצלחה!");
        navigation.navigate('Login');
      } else {
        Alert.alert("שגיאה", "ההרשמה נכשלה. ייתכן ושם המשתמש תפוס.");
      }
    } catch (error) {
      Alert.alert("שגיאה", "לא ניתן להתחבר לשרת");
    }
  };

  // שלב 1: מסך הסבר
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ברוכים הבאים ל-StegaShare</Text>
        </View>
        <ScrollView style={styles.explanationBox}>
          <Text style={styles.explanationText}>
            האפליקציה שלנו מאפשרת לך לשתף תמונות בצורה מאובטחת תוך שימוש בטכנולוגיית סטגנוגרפיה מתקדמת.{"\n\n"}
            * המידע שלך מוצפן בתוך הפיקסלים של התמונה.{"\n"}
            * רק המשתמש המורשה יוכל לחלץ את המסר הסודי.{"\n"}
            * פרטיותך היא בעדיפות עליונה אצלנו.
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNextStep}>
          <Text style={styles.buttonText}>אני מאשר וממשיך</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // שלב 2: טופס פרטים אישיים
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.formScroll}>
        <Text style={styles.formTitle}>פרטים אישיים</Text>
        
        <TextInput style={styles.input} placeholder="תעודת זהות" onChangeText={(t) => setFormData({...formData, id: t})} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="שם פרטי" onChangeText={(t) => setFormData({...formData, firstName: t})} />
        <TextInput style={styles.input} placeholder="טלפון" onChangeText={(t) => setFormData({...formData, phone: t})} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="אימייל" onChangeText={(t) => setFormData({...formData, email: t})} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="כתובת" onChangeText={(t) => setFormData({...formData, address: t})} />
        <TextInput style={styles.input} placeholder="תאריך לידה (DD/MM/YYYY)" onChangeText={(t) => setFormData({...formData, birthDate: t})} />
        
        <View style={styles.divider} />
        <Text style={styles.formTitle}>פרטי התחברות</Text>

        <TextInput style={styles.input} placeholder="שם משתמש" onChangeText={(t) => setFormData({...formData, username: t})} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="סיסמה" secureTextEntry onChangeText={(t) => setFormData({...formData, password: t})} />
        <TextInput style={styles.input} placeholder="אימות סיסמה" secureTextEntry onChangeText={(t) => setFormData({...formData, confirmPassword: t})} />

        <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
          <Text style={styles.buttonText}>סיום הרשמה</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { marginTop: 60, marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6200EE' },
  explanationBox: { backgroundColor: '#F9F9F9', padding: 20, borderRadius: 15, marginBottom: 20 },
  explanationText: { fontSize: 16, lineHeight: 24, textAlign: 'right', color: '#333' },
  formScroll: { paddingBottom: 50 },
  formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#6200EE', textAlign: 'right' },
  input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 10, marginBottom: 15, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 20 },
  primaryButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 12, alignItems: 'center' },
  submitButton: { backgroundColor: '#03DAC6', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default RegisterScreen;