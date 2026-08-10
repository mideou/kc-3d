import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { BinData } from '../data/data';

type BinInfoPanelProps = {
  bin: BinData | null;
};

export function BinInfoPanel({
  bin,
}: BinInfoPanelProps) {
  if (!bin) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bin
      </Text>

      <Text style={styles.id}>
        {bin.id}
      </Text>

      <View style={styles.separator} />

      <Text style={styles.label}>
        Product
      </Text>

      <Text style={styles.value}>
        {bin.product}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    right: 16,
    top: 16,

    width: 180,

    padding: 16,

    backgroundColor: "white",

    borderRadius: 12,

    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  id: {
    marginTop: 4,

    fontSize: 14,

    color: "#555",
  },

  separator: {
    height: 1,

    backgroundColor: "#ddd",

    marginVertical: 12,
  },

  label: {
    marginTop: 8,

    fontSize: 12,

    color: "#777",
  },

  value: {
    marginTop: 2,

    fontSize: 15,

    fontWeight: "600",
  },
});