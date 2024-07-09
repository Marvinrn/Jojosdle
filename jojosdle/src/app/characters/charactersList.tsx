import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CharacterProperties } from "./CharacterProperties";

interface CharacterListProps {
  displayedCharacters: CharacterProperties[];
  handleSelectCharacter: (char: CharacterProperties) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  displayedCharacters,
  handleSelectCharacter,
}) => {
  const getClassForProperty = (
    char: CharacterProperties,
    property: string
  ): string => {
    const comparisonResults = char.comparisonResults || {};

    switch (comparisonResults[property]) {
      case "match":
        return "green";
      case "greater":
        return "greater";
      case "lesser":
        return "lesser";
      case "no-match":
        return "red";
      default:
        return "";
    }
  };

  const [delayedCharacters, setDelayedCharacters] = useState<
    { id: string; property: string }[]
  >([]);

  useEffect(() => {
    if (displayedCharacters.length > 0) {
      displayedCharacters.forEach((char, charIndex) => {
        const properties = [
          "image",
          "nationality",
          "animeDebut",
          "chapter",
          "isStandUser",
          "living",
          "isHuman",
        ];
        properties.forEach((property, propIndex) => {
          setTimeout(() => {
            setDelayedCharacters((prev) => [
              ...prev,
              { id: char.id, property },
            ]);
          }, (charIndex * properties.length + propIndex) * 500); // 0.5 second delay for each property
        });
      });
    }
  }, [displayedCharacters]);

  return (
    <div className="characterList">
      <div className="characterList__titleList">
        <p className="characterList__propertiesTitle">Character</p>
        <p className="characterList__propertiesTitle">Nationality</p>
        <p className="characterList__propertiesTitle">Anime First Appearance</p>
        <p className="characterList__propertiesTitle">Chapter</p>
        <p className="characterList__propertiesTitle">Is Stand User</p>
        <p className="characterList__propertiesTitle">Is alive</p>
        <p className="characterList__propertiesTitle">Is Human</p>
      </div>
      {displayedCharacters.length > 0 && (
        <div className="characterList__listContainer">
          {displayedCharacters.map((char) => (
            <div key={char.id} className="characterList__list">
              <div
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "image"
                )} ${
                  delayedCharacters.find(
                    (item) => item.id === char.id && item.property === "image"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                <Image
                  src={char.image}
                  alt={char.name}
                  width={75}
                  height={75}
                />
              </div>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "nationality"
                )} ${
                  delayedCharacters.find(
                    (item) =>
                      item.id === char.id && item.property === "nationality"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                {char.nationality}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "animeDebut"
                )} ${
                  delayedCharacters.find(
                    (item) =>
                      item.id === char.id && item.property === "animeDebut"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                Episode {char.animeDebut}
                {getClassForProperty(char, "animeDebut") === "greater" && (
                  <span className="arrow greater">▲</span>
                )}
                {getClassForProperty(char, "animeDebut") === "lesser" && (
                  <span className="arrow lesser">▼</span>
                )}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "chapter"
                )} ${
                  delayedCharacters.find(
                    (item) => item.id === char.id && item.property === "chapter"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                {char.chapter}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "isStandUser"
                )} ${
                  delayedCharacters.find(
                    (item) =>
                      item.id === char.id && item.property === "isStandUser"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                {char.isStandUser ? "Yes" : "No"}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "living"
                )} ${
                  delayedCharacters.find(
                    (item) => item.id === char.id && item.property === "living"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                {char.living ? "Yes" : "No"}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "isHuman"
                )} ${
                  delayedCharacters.find(
                    (item) => item.id === char.id && item.property === "isHuman"
                  )
                    ? "visible"
                    : "hidden"
                }`}
              >
                {char.isHuman ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
