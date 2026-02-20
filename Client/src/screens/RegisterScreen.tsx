import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform, Alert, Image, ActivityIndicator 
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '../api/Constants';

const RegisterScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1); 
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: '', firstName: '', phone: '', email: '', 
    address: '', birthDate: '', username: '', 
    password: '', confirmPassword: '',
    userImage: '' // שדה לתמונה ב-Base64
  });

  const [errors, setErrors] = useState<any>({});

  // פונקציה לבחירת תמונה - משופרת
  const pickImage = () => {
    launchImageLibrary({ 
      mediaType: 'photo', 
      includeBase64: true,
      maxWidth: 500, // הגבלת גודל כדי לא להכביד על ה-DB
      maxHeight: 500,
      quality: 0.7 
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        Alert.alert("שגיאה", "לא ניתן לגשת לגלריה");
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setProfileImage(asset.uri || null);
        setFormData({ ...formData, userImage: asset.base64 || '' });
      }
    });
  };

  const validateID = (id: string) => {
    if (id.length !== 9 || isNaN(Number(id))) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = Number(id.charAt(i)) * ((i % 2) + 1);
      sum += num > 9 ? num - 9 : num;
    }
    return sum % 10 === 0;
  };

  const handleRegister = async () => {
    let currentErrors: any = {};

    // ולידציה בסיסית
    if (!validateID(formData.id)) currentErrors.id = "תעודת זהות לא תקינה";
    if (formData.firstName.trim().length < 2) currentErrors.firstName = "שם קצר מדי";
    if (!/^\d{10}$/.test(formData.phone)) currentErrors.phone = "טלפון חייב להכיל 10 ספרות";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) currentErrors.email = "אימייל לא תקין";
    
    const dateParts = formData.birthDate.split('/');
    if (dateParts.length !== 3 || formData.birthDate.length !== 10) {
      currentErrors.birthDate = "פורמט תקין: DD/MM/YYYY";
    }

    if (formData.password.length < 6) currentErrors.password = "סיסמה קצרה מדי";
    if (formData.password !== formData.confirmPassword) currentErrors.confirmPassword = "אין התאמה בסיסמה";

    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setLoading(true);
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const dataToSend = { ...formData, birthDate: formattedDate };

    try {
      // תיקון: שימוש ב-Backticks והורדת /api אם הוא כבר קיים ב-BASE_URL
      const response = await fetch(`${BASE_URL}/users/addnewUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json(); 
        Alert.alert("הצלחה", "החשבון נוצר בהצלחה!", [
          { text: "מעבר לתפריט", onPress: () => navigation.navigate('Menu', { userName: data.username }) }
        ]);
      } else {
        Alert.alert("שגיאה", "שם המשתמש או האימייל כבר קיימים במערכת.");
      }
    } catch (error) {
      Alert.alert("שגיאה", "חיבור לשרת נכשל. וודא שה-Backend רץ בכתובת 10.0.2.2");
    } finally {
      setLoading(false);
    }
  };

  // תצוגת מסך הסבר (Step 1)
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center'}}>
            <MaterialCommunityIcons name="shield-check" size={100} color="#6200EE" style={{alignSelf: 'center'}} />
            <Text style={styles.title}>StegaShare</Text>
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>
                ברוכים הבאים! האפליקציה מאפשרת שיתוף תמונות מוצפנות בטכנולוגיית סטגנוגרפיה.{"\n\n"}
                המידע האישי שלך מוצפן ונשמר בפרטיות מוחלטת בשרתים המאובטחים שלנו.
              </Text>
            </View>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>אני מאשר וממשיך להרשמה</Text>
        </TouchableOpacity>
        <View style={{height: 40}} />
      </View>
    );
  }

  // תצוגת טופס הרשמה (Step 2)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-right" size={30} color="#6200EE" />
        </TouchableOpacity>
        <Text style={[styles.formTitle, {borderBottomWidth:0, marginVertical:0}]}>יצירת חשבון</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.selectedImage} />
            ) : (
              <MaterialCommunityIcons name="camera-plus" size={50} color="#6200EE" />
            )}
          </TouchableOpacity>
          <Text style={styles.addPhotoText}>{profileImage ? "תמונה נבחרה ✅" : "הוסף תמונת פרופיל"}</Text>
        </View>

        <Text style={styles.label}>תעודת זהות</Text>
        <TextInput style={[styles.input, errors.id && styles.inputError]} placeholder="9 ספרות" value={formData.id} onChangeText={(t) => setFormData({...formData, id: t})} keyboardType="numeric" maxLength={9} />
        {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}

        <Text style={styles.label}>שם מלא</Text>
        <TextInput style={[styles.input, errors.firstName && styles.inputError]} placeholder="שם פרטי ומשפחה" value={formData.firstName} onChangeText={(t) => setFormData({...formData, firstName: t})} />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
            <View style={{width: '48%'}}>
                <Text style={styles.label}>טלפון</Text>
                <TextInput style={[styles.input, errors.phone && styles.inputError]} placeholder="05XXXXXXXX" value={formData.phone} onChangeText={(t) => setFormData({...formData, phone: t})} keyboardType="phone-pad" maxLength={10} />
            </View>
            <View style={{width: '48%'}}>
                <Text style={styles.label}>תאריך לידה</Text>
                <TextInput style={[styles.input, errors.birthDate && styles.inputError]} placeholder="DD/MM/YYYY" value={formData.birthDate} onChangeText={(t) => setFormData({...formData, birthDate: t})} />
            </View>
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}

        <Text style={styles.label}>אימייל</Text>
        <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="example@mail.com" value={formData.email} onChangeText={(t) => setFormData({...formData, email: t})} keyboardType="email-address" autoCapitalize="none" />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.divider} />

        <Text style={styles.label}>שם משתמש</Text>
        <TextInput style={[styles.input, errors.username && styles.inputError]} placeholder="שם אנגלי להתחברות" value={formData.username} onChangeText={(t) => setFormData({...formData, username: t})} autoCapitalize="none" />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        <Text style={styles.label}>סיסמה</Text>
        <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="לפחות 6 תווים" secureTextEntry value={formData.password} onChangeText={(t) => setFormData({...formData, password: t})} />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Text style={styles.label}>אימות סיסמה</Text>
        <TextInput style={[styles.input, errors.confirmPassword && styles.inputError]} placeholder="הקלד שוב" secureTextEntry value={formData.confirmPassword} onChangeText={(t) => setFormData({...formData, confirmPassword: t})} />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity 
          style={[styles.primaryButton, loading && {backgroundColor: '#B39DDB'}]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>צור חשבון עכשיו</Text>}
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  topHeader: { marginTop: Platform.OS === 'ios' ? 50 : 20, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  backButton: { padding: 5 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#6200EE', textAlign: 'center', marginBottom: 10 },
  explanationBox: { backgroundColor: '#F3E5F5', padding: 25, borderRadius: 20, marginVertical: 10 },
  explanationText: { fontSize: 17, lineHeight: 26, textAlign: 'center', color: '#4A148C' },
  profileImageContainer: { alignItems: 'center', marginVertical: 15 },
  imageCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 3, borderColor: '#6200EE' },
  selectedImage: { width: '100%', height: '100%' },
  addPhotoText: { color: '#6200EE', fontWeight: 'bold', fontSize: 14, marginTop: 8 },
  formScroll: { paddingBottom: 30 },
  formTitle: { fontSize: 24, fontWeight: 'bold', color: '#6200EE', textAlign: 'right' },
  label: { textAlign: 'right', fontWeight: 'bold', marginTop: 12, color: '#444', fontSize: 15 },
  input: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 12, marginTop: 5, textAlign: 'right', fontSize: 16, borderWidth: 1, borderColor: '#EEE' },
  inputError: { borderColor: '#D32F2F', backgroundColor: '#FFF5F5' },
  errorText: { color: '#D32F2F', fontSize: 12, textAlign: 'right', marginTop: 3 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  primaryButton: { backgroundColor: '#6200EE', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});

export default RegisterScreen;