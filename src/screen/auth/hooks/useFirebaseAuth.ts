import { useCallback } from 'react';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  age: number;
  phone: string;
}

export const useFirebaseAuth = () => {
  const navigation = useAppNavigation();

  const handleGoRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleRegister = useCallback(
    async ({ username, email, password, age, phone }: RegisterData) => {
      try {
        // Tạo tài khoản
        const userCredential = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const user = userCredential.user;

        // Cập nhật tên hiển thị
        await user.updateProfile({ displayName: username });

        // Lưu thông tin vào Firestore
        await firestore().collection('users').doc(user.uid).set({
          username,
          email,
          age,
          phone,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        Alert.alert('Thành công', 'Tài khoản đã được tạo!');
        navigation.navigate('Login');
      } catch (error: any) {
        console.log('Register error:', error);
        Alert.alert('Lỗi đăng ký', error.message);
      }
    },
    [navigation],
  );
  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Lấy token đăng nhập hiện tại
      const idToken = await user.getIdToken();

      console.log('Đăng nhập thành công!');
      console.log('User ID:', user.uid);
      console.log('Token:', idToken);

      // Nếu bạn muốn, có thể lưu token vào AsyncStorage
      // await AsyncStorage.setItem('userToken', idToken);

      return { user, idToken };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Không tìm thấy tài khoản.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Sai mật khẩu.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Email không hợp lệ.');
      } else {
        console.error('Login error:', error);
      }
    }
  };

  return { handleRegister, handleGoRegister, handleLogin };
};
