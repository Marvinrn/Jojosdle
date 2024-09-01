import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CharactersProperties } from "./CharactersProperties";

interface CharacterListProps {
  displayedCharacters: CharactersProperties[];
  handleSelectCharacter: (char: CharactersProperties) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  displayedCharacters,
  handleSelectCharacter,
}) => {
  const getClassForProperty = (
    char: CharactersProperties,
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
      case "partial-match":
        return "orange";
      default:
        return "";
    }
  };

  const [delayedCharacters, setDelayedCharacters] = useState<
    { id: string; property: string }[]
  >([]);
  const [storedCharacters, setStoredCharacters] = useState<
    CharactersProperties[]
  >([]);

  // Load characters from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("displayedCharacters");
    if (storedData) {
      setStoredCharacters(JSON.parse(storedData));
    }
  }, []);

  // Update local storage and state with new characters
  useEffect(() => {
    const storedData = localStorage.getItem("displayedCharacters");
    const existingCharacters = storedData ? JSON.parse(storedData) : [];

    const updatedCharacters = [
      ...existingCharacters,
      ...displayedCharacters.filter(
        (char) =>
          !existingCharacters.some(
            (existingChar: { id: string }) => existingChar.id === char.id
          )
      ),
    ];

    if (displayedCharacters.length > 0) {
      localStorage.setItem(
        "displayedCharacters",
        JSON.stringify(updatedCharacters)
      );
      setStoredCharacters(updatedCharacters);
    }
  }, [displayedCharacters]);

  // Add delayed characters to state for animation only if they are new
  useEffect(() => {
    const newCharacters = displayedCharacters.filter(
      (char) =>
        !storedCharacters.some((storedChar) => storedChar.id === char.id)
    );

    newCharacters.forEach((char, charIndex) => {
      const properties = [
        "image",
        "gender",
        "nationality",
        "animeDebut",
        "chapter",
        "isStandUser",
        "living",
        "isHuman",
      ];
      properties.forEach((property, propIndex) => {
        setTimeout(() => {
          setDelayedCharacters((prev) => [...prev, { id: char.id, property }]);
        }, (charIndex * properties.length + propIndex) * 350); // 0.35 second delay for each property
      });
    });
  }, [displayedCharacters, storedCharacters]);

  return (
    <div className="characterList">
      <div className="characterList__titleList">
        <p className="characterList__propertiesTitle">Character</p>
        <p className="characterList__propertiesTitle">Gender</p>
        <p className="characterList__propertiesTitle">Nationality</p>
        <p className="characterList__propertiesTitle">First Appearance</p>
        <p className="characterList__propertiesTitle">Part</p>
        <p className="characterList__propertiesTitle">Stand User</p>
        <p className="characterList__propertiesTitle">Is alive</p>
        <p className="characterList__propertiesTitle">Is Human</p>
      </div>
      {storedCharacters.length > 0 && (
        <div className="characterList__listContainer">
          {storedCharacters.map((char) => (
            <div key={char.id} className="characterList__list">
              {[
                "image",
                "gender",
                "nationality",
                "animeDebut",
                "chapter",
                "isStandUser",
                "living",
                "isHuman",
              ].map((property) => (
                <div
                  key={property}
                  className={`characterList__properties ${getClassForProperty(
                    char,
                    property
                  )} ${
                    delayedCharacters.find(
                      (item) =>
                        item.id === char.id && item.property === property
                    ) ||
                    !displayedCharacters.some(
                      (displayedChar) => displayedChar.id === char.id
                    )
                      ? "visible"
                      : "hidden"
                  }`}
                >
                  {property === "image" ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      width={75}
                      height={75}
                    />
                  ) : property === "animeDebut" ? (
                    `Episode ${char.animeDebut}`
                  ) : property === "isStandUser" ? (
                    char.isStandUser ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : property === "living" ? (
                    char.living ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : property === "isHuman" ? (
                    char.isHuman ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    char[property]
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
