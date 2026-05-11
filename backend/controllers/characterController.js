let characters = [
    {
        id:1,
        name: "Monkey D. Luffy",
        affiliation: "Straw Hat Pirates",
        bounty: 3000000000,
        status: "Alive"
    },
    {
        id:2,
        name: "Roronoa Zoro",
        affiliation: "Straw Hat Pirates",
        bounty: 1111000000,
        status: "Alive"
    }
];

exports.getAllCharacters = (req, res) => {
    res.status(200).json(characters);
};

exports.getCharacterById = (req, res) => {
    const id = Number(req.params.id);
    const character = characters.find((c) => c.id === id);

    if (!character) {
        return res.status(404).json({ message: "Character not found" });
    }

    res.status(200).json(character);
};

exports.createCharacter = (req, res) => {
    const { name, affiliation, bounty, status } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Character name is required" });
    }

    if (bounty < 0) {
        return res.status(400).json({ message: "Bounty cannot be negative" });
    }

    const newCharacter = {
        id: characters.length + 1,
        name,
        affiliation,
        bounty,
        status
    };

    characters.push(newCharacter);
    res.status(201).json(newCharacter);
};

exports.updateCharacter = (req, res) => {
    const id = Number(req.params.id);
    const character = characters.find((c) => c.id === id);

    if (!character) {
        return res.status(404).json({ message: "Character not found" });
    }

    const { name, affiliation, bounty, status } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Character name is required" });
    }

    if (!affiliation || affiliation.trim() === "") {
        return res.status(400).json({ message: "Affiliation is required" });
    }

    if (bounty < 0) {
        return res.status(400).json({ message: "Bounty cannot be negative" });
    }

    character.name = name;
    character.affiliation = affiliation;
    character.bounty = bounty;
    character.status = status;

    res.status(200).json(character);
};

exports.deleteCharacter = (req, res) => {
    const id = Number(req.params.id);
    const characterIndex = characters.findIndex((c) => c.id === id);
    if (characterIndex === -1) {
        return res.status(404).json({ message: "Character not found" });
    }

    characters.splice(characterIndex, 1);

    res.status(200).json({ message: "Character deleted successfully" });
};