import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
  },
  header: {
    paddingBottom: 20,
  },
  headerIcons: {
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',

  },
  headerInput: {
    paddingHorizontal: 20,
    marginBottom: 60,
    alignItems: "flex-end",
  },
  amountInput: {
    fontSize: 40,
    fontFamily: "Montserrat-Semibold",
    borderWidth: 0,
  },
})