import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import EmailInput from '../../common/EmailInput';
import PasswordInput from '../../common/PasswordInput';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  
  const handleEmailChange = (text) => {
    setForm({ ...form, email: text });
    validateForm(text, form.password);
  };
  
  const handlePasswordChange = (text) => {
    setForm({ ...form, password: text });
    validateForm(form.email, text);
  };
  
  const validateForm = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = emailRegex.test(email);
    setEmailValid(emailIsValid);
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    const passwordIsValid = passwordRegex.test(password);
    setPasswordValid(passwordIsValid);
    
    setIsFormValid(emailIsValid && passwordIsValid);
  };
  
  const handleLogin = async () => {
  if (isFormValid) {
    try {
      const response = await fetch('http://172.20.10.2:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command: 'login',
          data: {
            email: form.email,
            password: form.password
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
      } else {
        Alert.alert("Login failed", result.message || "User not found.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    }
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#d3d3d3' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={{ uri: 'https://haraayonot.com/wp-content/uploads/2016/08/Logo.png' }} />

          <Text style={styles.title}>
            Sign in to <Text style={{ color: '#075eec' }}>MyApp</Text>
          </Text>

          <Text style={styles.subtitle}>
            Welcome to the app
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>

            <EmailInput
              value={form.email}
              onChangeText={handleEmailChange}
              placeholder="example@example.com"
              style={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <PasswordInput
              value={form.password}
              onChangeText={handlePasswordChange}
              placeholder="********"
              style={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={!isFormValid}>
              <View style={[
                styles.btn,
                !isFormValid && styles.btnDisabled
              ]}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
                navigation.navigate('ForgotPassword');
            }}>
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
            navigation.navigate('Register');
        }}>
        <Text style={styles.formFooter}>
          Don't have an account?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnDisabled: {
    backgroundColor: '#a9c0e9',
    borderColor: '#a9c0e9',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});