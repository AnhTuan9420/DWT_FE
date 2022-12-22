// eslint-disable-next-line import/prefer-default-export
export const initialData = {
	boards: [
		{
			id: 'board-1',
			columnOrder: ['column-1', 'column-2', 'column-3'],
			columns: [
				{
					id: 'column-1',
					boardId: 'board-1',
					title: 'Đặt linh kiện',
					status: 'success',
					cardOrder: ['card-1', 'card-2', 'card-3', 'card-4', 'card-5'],
					cards: [
						{
							id: 'card-1',
							boardId: 'board-1',
							columnId: 'column-1',
							title: 'Thiết bị chấm công quét vân tay di động HP01',
							cover: null, // image in card
						},
						{
							id: 'card-2',
							boardId: 'board-1',
							columnId: 'column-1',
							title: 'Thiết bị chấm công quét vân tay di động HP02',
							cover: null, // image in card
						},
						{
							id: 'card-3',
							boardId: 'board-1',
							columnId: 'column-1',
							title: 'Thiết bị chấm công quét vân tay di động HP03',
							cover: null, // image in card
						},
						{
							id: 'card-4',
							boardId: 'board-1',
							columnId: 'column-1',
							title: 'Thiết bị chấm công quét vân tay di động HP04',
							cover: null, // image in card
						},
						{
							id: 'card-5',
							boardId: 'board-1',
							columnId: 'column-1',
							title: 'Thiết bị chấm công quét vân tay di động HP05',
							cover: null, // image in card
						},
					],
				},
				{
					id: 'column-2',
					boardId: 'board-1',
					title: 'Nhận linh kiện',
					status: 'danger',
					cardOrder: ['card-6', 'card-7', 'card-8', 'card-9', 'card-10'],
					cards: [
						{
							id: 'card-6',
							boardId: 'board-1',
							columnId: 'column-2',
							title: 'Thiết bị chấm công quét vân tay di động HP06',
							cover: null, // image in card
						},
						{
							id: 'card-7',
							boardId: 'board-1',
							columnId: 'column-2',
							title: 'Thiết bị chấm công quét vân tay di động HP07',
							cover: null, // image in card
						},
						{
							id: 'card-8',
							boardId: 'board-1',
							columnId: 'column-2',
							title: 'Thiết bị chấm công quét vân tay di động HP08',
							cover: null, // image in card
						},
						{
							id: 'card-9',
							boardId: 'board-1',
							columnId: 'column-2',
							title: 'Thiết bị chấm công quét vân tay di động HP09',
							cover: null, // image in card
						},
						{
							id: 'card-10',
							boardId: 'board-1',
							columnId: 'column-2',
							title: 'Thiết bị chấm công quét vân tay di động HP10',
							cover: null, // image in card
						},
					],
				},
				{
					id: 'column-3',
					boardId: 'board-1',
					title: 'Kỹ thuật kiểm tra',
					status: 'info',
					cardOrder: ['card-11', 'card-12'],
					cards: [
						{
							id: 'card-11',
							boardId: 'board-1',
							columnId: 'column-3',
							title: 'Thiết bị chấm công quét vân tay di động HP11',
							cover: null, // image in card
						},
						{
							id: 'card-12',
							boardId: 'board-1',
							columnId: 'column-3',
							title: 'Thiết bị chấm công quét vân tay di động HP12',
							cover: null, // image in card
						},
					],
				},
			],
		},
	],
};
