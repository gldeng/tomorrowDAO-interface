module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		'postcss-nested': {},
		'postcss-pxtorem': {
			rootValue: 10,
			unitPrecision: 5,
			propList: ['*'],
			mediaQuery: false,
			minPixelValue: 2,
			exclude: /node_modules/i,
		},
	},
};
