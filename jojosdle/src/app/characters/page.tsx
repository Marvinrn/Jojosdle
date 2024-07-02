"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface Character {
  id: string;
  name: string;
  image: string;
  nationality: string;
  family: string;
  chapter: string;
  living: boolean;
  isHuman: boolean;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [displayedCharacters, setDisplayedCharacters] = useState<Character[]>(
    []
  );
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [randomCharacter, setRandomCharacter] = useState<Character | null>(
    null
  );

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(
          "https://stand-by-me.herokuapp.com/api/v1/characters"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        const data = await response.json();
        setCharacters(data);
        //
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomCharacter(data[randomIndex]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchCharacters();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredCharacters([]);
    } else {
      const filtered = characters.filter((char) =>
        char.name.toLowerCase().includes(query)
      );
      // Filter out characters that are already displayed
      const filteredWithoutDisplayed = filtered.filter(
        (char) => !displayedCharacters.find((c) => c.id === char.id)
      );
      setFilteredCharacters(filteredWithoutDisplayed);
    }
  };

  const handleSelectCharacter = (char: Character) => {
    setFilteredCharacters([]);
    setSearchQuery("");
    setDisplayedCharacters((prevCharacters) => {
      // Check if the character is already in the displayedCharacters array
      if (prevCharacters.find((c) => c.id === char.id)) {
        return prevCharacters;
      }
      return [char, ...prevCharacters];
    });
    compareWithRandomCharacter(char);
  };

  const compareWithRandomCharacter = (char: Character) => {
    // Compare selected character with random character
    if (randomCharacter) {
      let matches: string[] = [];
      let partiallyMatchedProperties: string[] = [];

      // Compare properties
      if (char.id == randomCharacter.id) matches.push("ID");
      if (char.name == randomCharacter.name) matches.push("Name");
      if (char.image == randomCharacter.image) matches.push("Image");
      if (char.nationality == randomCharacter.nationality)
        matches.push("Nationality");
      if (char.living == randomCharacter.living) matches.push("Living");
      if (char.isHuman == randomCharacter.isHuman) matches.push("Human");
      // Handle special cases or partial matches
      if (char.family == randomCharacter.family) {
        matches.push("Family");
      } else if (char.family && randomCharacter.family) {
        partiallyMatchedProperties.push("Family");
      }
      if (char.chapter === randomCharacter.chapter) {
        matches.push("Chapter");
      } else if (char.chapter && randomCharacter.chapter) {
        partiallyMatchedProperties.push("Chapter");
      }

      // Log the results
      if (matches.length > 0) {
        console.log(`Matched properties: ${matches.join(", ")}`);
      }
      if (partiallyMatchedProperties.length > 0) {
        console.log(
          `Partially matched properties: ${partiallyMatchedProperties.join(
            ", "
          )}`
        );
      }
      if (matches.length === 0 && partiallyMatchedProperties.length === 0) {
        console.log("No properties matched. Keep guessing!");
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Guess the Character</h1>
      {randomCharacter && (
        <div>
          <p>Try to guess which character was randomly picked!</p>
          <p>Hint: {randomCharacter.name}</p>
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Search character..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {filteredCharacters.length > 0 && (
          <ul>
            {filteredCharacters.map((char) => (
              <li key={char.id} onClick={() => handleSelectCharacter(char)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <Image
                      src={`https://jojos-bizarre-api.netlify.app/assets/${char.image}`}
                      alt={char.name}
                      width={50}
                      height={50}
                    />
                  </div>
                  <div style={{ marginLeft: "10px" }}>{char.name}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {displayedCharacters.length > 0 && (
        <div>
          {displayedCharacters.map((char) => (
            <div key={char.id} style={{ marginBottom: "20px" }}>
              <h2>{char.name}</h2>
              <p>Nationality: {char.nationality}</p>
              <p>Family: {char.family}</p>
              <p>Chapter: {char.chapter}</p>
              <p>Living: {char.living ? "Yes" : "No"}</p>
              <p>Human: {char.isHuman ? "Yes" : "No"}</p>
              <Image
                src={`https://jojos-bizarre-api.netlify.app/assets/${char.image}`}
                alt={char.name}
                width={500}
                height={500}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
