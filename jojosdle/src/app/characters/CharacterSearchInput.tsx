import React from "react";

interface CharacterSearchInputProps {
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchDisabled: boolean;
}

const CharacterSearchInput: React.FC<CharacterSearchInputProps> = ({
  searchQuery,
  handleSearchChange,
  searchDisabled,
}) => {
  return (
    <div className="searchBarContainer">
      <input
        className="searchBar"
        type="text"
        placeholder="Search character..."
        value={searchQuery}
        onChange={handleSearchChange}
        disabled={searchDisabled}
      />
    </div>
  );
};

export default CharacterSearchInput;