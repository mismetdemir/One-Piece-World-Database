const { validate } = require("jest-validate");

function validateCharacter(character) {
    if (!character.name || character.name.trim() === "") {
        return "Character name is required";
    }

    if (character.bounty !== undefined && character.bounty < 0) {
        return "Bounty cannot ve negative";
    }

    return null;
}

module.exports = { validateCharacter };