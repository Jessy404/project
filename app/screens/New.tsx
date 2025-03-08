import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, FlatList, Text, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { Card } from 'react-native-paper';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const products = [
    { id: '1', name: 'Insulin', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
    { id: '2', name: 'Metformin', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
    { id: '3', name: 'Losartan', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
    { id: '4', name: 'Amlodipine', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
    { id: '5', name: 'Atorvastatin', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
    { id: '6', name: 'Levothyroxine', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
    { id: '7', name: 'Hydrochlorothiazide', image: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15900/gettyimages-1342010434.jpg' },
];

const ProductList = () => {
    const [searchText, setSearchText] = useState("");
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    const reset = () => {
        router.replace('../(tabs)/new');
        console.log('Screen restarted');
      };

     const del = () => {
    //    products.pop(Item.id);
        console.log('item is deleted');
        products.filter(products=>products.id)

      };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    placeholder="Search products..."
                    placeholderTextColor="#888"
                />
            </View>


          <Pressable  style={styles.button} onPress={reset}>
            {/* pressed ? */}
            <Text> Reset </Text>
          </Pressable>

            
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable onPress={del}>
                    <Card style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Pressable onPress={() => console.log('Add to cart pressed')}>
                                <FontAwesome name="plus" size={20} color="#000" />
                            </Pressable>
                        </View>
                    </Card>
                    </Pressable>
                )}
            />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginBottom: 16,
        top: 20,
    },
    searchInput: {
        height: 40,
        borderColor: "#148B9C",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 14,
        color: "#333",
        backgroundColor: "#fff"
    },
    
  button: {
    marginTop: 40,
    marginBottom: 10,
    backgroundColor: "#062654",
    height: 45,
    // borderColor: "gray",
    // borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // borderRadius: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
});

export default ProductList;
