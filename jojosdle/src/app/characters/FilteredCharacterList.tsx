import React from "react";
import Image from "next/image";
import { CharactersProperties } from "./CharactersProperties";

interface FilteredCharacterListProps {
  filteredCharacters: CharactersProperties[];
  handleSelectCharacter: (char: CharactersProperties) => void;
}

const FilteredCharacterList: React.FC<FilteredCharacterListProps> = ({
  filteredCharacters,
  handleSelectCharacter,
}) => {
  return (
    <div className="filteredList">
      {filteredCharacters.length > 0 && (
        <ul className="filteredList__list">
          {filteredCharacters.map((char) => (
            <li
              className="filteredList__characterContainer"
              key={char.id}
              onClick={() => handleSelectCharacter(char)}
            >
              <div className="filteredList__character">
                <div>
                  <Image
                    src={char.image} // Directly use the image property
                    alt={char.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div>{char.name}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredCharacterList;
