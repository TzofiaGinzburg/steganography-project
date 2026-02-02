import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Platform, Alert, Image 
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const RegisterScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1); 
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '', firstName: '', phone: '', email: '', 
    address: '', birthDate: '', username: '', 
    password: '', confirmPassword: '',
    userImage: '' // שדה לתמונה ב-Base64
  });

  const [errors, setErrors] = useState<any>({});

  // פונקציה לבחירת תמונה
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setProfileImage(asset.uri);
          setFormData({ ...formData, userImage: asset.base64 || '' });
        }
      }
    });
  };

  // בדיקת ספרת ביקורת בת"ז
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

    // ולידציה תאריך
    const dateParts = formData.birthDate.split('/');
    if (dateParts.length !== 3 || formData.birthDate.length !== 10) {
      currentErrors.birthDate = "נא להזין תאריך בפורמט DD/MM/YYYY";
    }

    // ולידציה ת"ז
    if (!validateID(formData.id)) currentErrors.id = "תעודת זהות לא תקינה";

    // ולידציה שם
    if (formData.firstName.trim().length < 2) currentErrors.firstName = "שם קצר מדי";

    // ולידציה טלפון
    if (!/^\d{10}$/.test(formData.phone)) currentErrors.phone = "טלפון חייב להכיל 10 ספרות";

    // ולידציה אימייל
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) currentErrors.email = "אימייל לא תקין";

    // ולידציה סיסמה
    if (formData.password.length < 6) currentErrors.password = "סיסמה חייבת להכיל 6 תווים";
    if (formData.password !== formData.confirmPassword) currentErrors.confirmPassword = "הסיסמאות לא תואמות";

    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    // המרת תאריך לפורמט שרת: YYYY-MM-DD
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const dataToSend = {
      ...formData,
      birthDate: formattedDate
    };

    try {
      const response = await fetch('http://192.168.1.112:8080/api/users/addnewUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
// נניח ש-data הוא האובייקט שחזר מהשרת
      if (response.ok) {
      // 1. קודם כל שולפים את הנתונים מהתשובה (זה מעלים את האדום!)
      const data = await response.json(); 

      // 2. עכשיו משתמשים ב-data בתוך הניווט
      Alert.alert("הצלחה", "החשבון נוצר!", [
        { 
          text: "אוקיי", 
          onPress: () => navigation.navigate('Menu', { userName: data.username }) 
        }
      ]);

    } else {
      Alert.alert("שגיאה", "השרת דחה את הבקשה.");
    }
    } catch (error) {
      Alert.alert("שגיאה", "חיבור לשרת נכשל");
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ברוכים הבאים ל-StegaShare</Text>
        <ScrollView style={styles.explanationBox}>
          <Text style={styles.explanationText}>
            האפליקציה מאפשרת לך לשתף תמונות מוצפנות.{"\n\n"}
            המידע נשמר בפרטיות מוחלטת.
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>אני מאשר וממשיך</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-right" size={30} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.selectedImage} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={90} color="#DDD" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <Text style={styles.addPhotoText}>{profileImage ? "החלף תמונה" : "הוסף תמונה"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.formTitle}>פרטים אישיים</Text>

        <Text style={styles.label}>תעודת זהות</Text>
        <TextInput style={[styles.input, errors.id && styles.inputError]} placeholder="9 ספרות" value={formData.id} onChangeText={(t) => setFormData({...formData, id: t})} keyboardType="numeric" />
        {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}

        <Text style={styles.label}>שם פרטי</Text>
        <TextInput style={[styles.input, errors.firstName && styles.inputError]} placeholder="הכנס שם מלא" value={formData.firstName} onChangeText={(t) => setFormData({...formData, firstName: t})} />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <Text style={styles.label}>טלפון</Text>
        <TextInput style={[styles.input, errors.phone && styles.inputError]} placeholder="0500000000" value={formData.phone} onChangeText={(t) => setFormData({...formData, phone: t})} keyboardType="phone-pad" />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={styles.label}>אימייל</Text>
        <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="email@example.com" value={formData.email} onChangeText={(t) => setFormData({...formData, email: t})} keyboardType="email-address" autoCapitalize="none" />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text style={styles.label}>כתובת</Text>
        <TextInput style={[styles.input, errors.address && styles.inputError]} placeholder="עיר, רחוב ומספר" value={formData.address} onChangeText={(t) => setFormData({...formData, address: t})} />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <Text style={styles.label}>תאריך לידה</Text>
        <TextInput style={[styles.input, errors.birthDate && styles.inputError]} placeholder="DD/MM/YYYY" value={formData.birthDate} onChangeText={(t) => setFormData({...formData, birthDate: t})} />
        {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}

        <View style={styles.divider} />
        <Text style={styles.formTitle}>פרטי התחברות</Text>

        <Text style={styles.label}>שם משתמש</Text>
        <TextInput style={[styles.input, errors.username && styles.inputError]} placeholder="לפחות 4 תווים" value={formData.username} onChangeText={(t) => setFormData({...formData, username: t})} autoCapitalize="none" />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        <Text style={styles.label}>סיסמה</Text>
        <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="לפחות 6 תווים" secureTextEntry value={formData.password} onChangeText={(t) => setFormData({...formData, password: t})} />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Text style={styles.label}>אימות סיסמה</Text>
        <TextInput style={[styles.input, errors.confirmPassword && styles.inputError]} placeholder="הקלד שוב" secureTextEntry value={formData.confirmPassword} onChangeText={(t) => setFormData({...formData, confirmPassword: t})} />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>סיום הרשמה</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  topHeader: { marginTop: Platform.OS === 'ios' ? 50 : 20, flexDirection: 'row', justifyContent: 'flex-start', width: '100%', zIndex: 10 },
  backButton: { padding: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#6200EE', marginTop: 10, textAlign: 'center' },
  explanationBox: { backgroundColor: '#F3E5F5', padding: 20, borderRadius: 15, marginVertical: 25 },
  explanationText: { fontSize: 16, lineHeight: 24, textAlign: 'right', color: '#4A148C' },
  profileImageContainer: { alignItems: 'center', marginVertical: 20 },
  imageCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#6200EE', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
  selectedImage: { width: '100%', height: '100%' },
  addPhotoButton: { marginTop: 10 },
  addPhotoText: { color: '#6200EE', fontWeight: 'bold', fontSize: 16 },
  formScroll: { paddingBottom: 60 },
  formTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, color: '#6200EE', textAlign: 'right', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5 },
  label: { textAlign: 'right', fontWeight: 'bold', marginTop: 15, color: '#333', fontSize: 14 },
  input: { backgroundColor: '#F5F5F5', padding: 14, borderRadius: 12, marginTop: 6, textAlign: 'right', fontSize: 16, color: '#000', borderWidth: 1, borderColor: 'transparent' },
  inputError: { borderColor: '#D32F2F', backgroundColor: '#FFEBEE' },
  errorText: { color: '#D32F2F', fontSize: 12, textAlign: 'right', marginTop: 4, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 25 },
  primaryButton: { backgroundColor: '#6200EE', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20, elevation: 4 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});

export default RegisterScreen;