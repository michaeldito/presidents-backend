export default {
    "Card": {
        "name": "cards",
        "operations": [
            {
                "path": "/api/v1/cards/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/cards/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "CardRank": {
        "name": "cardRanks",
        "operations": [
            {
                "path": "/api/v1/cardRanks/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/cardRanks/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "Game": {
        "name": "games",
        "operations": [
            {
                "path": "/api/v1/games/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/games/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "GameConfiguration": {
        "name": "gameConfigurations",
        "operations": [
            {
                "path": "/api/v1/gameConfigurations/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/gameConfigurations/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "Status": {
        "name": "statuses",
        "operations": [
            {
                "path": "/api/v1/statuses/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/statuses/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "GameStatus": {
        "name": "gameStatuses",
        "operations": [
            {
                "path": "/api/v1/gameStatuses/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/gameStatuses/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "InboxItem": {
        "name": "inboxItems",
        "operations": [
            {
                "path": "/api/v1/inboxItems/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/inboxItems/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "Invite": {
        "name": "invites",
        "operations": [
            {
                "path": "/api/v1/invites/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/invites/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "InviteStatus": {
        "name": "inviteStatuses",
        "operations": [
            {
                "path": "/api/v1/inviteStatuses/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/inviteStatuses/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "PoliticalRank": {
        "name": "politicalRanks",
        "operations": [
            {
                "path": "/api/v1/politicalRanks/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/politicalRanks/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "Presidents": {
        "name": "presidents",
        "operations": [
            {
                "path": "/api/v1/presidents/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/presidents/details",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/presidents/create",
                "methods": [
                    "POST"
                ]
            },
            {
                "path": "/api/v1/presidents/:id",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/presidents/:id/join",
                "methods": [
                    "PUT"
                ]
            },
            {
                "path": "/api/v1/presidents/:id/initialize",
                "methods": [
                    "PUT"
                ]
            },
            {
                "path": "/api/v1/presidents/:id/processTurn",
                "methods": [
                    "PUT"
                ]
            },
            {
                "path": "/api/v1/presidents/:id/giveDrink",
                "methods": [
                    "PUT"
                ]
            },
            {
                "path": "/api/v1/presidents/:id/drinkDrink",
                "methods": [
                    "PUT"
                ]
            },
            {
                "path": "/api/v1/presidents/:id/rematch",
                "methods": [
                    "POST"
                ]
            }
        ]
    },
    "Suit": {
        "name": "suits",
        "operations": [
            {
                "path": "/api/v1/suits/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/suits/:id",
                "methods": [
                    "GET"
                ]
            }
        ]
    },
    "User": {
        "name": "users",
        "operations": [
            {
                "path": "/api/v1/users/register",
                "methods": [
                    "POST"
                ]
            },
            {
                "path": "/api/v1/users/login",
                "methods": [
                    "PUT"
                ]
            },
            {
                "path": "/api/v1/users/",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/users/:id",
                "methods": [
                    "GET"
                ]
            },
            {
                "path": "/api/v1/users/:id/profile",
                "methods": [
                    "GET"
                ]
            }
        ]
    }
}