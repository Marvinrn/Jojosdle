"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CharacterList from "./charactersList";
import { CharacterPorperties } from "./characterProperties";

const CharacterFetch: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterPorperties[]>([]);
  const [displayedCharacters, setDisplayedCharacters] = useState<
    CharacterPorperties[]
  >([]);
  const [filteredCharacters, setFilteredCharacters] = useState<
    CharacterPorperties[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [randomCharacter, setRandomCharacter] =
    useState<CharacterPorperties | null>(null);

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
      const filteredWithoutDisplayed = filtered.filter(
        (char) => !displayedCharacters.find((c) => c.id === char.id)
      );
      setFilteredCharacters(filteredWithoutDisplayed);
    }
  };

  const handleSelectCharacter = (char: CharacterPorperties) => {
    setFilteredCharacters([]);
    setSearchQuery("");
    setDisplayedCharacters((prevCharacters) => {
      if (prevCharacters.find((c) => c.id === char.id)) {
        return prevCharacters;
      }
      return [char, ...prevCharacters];
    });
    compareWithRandomCharacter(char);
  };

  const compareWithRandomCharacter = (char: CharacterPorperties) => {
    if (randomCharacter) {
      const matches: string[] = [];
      const partiallyMatchedProperties: string[] = [];

      if (char.id === randomCharacter.id) matches.push("ID");
      if (char.name === randomCharacter.name) matches.push("Name");
      if (char.image === randomCharacter.image) matches.push("Image");
      if (char.nationality === randomCharacter.nationality)
        matches.push("Nationality");
      if (char.living === randomCharacter.living) matches.push("Living");
      if (char.isHuman === randomCharacter.isHuman) matches.push("Human");

      //// special case for family partially matching propertie
      if (char.family === randomCharacter.family) {
        matches.push("Family");
      } else if (char.family && randomCharacter.family) {
        // Split the chapter strings into arrays
        const charChapters = char.family.split(",").map((ch) => ch.trim());
        const randomCharChapters = randomCharacter.family
          .split(",")
          .map((ch) => ch.trim());

        // Check for any common chapters
        const commonChapters = charChapters.filter((family) =>
          randomCharChapters.includes(family)
        );

        // If there are common chapters, add "Chapter" to partiallyMatchedProperties
        if (commonChapters.length > 0) {
          partiallyMatchedProperties.push("family");
        }
      }

      //// special case for chapter partially matching propertie
      if (char.chapter === randomCharacter.chapter) {
        matches.push("Chapter");
      } else if (char.chapter && randomCharacter.chapter) {
        // Split the chapter strings into arrays
        const charChapters = char.chapter.split(",").map((ch) => ch.trim());
        const randomCharChapters = randomCharacter.chapter
          .split(",")
          .map((ch) => ch.trim());

        // Check for any common chapters
        const commonChapters = charChapters.filter((chapter) =>
          randomCharChapters.includes(chapter)
        );

        // If there are common chapters, add "Chapter" to partiallyMatchedProperties
        if (commonChapters.length > 0) {
          partiallyMatchedProperties.push("Chapter");
        }
      }

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
      <CharacterList
        displayedCharacters={displayedCharacters}
        handleSelectCharacter={handleSelectCharacter}
      />
    </div>
  );
};

export default CharacterFetch;
