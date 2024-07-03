import React from "react";
import { CharacterProperties } from "./CharacterProperties";

interface RandomCharacterHintProps {
  randomCharacter: CharacterProperties;
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
