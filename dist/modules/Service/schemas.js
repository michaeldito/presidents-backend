"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  "Card": {
    "shortHand": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "cardRank": {
      "type": "ObjectID",
      "required": true,
      "ref": "CardRank"
    },
    "suit": {
      "type": "ObjectID",
      "required": true,
      "ref": "Suit"
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    }
  },
  "CardRank": {
    "name": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "character": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "value": {
      "type": "Number",
      "required": true,
      "unique": true
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    }
  },
  "Game": {
    "name": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "createdAt": {
      "type": "Date",
      "required": true
    },
    "startedAt": {
      "type": "Date",
      "required": false
    },
    "finishedAt": {
      "type": "Date",
      "required": false
    },
    "status": {
      "type": "ObjectID",
      "required": true,
      "ref": "GameStatus"
    },
    "config": {
      "type": "ObjectID",
      "required": true,
      "ref": "GameConfiguration"
    },
    "createdBy": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    },
    "currentPlayer": {
      "type": "ObjectID",
      "required": false,
      "ref": "User"
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "GameConfiguration": {
    "name": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "maxPlayers": {
      "type": "Number",
      "required": true
    },
    "minPlayers": {
      "type": "Number",
      "required": true
    },
    "deck": {
      "type": "Array",
      "required": true,
      "ref": "Card"
    },
    "numDecks": {
      "type": "Number",
      "required": true
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    }
  },
  "Status": {
    "value": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "GameStatus": {
    "extends": {
      "type": "Status"
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "value": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "InboxItem": {
    "forUser": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    },
    "seenByUser": {
      "type": "Boolean",
      "required": true
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "Invite": {
    "sentBy": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    },
    "status": {
      "type": "ObjectID",
      "required": true,
      "ref": "InviteStatus"
    },
    "game": {
      "type": "ObjectID",
      "required": true,
      "ref": "Game"
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "forUser": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    },
    "seenByUser": {
      "type": "Boolean",
      "required": true
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "InviteStatus": {
    "extends": {
      "type": "Status"
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "value": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "PoliticalRank": {
    "name": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "value": {
      "type": "Number",
      "required": true,
      "unique": true
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    }
  },
  "Presidents": {
    "extends": {
      "type": "Game"
    },
    "winner": {
      "type": "ObjectID",
      "required": false,
      "ref": "User"
    },
    "turnToBeat": {
      "type": "Embedded",
      "required": false
    },
    "rules": {
      "type": "Embedded",
      "required": true
    },
    "rounds": {
      "type": "Array",
      "required": true
    },
    "players": {
      "type": "Array",
      "required": true
    },
    "drinks": {
      "type": "Array",
      "required": false
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "name": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "createdAt": {
      "type": "Date",
      "required": true
    },
    "startedAt": {
      "type": "Date",
      "required": false
    },
    "finishedAt": {
      "type": "Date",
      "required": false
    },
    "status": {
      "type": "ObjectID",
      "required": true,
      "ref": "GameStatus"
    },
    "config": {
      "type": "ObjectID",
      "required": true,
      "ref": "GameConfiguration"
    },
    "createdBy": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    },
    "currentPlayer": {
      "type": "ObjectID",
      "required": false,
      "ref": "User"
    },
    "__v": {
      "type": "Number",
      "required": false
    },
    "kind": {
      "type": "String",
      "required": false
    }
  },
  "Suit": {
    "name": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "color": {
      "type": "String",
      "required": true
    },
    "character": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "value": {
      "type": "Number",
      "required": true,
      "unique": true
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    }
  },
  "User": {
    "username": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "email": {
      "type": "String",
      "required": true,
      "unique": true
    },
    "password": {
      "type": "String",
      "required": true
    },
    "gamesPlayed": {
      "type": "Array",
      "required": false,
      "ref": "Game"
    },
    "token": {
      "type": "String",
      "required": false
    },
    "role": {
      "type": "String",
      "required": false
    },
    "_id": {
      "type": "ObjectID",
      "required": false
    },
    "__v": {
      "type": "Number",
      "required": false
    }
  },
  "Turn": {
    "embedded": true,
    "user": {
      "type": "ObjectID",
      "required": true,
      "isRef": true,
      "ref": "User"
    },
    "takenAt": {
      "type": "Date",
      "required": false,
      "isRef": false
    },
    "cardsPlayed": {
      "type": "Array",
      "required": false,
      "isRef": true,
      "ref": "Card"
    },
    "wasPassed": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "wasSkipped": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "didCauseSkips": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "skipsRemaining": {
      "type": "Number",
      "required": true,
      "isRef": false
    },
    "endedRound": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "_id": {
      "type": "ObjectID",
      "required": false,
      "isRef": false
    }
  },
  "Rules": {
    "embedded": true,
    "doubleSkips": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "scumStarts": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "scumHandsTwo": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "oneEyedJacksAndKingOfHearts": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "reversePresidentScumTrade": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "presidentDeals": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "goLow": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "equalNumber": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "noEndOnBomb": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "tripleSixes": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "passOut": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "fourInARow": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "larryPresidents": {
      "type": "Boolean",
      "required": true,
      "isRef": false
    },
    "_id": {
      "type": "ObjectID",
      "required": false,
      "isRef": false
    }
  },
  "Round": {
    "embedded": true,
    "startedAt": {
      "type": "Date"
    },
    "turns": {
      "type": "Array",
      "arrayType": "Turn"
    }
  },
  "Player": {
    "embedded": true,
    "user": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    },
    "turns": {
      "type": "Array",
      "arrayType": "Turn"
    },
    "joinedAt": {
      "type": "Date"
    },
    "seatPosition": {
      "type": "Number",
      "required": "true"
    },
    "hand": {
      "type": "Array",
      "arrayType": "ObjectID",
      "ref": "Card"
    },
    "politicalRank": {
      "type": "ObjectID",
      "ref": "PoliticalRank"
    },
    "nextGameRank": {
      "type": "ObjectID",
      "ref": "PoliticalRank"
    },
    "drinksDrunk": {
      "type": "Number",
      "required": "true"
    },
    "drinksReceived": {
      "type": "Array",
      "arrayType": "DrinkReceived",
      "required": "true"
    },
    "drinksSent": {
      "type": "Array",
      "arrayType": "DrinkSent",
      "required": "true"
    }
  },
  "DrinkReceived": {
    "embedded": true,
    "createdAt": {
      "type": "Date"
    },
    "sentBy": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    }
  },
  "DrinkSent": {
    "embedded": true,
    "createdAt": {
      "type": "Date"
    },
    "sentTo": {
      "type": "ObjectID",
      "required": true,
      "ref": "User"
    }
  }
};
exports.default = _default;