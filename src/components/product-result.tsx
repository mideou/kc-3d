import { StyleSheet, Text, View } from "react-native";

type ProductResultProps = {
  product: string;
  location: string;
};

export function ProductResult({
  product,
  location,
}: ProductResultProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.product}>
        {product}
      </Text>

      <Text style={styles.location}>
        {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  product: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  location: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },
});