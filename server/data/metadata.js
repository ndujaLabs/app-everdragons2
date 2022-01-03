const tracks = require("../../common/tracks.json");
const db = require("../lib/Db");
const serials = db.get("serials");

class Metadata {
  static getMetadataJSON(id, track) {
    if (!serials[id]) {
      throw new Error("Serial not found");
    }
    return {
      description: "Everdragons2 NFT Limited Edition",
      external_url: `https://everdragons2.com/items/${id}`,
      name: `Everdragons2 ${
        id < 51
          ? "NE " + id + "/50"
          : id === 88
          ? "AC (xi)"
          : "AP " + (id - 64) + "/3"
      }`,
      attributes: [
        {
          trait_type: "Track Number",
          value: (track < 10 ? "0" : "") + track,
        },
        {
          trait_type: "Track Title",
          value: tracks[track],
        },
        {
          trait_type: "Serial",
          value: serials[id],
        },
        {
          trait_type:
            id < 51
              ? "Numbered Edition"
              : id === 88
              ? "Artists's copy"
              : "Artist's Proof",
          value: id < 51 ? id + "/50" : id === 88 ? "xi" : id - 64 + "/3",
        },
      ],
    };
  }
}

module.exports = Metadata;
