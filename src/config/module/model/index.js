import mongoose from 'mongoose';

const ModelSchema = new mongoose.Schema({});

ModelSchema.virtual('kind').get(function() {
	return 'ModelKind';
});

ModelSchema.virtual('displayId').get(function() {
	return `Model - ${this._id}`;
});

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });
ModelSchema.plugin(require('mongoose-autopopulate'));
ModelSchema.plugin(require('mongoose-unique-validator'));

const ModelKind = mongoose.model('ModelKind', ModelSchema);

export default ModelKind;
