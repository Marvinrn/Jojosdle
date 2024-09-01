"use client";

import React, { useState, useEffect } from "react";
import CharacterList from "./CharacterList";
import { CharacterProperties } from "./CharacterProperties";
import CharacterSearchInput from "./CharacterSearchInput";
import FilteredCharacterList from "./FilteredCharacterList";
import RandomCharacterHint from "./RandomCharacterHint";
import { CharacterData } from "../datas/CharacterData";
import Image from "next/image";
import GuessWhoTitle from "../../assets/JojoTitle.png";
import WinningModal from "./WinningModal";

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
  const [isWinningModalOpen, setIsWinningModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const data: CharacterProperties[] = CharacterData;
      setCharacters(data);

      // Load random character from local storage if it exists
      const storedRandomCharacter = localStorage.getItem("randomCharacter");
      if (storedRandomCharacter) {
        setRandomCharacter(JSON.parse(storedRandomCharacter));
      } else {
        // If no random character in local storage, select a new random character
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const selectedRandomCharacter = data[randomIndex];
          setRandomCharacter(selectedRandomCharacter);
          localStorage.setItem(
            "randomCharacter",
            JSON.stringify(selectedRandomCharacter)
          );
        }
      }

      // Retrieve modal and search bar states from localStorage
      const storedModalState = localStorage.getItem("isWinningModalOpen");
      const storedSearchState = localStorage.getItem("searchDisabled");

      if (storedModalState !== null) {
        setIsWinningModalOpen(JSON.parse(storedModalState));
      }

      if (storedSearchState !== null) {
        setSearchDisabled(JSON.parse(storedSearchState));
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }, []);

  useEffect(() => {
    if (randomCharacter) {
      const isMatch = displayedCharacters.some(
        (c) => c.id === randomCharacter.id
      );
      setSearchDisabled(isMatch);
      localStorage.setItem("searchDisabled", JSON.stringify(isMatch));

      if (isMatch) {
        setIsWinningModalOpen(true); // Open modal when a match is found
        localStorage.setItem("isWinningModalOpen", JSON.stringify(true));
      }
    }
  }, [randomCharacter, displayedCharacters]);

  const handleModalClose = () => {
    setIsWinningModalOpen(false);
    localStorage.setItem("isWinningModalOpen", JSON.stringify(false));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredCharacters([]);
    } else {
      const filtered = characters.filter((char) =>
        char.name.toLowerCase().includes(query)
      );

      // Retrieve displayedCharacters from localStorage
      const storedDisplayedCharacters = JSON.parse(
        localStorage.getItem("displayedCharacters") || "[]"
      );

      // Exclude characters that are already in displayedCharacters from the filtered list
      const filteredWithoutDisplayed = filtered.filter(
        (char) =>
          !storedDisplayedCharacters.some(
            (storedChar: CharacterProperties) => storedChar.id === char.id
          )
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
        [key: string]:
          | "match"
          | "no-match"
          | "partial-match"
          | "greater"
          | "lesser"
          | undefined;
      } = {};

      const propertiesToCompare = [
        "image",
        "name",
        "gender",
        "nationality",
        "living",
        "isHuman",
        "isStandUser",
        "animeDebut",
        "chapter",
      ];

      propertiesToCompare.forEach((prop) => {
        if (prop == "animeDebut") {
          const charValue = char[prop] as number;
          const randomCharValue = randomCharacter[prop] as number;

          if (randomCharValue === charValue) {
            results[prop] = "match";
          } else if (randomCharValue > charValue) {
            results[prop] = "greater";
          } else {
            results[prop] = "lesser";
          }
        } else if (prop == "nationality") {
          const charNationality = char[prop] as string;
          const randomCharNationality = randomCharacter[prop] as string;

          if (charNationality == randomCharNationality) {
            results[prop] = "match";
          } else if (
            randomCharNationality.includes(charNationality) ||
            charNationality.includes(randomCharNationality)
          ) {
            results[prop] = "partial-match";
          } else {
            results[prop] = "no-match";
          }
        } else if (char[prop] === randomCharacter[prop]) {
          results[prop] = "match";
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
    <div className="characterFetchContainer">
      <div className="guessWhoContainer">
        <Image
          className="guessWho__title"
          src={GuessWhoTitle}
          alt="Image Du titre en pixel art"
          width={256}
          height={128}
        />
      </div>
      {/* {randomCharacter && (
        <RandomCharacterHint randomCharacter={randomCharacter} />
      )} */}
      {!isWinningModalOpen && (
        <CharacterSearchInput
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          searchDisabled={searchDisabled}
        />
      )}
      <FilteredCharacterList
        filteredCharacters={filteredCharacters}
        handleSelectCharacter={handleSelectCharacter}
      />
      {randomCharacter && (
        <WinningModal
          isOpen={isWinningModalOpen}
          onClose={handleModalClose}
          character={{
            name: randomCharacter.name,
            image: randomCharacter.image,
          }}
        />
      )}
      <CharacterList
        displayedCharacters={displayedCharacters}
        handleSelectCharacter={handleSelectCharacter}
      />
    </div>
  );
};

export default CharacterFetch;
