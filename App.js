import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function App() {
  
  const [pokemon, setpokemon] = useState([]);

  // Fonction pour récupérer la liste des Pokémon depuis l'API
  const getListPoke = () => {
    // Effectue une requête à l'API PokeAPI pour obtenir la liste des 48 premiers Pokémon
    fetch('https://pokeapi.co/api/v2/pokemon?limit=48')
      .then((response) => response.json())

      .then((pokemonData) => {

        const temporaryPokemon = [];

        // Récupère les données de chaque Pokémon individuellement 
        Promise.all(pokemonData.results.map((pokemon) => {
          return fetch(pokemon.url)
            .then((response) => response.json())
            .then((pokemonData) => {
              return temporaryPokemon.push(pokemonData);
            });
        })).then(() => {
          // Trie la liste par défaut (par ID)
          temporaryPokemon.sort((a, b) => a.id - b.id); 
          setpokemon(temporaryPokemon);
        });
      });
  }

  useEffect(() => {
    // Appel de getListPoke lors du montage du composant
    getListPoke();
  }, []);

  // Fonctions de tri
  const sortByname = () => {
    const sortedpokemon = [...pokemon];
    sortedpokemon.sort((a, b) => a.name.localeCompare(b.name));
    setpokemon(sortedpokemon);
  };

  const sortByType = () => {
    const sortedpokemon = [...pokemon];
    sortedpokemon.sort((a, b) => a.types[0].type.name.localeCompare(b.types[0].type.name));
    setpokemon(sortedpokemon);
  };

  const sortByWeight = () => {
    const sortedpokemon = [...pokemon];
    sortedpokemon.sort((a, b) => a.weight - b.weight);
    setpokemon(sortedpokemon);
  };

  const sortByHeight = () => {
    const sortedpokemon = [...pokemon];
    sortedpokemon.sort((a, b) => a.height - b.height);
    setpokemon(sortedpokemon);
  };

  const sortById = () => {
    const sortedpokemon = [...pokemon];
    sortedpokemon.sort((a, b) => a.id - b.id);
    setpokemon(sortedpokemon);
  };

  // La vue que l'on affiche dans l'application, structurée un peu comme du code HTML
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sortButtons}>
        <TouchableOpacity onPress={sortByname} style={styles.sortButton}>
          <Text>par nom</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortByType} style={styles.sortButton}>
          <Text>par type</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortByWeight} style={styles.sortButton}>
          <Text>par poids</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortByHeight} style={styles.sortButton}>
          <Text>par taille</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sortById} style={styles.sortButton}>
          <Text>par id</Text>
        </TouchableOpacity>
      </View>

      {pokemon.length > 0 ? pokemon.map((poke) => {
        return (
          <View style={styles.pokemon} key={poke.name}>
            <Image source={{ uri: poke.sprites.front_default }} style={{ width: 130, height: 100 }} />
            <Text style={styles.pokemonName}>Nom: {poke.name}</Text>
            {poke.types.map((a, index) => <Text style={styles.pokemonType} key={index}>Type : {a.type.name}</Text>)}
            <Text style={styles.pokemon}>Height: {poke.height}</Text>
            <Text style={styles.pokemon}>Weight: {poke.weight}</Text>
          </View>
        )
      }) : <Text>Chargement en cours...</Text>}
    </ScrollView>
  );
}

// Code CSS, nous permet de styliser les éléments

const styles = StyleSheet.create({
  pokemon: {
    display: "flex",
    justifyContent: 'center',
    alignContent: "center",
    textAlign: "center",
  },
  container: {
    marginTop: 40,
    paddingBottom: 60,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  sortButton: {
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  pokemonName: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: "center"
  },
  pokemonType: {
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: "center"
  },
});