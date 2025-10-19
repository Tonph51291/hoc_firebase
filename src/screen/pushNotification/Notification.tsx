import React, { useEffect } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';

/**
 * Xin quyền gửi thông báo
 */
async function requestNotificationPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted');
    } else {
      console.warn('⚠️ Notification permission denied');
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
  }
}

/**
 * Lấy token FCM
 */
async function fetchFcmToken() {
  try {
    const token = await messaging().getToken();
    console.log('🔥 FCM Token:', token);

    // Gửi token lên server nếu có backend
    return token;
  } catch (error) {
    console.error('❌ Failed to get FCM token:', error);
    return null;
  }
}

/**
 * Lắng nghe tin nhắn khi app đang mở
 */
function listenForForegroundMessages() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    const { title, body } = remoteMessage.notification || {};
    if (title && body) {
      Alert.alert(title, body);
    }
  });

  return unsubscribe;
}

/**
 * App chính
 */
const Notification = () => {
  useEffect(() => {
    requestNotificationPermission();
    fetchFcmToken();

    const unsubscribe = listenForForegroundMessages();
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Cloud Messaging Demo</Text>
      <Text style={styles.subtitle}>
        Hãy gửi thử thông báo từ Firebase Console!
      </Text>
    </View>
  );
};

export default Notification;

/**
 * Style chuẩn React Native
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
  },
});
