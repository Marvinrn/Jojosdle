"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface Character {
  id: string;
  name: string;
  japaneseName: string;
  image: string;
  abilities: string;
  nationality: string;
  catchphrase: string;
  family: string;
  chapter: string;
  living: boolean;
  isHuman: boolean;
}

export default function CharactersPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(
          "https://stand-by-me.herokuapp.com/api/v1/characters"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        const data = await response.json();
        const randomCharacter = data[Math.floor(Math.random() * data.length)];
        setCharacter(randomCharacter);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!character) {
    return <div>No character found</div>;
  }

  return (
    <div>
      <h1>Character</h1>
      <div key={character.id}>
        <h2>{character.name}</h2>
        <p>Japanese Name: {character.japaneseName}</p>
        <p>Abilities: {character.abilities}</p>
        <p>Nationality: {character.nationality}</p>
        <p>Catchphrase: {character.catchphrase}</p>
        <p>Family: {character.family}</p>
        <p>Chapter: {character.chapter}</p>
        <p>Living: {character.living ? "Yes" : "No"}</p>
        <p>Human: {character.isHuman ? "Yes" : "No"}</p>
        <Image
          src={`https://jojos-bizarre-api.netlify.app/assets/${character.image}`}
          alt={character.name}
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
