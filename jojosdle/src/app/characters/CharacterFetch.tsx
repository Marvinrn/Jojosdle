"use client";

import React, { useState, useEffect } from "react";
import CharacterList from "./CharactersList";
import { CharacterProperties } from "./CharacterProperties";
import CharacterSearchInput from "./CharacterSearchInput";
import FilteredCharacterList from "./FilteredCharacterList";
import RandomCharacterHint from "./RandomCharacterHint";

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
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (randomCharacter) {
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
    setSearchDisabled(false);

    setDisplayedCharacters((prevCharacters) => {
      if (prevCharacters.find((c) => c.id === char.id)) {
        return prevCharacters;
      }
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

      const propertiesToCompare = [
        "image",
        "name",
        "nationality",
        "living",
        "isHuman",
        "family",
        "chapter",
      ];

      propertiesToCompare.forEach((prop) => {
        if (char[prop] === randomCharacter[prop]) {
          results[prop] = "match";
        } else if (char[prop] && randomCharacter[prop]) {
          const charValues = char[prop]
            .split(",")
            .map((ch: string) => ch.trim());
          const randomCharValues = randomCharacter[prop]
            .split(",")
            .map((ch: string) => ch.trim());

          const commonValues = charValues.filter((value: any) =>
            randomCharValues.includes(value)
          );

          if (prop === "family") {
            const isFamilyMatch =
              charValues.includes(randomCharacter.name) ||
              randomCharValues.includes(char.name);

            if (isFamilyMatch) {
              results[prop] = "match";
            } else if (commonValues.length > 0) {
              results[prop] = "partial";
            } else {
              results[prop] = "no-match";
            }
          } else if (commonValues.length > 0) {
            results[prop] = "partial";
          } else {
            results[prop] = "no-match";
          }
        } else {
          results[prop] = "no-match";
        }
      });

      setDisplayedCharacters((prevCharacters) =>
        prevCharacters.map((c) =>
          c.id === char.id ? { ...c, comparisonResults: results } : c
        )
      );
    }
  };

  return (
    <div>
      <h1 className="characterFetch__title">Guess the Character</h1>
      {/* {randomCharacter && (
        <RandomCharacterHint randomCharacter={randomCharacter} />
      )} */}
      <CharacterSearchInput
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        searchDisabled={searchDisabled}
      />
      <FilteredCharacterList
        filteredCharacters={filteredCharacters}
        handleSelectCharacter={handleSelectCharacter}
      />
      <CharacterList
        displayedCharacters={displayedCharacters}
        handleSelectCharacter={handleSelectCharacter}
      />
    </div>
  );
};

export default CharacterFetch;
