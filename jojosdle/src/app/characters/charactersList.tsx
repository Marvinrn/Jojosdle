import React from "react";
import Image from "next/image";
import { CharacterPorperties } from "./characterProperties";

interface CharacterList {
  displayedCharacters: CharacterPorperties[];
  handleSelectCharacter: (char: CharacterPorperties) => void;
}

const CharacterList: React.FC<CharacterList> = ({
  displayedCharacters,
  handleSelectCharacter,
}) => {
  return (
    <div>
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
};

export default CharacterList;
