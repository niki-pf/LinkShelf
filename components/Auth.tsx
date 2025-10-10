import { useState } from "react";
import { Alert, View, Text, Image } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    else Alert.alert("Check your inbox for verification email!");
    setLoading(false);
  }

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/logotyp.png")}
        style={{ width: 300, height: 300 }}
        resizeMode="contain"
      />

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Save and organize your links
      </Text>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="email@example.com"
        inputContainerStyle={{ width: "90%" }}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholder="Password"
        inputContainerStyle={{ width: "90%" }}
      />

      <Button
        title="Sign in"
        onPress={signIn}
        disabled={loading}
        containerStyle={{ width: "100%", marginTop: 10 }}
      />
      <Button
        title="Sign up"
        onPress={signUp}
        disabled={loading}
        type="outline"
        containerStyle={{ width: "100%", marginTop: 10 }}
      />
    </View>
  );
}
