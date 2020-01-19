module.exports = async function() {

  let docs = await this.find({});

  docs = docs.map(doc => {
    let { id, name, createdAt, startedAt, finishedAt, status, createdBy, winner } = doc;
    let type = doc.config.name;
    if (! winner) {
      winner = '-';
    }
    return { id, name, type, createdAt, startedAt, finishedAt, status, createdBy, winner };
  }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
  return docs;
  
}