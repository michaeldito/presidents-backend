# Specs

## Suit
### Should only ever have 4 suits in the db
- @ getAll -> returns all 4 suit objs

## CardRank
### Should only ever have 13 ranks in the db
- @ getAll -> returns all 13 rank objs

## Card
### Should only ever have 52 cards in the db
### Use Suit and CardRank _id's as refs
- @ getAll -> returns all 52 card objs, with _id's replaced by ref contents
- @ getIdByRankAndSuit(str: rank, str: suit) -> returns card obj _id

## GameState
### Should only ever have 3 states in the db
- @ getAll -> returns all 3 state objs
- @ getIdByType(str: name) -> returns state obj _id

## User
- simple, just username and pw, encryption with salts later
- @verifyPassword(pw) -> bool

## PoliticalRank
### Should only ever have 8 ranks in the db
### (let's have prez be value 1 and asshole 8, incase we add more)
- @ getIdByName(str: name) -> returns rank obj _id

## Player
- seatPosition, game, rank, user determined at construction and are constant
- @get/set drinksToDrink
- @get/set drinksDrunk
- @get/set/deleteCardIn hand

## Game
- name determined at construction and is constant
- @get/set gameState
- @get/set/addPlayer players
- @get/set nextPlayer
- @get/set deck
- @addToPile playedPile
- @addToPile discardPile
- ranks ? why need
