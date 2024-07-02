"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CharacterList from "./charactersList"; // Ensure correct import casing
import { CharacterProperties } from "./CharacterProperties";

const CharacterFetch: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterProperties[]>([]);
  const [displayedCharacters, setDisplayedCharacters] = useState<
    CharacterProperties[]
  >([]);
  const [filteredCharacters, setFilteredCharacters] = useState<
    CharacterProperties[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [randomCharacter, setRandomCharacter] =
    useState<CharacterProperties | null>(null);
  const [searchDisabled, setSearchDisabled] = useState<boolean>(false);

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

  useEffect(() => {
    if (randomCharacter) {
      // Check if the selected character matches the random character
      const isMatch = displayedCharacters.some(
        (c) => c.id === randomCharacter.id
      );
      setSearchDisabled(isMatch);
    }
  }, [randomCharacter, displayedCharacters]);

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

  const handleSelectCharacter = (char: CharacterProperties) => {
    setFilteredCharacters([]);
    setSearchQuery("");
    setSearchDisabled(false); // Enable search bar

    setDisplayedCharacters((prevCharacters) => {
      if (prevCharacters.find((c) => c.id === char.id)) {
        return prevCharacters;
      }
      // Ensure each character in displayedCharacters has its own comparisonResults
      const newCharacter = { ...char, comparisonResults: {} };
      compareWithRandomCharacter(newCharacter);
      return [newCharacter, ...prevCharacters];
    });
  };

  const compareWithRandomCharacter = (char: CharacterProperties) => {
    if (randomCharacter) {
      const results: {
        [key: string]: "match" | "partial" | "no-match" | undefined;
      } = {};

      if (char.id === randomCharacter.id) results["image"] = "match";
      if (char.name === randomCharacter.name) results["name"] = "match";
      if (char.image === randomCharacter.image) results["image"] = "match";
      if (char.nationality === randomCharacter.nationality)
        results["nationality"] = "match";
      if (char.living === randomCharacter.living) results["living"] = "match";
      if (char.isHuman === randomCharacter.isHuman)
        results["isHuman"] = "match";

      //// special case for family partially matching property
      if (char.family === randomCharacter.family) {
        results["family"] = "match";
      } else if (char.family && randomCharacter.family) {
        const charFamilies = char.family.split(",").map((ch) => ch.trim());
        const randomCharFamilies = randomCharacter.family
          .split(",")
          .map((ch) => ch.trim());

        const commonFamilies = charFamilies.filter((family) =>
          randomCharFamilies.includes(family)
        );

        if (commonFamilies.length > 0) {
          results["family"] = "partial";
        }
      }

      //// special case for chapter partially matching property
      if (char.chapter === randomCharacter.chapter) {
        results["chapter"] = "match";
      } else if (char.chapter && randomCharacter.chapter) {
        const charChapters = char.chapter.split(",").map((ch) => ch.trim());
        const randomCharChapters = randomCharacter.chapter
          .split(",")
          .map((ch) => ch.trim());

        const commonChapters = charChapters.filter((chapter) =>
          randomCharChapters.includes(chapter)
        );

        if (commonChapters.length > 0) {
          results["chapter"] = "partial";
        }
      }

      // Set comparison results for the selected character
      setDisplayedCharacters((prevCharacters) =>
        prevCharacters.map((c) =>
          c.id === char.id ? { ...c, comparisonResults: results } : c
        )
      );
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
          disabled={searchDisabled}
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
