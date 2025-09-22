import { Text, View, Button } from "react-native";
import { useSession } from "../../context/SessionProvider";

const Profile = () => {
  const { signOut, user } = useSession();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Text>Profile Screen</Text>
      {user && <Text>Welcome, {user.email}</Text>}
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default Profile;
