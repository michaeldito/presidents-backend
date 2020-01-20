// {a: 1, b: 2, c: 3 }, ['b', 'c'] => {b, c}
export const pick = (obj, feilds) => {
	const newObj = {};
	feilds.forEach(feild => {
		newObj[feild] = obj[feild];
	});
	return newObj;
};

const Utils = {
	pick
};

export default Utils;