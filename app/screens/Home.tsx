import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, TextInput, Pressable,TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    // هنا تعريف الـ state داخل الـ component
    const [searchText, setSearchText] = useState("");
    const [isSearchVisible, setSearchVisible] = useState(false);

    return (
        <View style={styles.container}>
               <TouchableOpacity onPress={() => setSearchVisible(!isSearchVisible)}>
          <FontAwesome name="search" size={24} color="#0A505B" />
        </TouchableOpacity>
            {isSearchVisible && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                        placeholder="Search products..."
                        placeholderTextColor="#888"
                    />
                </View>
            )}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Pressable onPress={() => console.log('Add to cart pressed')}>
                                <Icon name="plus" size={20} color="#000" />
                            </Pressable>
                        </View>
                    </Card>
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
    },
    searchInput: {
        height: 40,
        borderColor: "#148B9C",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 14,
        color: "#333",
    },
});

export default ProductList;
