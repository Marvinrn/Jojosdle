import React from "react";
import Image from "next/image";
import { CharacterProperties } from "./CharacterProperties";

interface FilteredCharacterListProps {
  filteredCharacters: CharacterProperties[];
  handleSelectCharacter: (char: CharacterProperties) => void;
}

const FilteredCharacterList: React.FC<FilteredCharacterListProps> = ({
  filteredCharacters,
  handleSelectCharacter,
}) => {
  return (
    <div>
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
  );
};

export default FilteredCharacterList;
