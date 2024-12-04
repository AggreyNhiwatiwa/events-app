import styles from './styles';
import { View } from 'react-native';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen></LoginScreen>
    </View>
  );
}
