import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  app: {
    height: "100%",
    backgroundColor: "#060606",
  },
  icon: { color: "#F5F5F5", fontSize: 17, marginTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 55,
    marginBottom: 50,
  },
  selectors: {
    flexDirection: "row",
    marginLeft: 10,
  },
  isSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
    paddingBottom: 4,
  },
  rightIcon: {
    fontSize: 100,
    color: "#FFF",
    opacity: 0.5,
    position: "absolute",
    right: 15,
    top: "25%",
  },
});
