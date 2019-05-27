const suits = [
  {
    name: 'Clubs',
    color: 'Black',
    character: '\u2663',
    value: 0
  },
  {
    name: 'Diamonds',
    color: 'Red',
    character: '\u2666',
    value: 1
  },
  {
    name: 'Hearts',
    color: 'Red',
    character: '\u2665',
    value: 2
  },
  {
    name: 'Spades',
    color: 'Black',
    character: '\u2660',
    value: 3
  },
];

const cardRanks = [
  {
    name: '2',
    character: '2',
    value: 2
  },
  {
    name: '3',
    character: '3',
    value: 3
  },
  {
    name: '4',
    character: '4',
    value: 4
  },
  {
    name: '5',
    character: '5',
    value: 5
  },
  {
    name: '6',
    character: '6',
    value: 6
  },
  {
    name: '7',
    character: '7',
    value: 7
  },
  {
    name: '8',
    character: '8',
    value: 8
  },
  {
    name: '9',
    character: '9',
    value: 9
  },
  {
    name: '10',
    character: '10',
    value: 10
  },
  {
    name: 'Jack',
    character: 'J',
    value: 11
  },
  {
    name: 'Queen',
    character: 'Q',
    value: 12
  },
  {
    name: 'King',
    character: 'K',
    value: 13
  },
  {
    name: 'Ace',
    character: 'A',
    value: 14
  }
];

const politicalRanks = [
  {
    name: 'President',
    value: 8
  },
  {
    name: 'Vice President',
    value: 7
  },
  {
    name: 'Speaker of the House',
    value: 6
  },
  {
    name: 'President Pro Tempore of the Senate',
    value: 5
  },
  {
    name: 'Secretary of State',
    value: 4
  },
  {
    name: 'Secretary of the Treasury',
    value: 3
  },
  {
    name: 'Secretary of Defense',
    value: 2
  },
  {
    name: 'Asshole',
    value: 1
  }
];

const states = [
  {
    state: 'NOT_STARTED'
  },
  {
    state: 'IN_PROGRESS'
  },
  {
    state: 'FINALIZED'
  }
];

const users = [
  { 
    username: 'tommypastrami',
    password: 'cheese'
  },
  { 
    username: 'johnnyroastbeef',
    password: 'beefcake'
  },
  { 
    username: 'bella',
    password: 'mortadella'
  },
  { 
    username: 'tony',
    password: 'pepperoni'
  },
  { 
    username: 'tammy',
    password: 'salami'
  },
  { 
    username: 'malory',
    password: 'cellory'
  },
  { 
    username: 'bobby',
    password: 'apples'
  },
  { 
    username: 'timmy',
    password: 'cheesecake'
  },
  {
    username: 'jethro',
    password: 'mud'
  }
]

const game = {
  name: 'test-game',
  skipCount: 0
}

module.exports = {
  suits, cardRanks, users, game, states, politicalRanks
}