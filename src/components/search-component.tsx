import {
    Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList
} from "react-native";
import { ProductResult } from "./product-result";
import { useState } from "react";

type SearchResult = {
  bin: {
    id: string;
    label: string;
    product: string;
  };
  rackId: string;
};

type WarehouseSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  results: SearchResult[];
  onResultPress: (binId: string) => void;
};

export function WarehouseSearch( {value,
  onChangeText,
  results,
  onResultPress,
}: WarehouseSearchProps) {

  const [showResults, setShowResults] = useState(false);




  return (
     <>
    {showResults && results.length > 0 && (
      <Pressable
        style={styles.backdrop}
        onPress={() => setShowResults(false)}
      />
    )}
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={(text) => {
  onChangeText(text);
  setShowResults(true);
}}


        placeholder="Search bin or product..."
        placeholderTextColor="#888"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {showResults && results.length > 0 && (<FlatList
      
  data={results}
  keyExtractor={(result) => result.bin.id}
  renderItem={({ item }) => (
    <Pressable
      onPress={() => {
  onResultPress(item.bin.id);
  setShowResults(false);
}}
      style={styles.result}
    >
      <ProductResult
        product={item.bin.product}
        location={item.bin.id}
      />
    </Pressable>
  )}
  style={styles.results}
  showsVerticalScrollIndicator
  keyboardShouldPersistTaps="handled"
/>)}

      
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 16,
    left: 16,

    width: 180,

    zIndex: 10,
    elevation: 10,
  },

  input: {
    height: 46,

    paddingHorizontal: 14,

    backgroundColor: "white",

    borderRadius: 10,

    fontSize: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 5,
  },
   results: {
    maxHeight: 350,
  },

  result: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  product: {
    fontSize: 15,
    fontWeight: "600",
  },

  location: {
    marginTop: 3,
    fontSize: 13,
    color: "#555",
  },

  type: {
    marginTop: 2,
    fontSize: 12,
    color: "#888",
  },

  backdrop: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  

  zIndex: 5,
},
});