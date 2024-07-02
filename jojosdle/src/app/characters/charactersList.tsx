import React from "react";
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
      case "partial":
        return "orange";
      case "no-match":
        return "red";
      default:
        return "";
    }
  };

  return (
    <div className="characterList">
      <div className="characterList__titleList">
        <p className="characterList__propertiesTitle">Character</p>
        <p className="characterList__propertiesTitle">Nationality</p>
        <p className="characterList__propertiesTitle">Family</p>
        <p className="characterList__propertiesTitle">Chapter</p>
        <p className="characterList__propertiesTitle">Is alive</p>
        <p className="characterList__propertiesTitle">Is Human</p>
      </div>
      {displayedCharacters.length > 0 && (
        <div>
          {displayedCharacters.map((char) => (
            <div key={char.id} className="characterList__list">
              <Image
                src={`https://jojos-bizarre-api.netlify.app/assets/${char.image}`}
                alt={char.name}
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "image"
                )}`}
                width={100}
                height={100}
              />
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "nationality"
                )}`}
              >
                {char.nationality}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "family"
                )}`}
              >
                {char.family}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "chapter"
                )}`}
              >
                {char.chapter}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "living"
                )}`}
              >
                {char.living ? "Yes" : "No"}
              </p>
              <p
                className={`characterList__properties ${getClassForProperty(
                  char,
                  "isHuman"
                )}`}
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
