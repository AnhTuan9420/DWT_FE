import * as React from 'react';

function SvgSkipNext(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			height='1em'
			viewBox='0 0 24 24'
			width='1em'
			className='svg-icon'
			{...props}>
			<path d='M0 0h24v24H0V0z' fill='none' />
			<path d='M8 9.86v4.28L11.03 12z' opacity={0.3} />
			<path d='M14.5 12L6 6v12l8.5-6zM8 9.86L11.03 12 8 14.14V9.86zM16 6h2v12h-2z' />
		</svg>
	);
}

export default SvgSkipNext;
