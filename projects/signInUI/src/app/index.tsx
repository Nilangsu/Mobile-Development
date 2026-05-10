import { Text, View, StyleSheet, Image, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("@/assets/images/UIicon.png")}
        style={styles.logo}
      ></Image>

      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Let's experience the joy of telecare AI.</Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require("@/assets/images/email.png")}
          style={styles.inputIcon}
        />
        <TextInput
          placeholder="Enter your email..."
          placeholderTextColor="#999"
          style={styles.textInput}
        />
      </View>
      
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require("@/assets/images/password.png")}
          style={styles.inputIcon}
        />

        <TextInput
          secureTextEntry
          placeholder="Enter your password..."
          placeholderTextColor="#999"
          style={styles.textInput}
        />

        <Image
          source={require("@/assets/images/passwordHide.png")}
          style={styles.inputIcon}
        />
      </View>
      
      <Pressable
        style={({ pressed }) => [
          styles.signInBtn,
          pressed && styles.signInBtnPressed,
        ]}
      >
        <Text style={styles.signInText}>Sign In →</Text>
      </Pressable>

      <View style={styles.socialContainer}>
        <Pressable style={({ pressed }) => [
          styles.socialBtn,
          pressed && styles.socialBtnPressed,
        ]}>
          <Image
            source={require("@/assets/images/facebook.png")}
            style={styles.socialIcon}
          />
        </Pressable>

        <Pressable style={({ pressed }) => [
          styles.socialBtn,
          pressed && styles.socialBtnPressed,
        ]}>
          <Image
            source={require("@/assets/images/google.png")}
            style={styles.socialIcon}
          />
        </Pressable>

        <Pressable style={({ pressed }) => [
          styles.socialBtn,
          pressed && styles.socialBtnPressed,
        ]}>
          <Image
            source={require("@/assets/images/instagram.png")}
            style={styles.socialIcon}
          />
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
        <Pressable>
          <Text style={styles.link}>Sign Up.</Text>
        </Pressable>
      </View>
      
      <Pressable>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </Pressable>
        
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 28,
    alignItems: "center",
    paddingTop: 30,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#222",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#777",
    marginTop: 8,
    marginBottom: 35,
  },

  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    marginTop: 10,
  },

  inputContainer: {
    width: "100%",
    height: 58,
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#A6D63F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  inputIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#222",
  },

  signInBtn: {
    width: "100%",
    height: 58,
    backgroundColor: "#95D51C",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 35,
  },

  signInText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  socialContainer: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 35,
  },

  socialBtn: {
    width: 58,
    height: 58,
    backgroundColor: "#FFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },

  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  bottomRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  bottomText: {
    fontSize: 14,
    color: "#555",
  },

  link: {
    fontSize: 14,
    color: "#95D51C",
    fontWeight: "600",
  },

  forgotText: {
    fontSize: 14,
    color: "#95D51C",
    textDecorationLine: "underline",
  },
  signInBtnPressed: {
    backgroundColor: "#7DB514",
    transform: [{ scale: 0.98 }],
  },

  socialBtnPressed: {
    backgroundColor: "#EAEAEA",
    transform: [{ scale: 0.95 }],
  },
});
