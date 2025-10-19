import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

export default function Login() {
  const { handleGoRegister, handleLogin } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useCallback(async () => {
    await handleLogin(email, password);
  }, [email, handleLogin, password]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

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

      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Tạo tài khoản</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleGoRegister}>
        <Text style={styles.buttonText}> Đăng ký</Text>
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
