import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../components/Header";
import { PrimaryButton } from "../components/PrimaryButton";
import { MenuItem } from "../components/MenuItem";
import { useAuth, useWishlist } from "../store/hooks";
import { TabScreenProps } from "../navigation/types";
import { colors, radius } from "../theme";

export function AccountScreen({ navigation }: TabScreenProps<"Account">) {
  const { user, isLoggedIn, signOut } = useAuth();
  const { ids } = useWishlist();

  return (
    <View style={styles.container}>
      <Header title="👤 Tài khoản" />
      <ScrollView contentContainerStyle={styles.content}>
        {isLoggedIn && user ? (
          <View style={styles.profile}>
            <Text style={styles.avatar}>🙂</Text>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            {user.phone ? <Text style={styles.email}>📞 {user.phone}</Text> : null}
            <Pressable onPress={() => navigation.navigate("EditProfile")} style={styles.editBtn}>
              <Text style={styles.editText}>✎ Chỉnh sửa</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.profile}>
            <Text style={styles.avatar}>🔒</Text>
            <Text style={styles.name}>Bạn chưa đăng nhập</Text>
            <View style={styles.actions}>
              <PrimaryButton title="Đăng nhập" onPress={() => navigation.navigate("Login")} />
              <PrimaryButton title="Đăng ký" variant="outline" onPress={() => navigation.navigate("Register")} />
            </View>
          </View>
        )}

        <View style={styles.menu}>
          <MenuItem emoji="🧾" label="Đơn hàng của tôi" onPress={() => navigation.navigate("Orders")} />
          <MenuItem emoji="🔔" label="Thông báo" onPress={() => navigation.navigate("Notifications")} />
          <MenuItem emoji="❤️" label="Danh sách yêu thích" hint={ids.length ? `${ids.length} sách` : undefined} onPress={() => navigation.navigate("Wishlist")} />
        </View>

        {isLoggedIn && (
          <View style={styles.actions}>
            <PrimaryButton title="Đăng xuất" variant="outline" onPress={signOut} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14 },
  profile: { alignItems: "center", gap: 6, paddingVertical: 8 },
  avatar: { fontSize: 64 },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  email: { color: colors.muted },
  // BÀI 9.4c — style nút "✎ Chỉnh sửa"
  editBtn: { marginTop: 6, paddingHorizontal: 16, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.indigo },
  editText: { color: colors.indigo, fontWeight: "800" },
  menu: { gap: 8 },
  actions: { alignSelf: "stretch", gap: 10, marginTop: 6 },
});
