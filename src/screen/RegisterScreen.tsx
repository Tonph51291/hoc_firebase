import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ.');
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Tạo user bằng email/password
      const credential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );

      const user = credential.user;
      // Nếu muốn set displayName
      if (displayName) {
        await user.updateProfile({ displayName });
      }

      // Gửi email xác thực
      await user.sendEmailVerification();

      // (Tuỳ chọn) Lưu thông tin user vào Firestore
      try {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            email: user.email,
            displayName: user.displayName || null,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      } catch (e) {
        // Không bắt buộc — chỉ log nếu lỗi
        console.log('Firestore save user error:', e);
      }

      Alert.alert(
        'Đăng ký thành công',
        'Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.',
      );
      // reset form (tuỳ ý)
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error: any) {
      console.log('Register error:', error);
      // Map lỗi phổ biến
      let message = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      const code = error.code || error?.message;

      switch (code) {
        case 'auth/email-already-in-use':
          message = 'Email này đã được sử dụng.';
          break;
        case 'auth/invalid-email':
          message = 'Email không hợp lệ.';
          break;
        case 'auth/weak-password':
        case 'auth/weak-password':
          message = 'Mật khẩu quá yếu (ít nhất 6 ký tự).';
          break;
        case 'auth/network-request-failed':
          message = 'Lỗi mạng. Kiểm tra kết nối của bạn.';
          break;
        default:
          // nếu error.message có nội dung rõ ràng thì show
          if (error?.message) message = error.message;
      }

      Alert.alert('Đăng ký thất bại', message);
      console.log('lỗi', messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <TextInput
        placeholder="Tên hiển thị (tuỳ chọn)"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Mật khẩu (>= 6 ký tự)"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Tạo tài khoản</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
