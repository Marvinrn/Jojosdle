import React from "react";
import { CharactersProperties } from "./CharactersProperties";

interface RandomCharacterHintProps {
  randomCharacter: CharactersProperties;
}

const RandomCharacterHint: React.FC<RandomCharacterHintProps> = ({
  randomCharacter,
}) => {
  return (
    <div>
      <p>Try to guess which character was randomly picked!</p>
      <p>Hint: {randomCharacter.name}</p>
    </div>
  );
};

export default RandomCharacterHint;
