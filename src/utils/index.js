
const ranks = ['2','3' ,'4' ,'5' ,'6' ,'7' ,'8' ,'9' ,'10' ,'J', 'Q', 'K', 'A'];
const suites = ['H', 'D', 'C', 'S'];

const create2DArray = rows => {
  let A = [];
  for (let i = 0; i < rows; i++)
    A[i] = [];
  return A;
}

module.exports = {
  ranks,
  suites,
  create2DArray
}