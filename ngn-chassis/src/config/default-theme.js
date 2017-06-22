const palette = {
	black: 'rgb(0,0,0)',
	white: 'rgb(255,255,255)',
	red: 'rgb(255,0,0)',
	blue: 'rgb(0,152,230)',
	green: 'rgb(104,187,18)'
}

module.exports = {
	typography: {
		'font-family': 'Helvetica, Arial, sans-serif',
		'color': palette.black
	},
	
	links: {
		'color': palette.blue,
		'text-decoration': 'none',
		
		hover: {
			'color': palette.blue,
			'text-decoration': 'underline',
		}
	}
}
