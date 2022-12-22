import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Button, Form } from 'react-bootstrap';
import _ from 'lodash';
import styled from 'styled-components';
import Column from './Column';
import { initialData } from './initialData';
import './style.scss';
import { mapOrder, applyDrag } from '../../../utils/utils';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';

const WrapForm = styled.div``;

// eslint-disable-next-line react/prop-types
const TaskBoard = () => {
	const [board, setBoard] = useState({});
	const [columns, setColumns] = useState([]);
	const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');

	const newColumnInputRef = useRef(null);

	const handleToggleNewColumnForm = () => {
		setOpenNewColumnForm(!openNewColumnForm);
	};

	const handleCloseNewColumnForm = () => {
		setOpenNewColumnForm(false);
	};

	const handleNewColumnTitleChange = useCallback((e) => {
		setNewColumnTitle(e.target.value);
	}, []);

	useEffect(() => {
		const boardData = initialData.boards.find((item) => item.id === 'board-1');
		if (boardData) {
			setBoard(boardData);
			mapOrder(boardData.columns, boardData.columnOrder, 'id');
			setColumns(boardData.columns);
		}
	}, []);

	useEffect(() => {
		if (newColumnInputRef && newColumnInputRef.current) {
			newColumnInputRef.current.focus();
		}
	}, [openNewColumnForm]);

	if (_.isEmpty(board)) {
		return <div>Không có dữ liệu</div>;
	}

	const addNewColumn = () => {
		if (!newColumnTitle) {
			newColumnInputRef.current.focus();
			// eslint-disable-next-line no-useless-return
			return;
		}
		const data = {
			id: Math.random().toString(36).substr(2, 5),
			boardId: board.id,
			title: newColumnTitle.trim(),
			cardOrder: [],
			cards: [],
		};
		const newColumns = [...columns];
		newColumns.push(data);
		const newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((column) => column.id);
		newBoard.columns = newColumns;
		setColumns(newColumns);
		setBoard(newBoard);
		setNewColumnTitle('');
		handleToggleNewColumnForm();
	};

	const onColumnDrop = (dropResult) => {
		let newColumns = [...columns];
		newColumns = applyDrag(newColumns, dropResult);
		const newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((column) => column.id);
		newBoard.columns = newColumns;
		setColumns(newColumns);
		setBoard(newBoard);
	};

	const onCardDrop = (columnId, dropResult) => {
		if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
			const newColumns = [...columns];
			const currentColumn = newColumns.find((column) => column.id === columnId);
			currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
			currentColumn.cardOrder = currentColumn.cards.map((item) => item.id);
			setColumns(newColumns);
		}
	};

	const onUpdateColumn = (columnUpdate) => {
		const newColumns = [...columns];
		const columnIndexToUpdate = newColumns.findIndex((item) => item.id === columnUpdate.id);
		if (columnUpdate._destroy) {
			// delete column
			newColumns.splice(columnIndexToUpdate, 1);
		} else {
			// update column
			newColumns.splice(columnIndexToUpdate, 1, columnUpdate);
			// newColumns.map((item) =>
			// 	item.id === columnUpdate.id ? { ...item, title: columnUpdate.title } : item,
			// );
		}
		const newBoard = { ...board };
		newBoard.columnOrder = newColumns.map((column) => column.id);
		newBoard.columns = newColumns;
		setColumns(newColumns);
		setBoard(newBoard);
	};

	return (
		<div className='d-flex board-content'>
			<Container
				orientation='horizontal'
				onDrop={onColumnDrop}
				getChildPayload={(index) => columns[index]}
				dragHandleSelector='.column-drag-handle'
				dropPlaceholder={{
					animationDuration: 150,
					showOnTop: true,
					className: 'columns-drop-preview',
				}}>
				{columns.map((column) => (
					<Draggable key={column.id}>
						<Column
							onCardDrop={onCardDrop}
							onUpdateColumn={onUpdateColumn}
							column={column}
						/>
					</Draggable>
				))}
			</Container>
			<Card style={{ marginRight: 20, minWidth: '360px', height: 'fit-content' }}>
				{/* {!openNewColumnForm && ( */}
				<CardHeader
					style={{ background: '#eee' }}
					className='d-block w-100 cursor-pointer py-0'
					onClick={handleToggleNewColumnForm}>
					<CardLabel className='py-4 w-100'>
						<div className='d-flex align-items-center'>
							<Icon size='lg' icon='PlusCircle' />
							<CardTitle className='mx-2 w-100'>Thêm công việc</CardTitle>
						</div>
					</CardLabel>
				</CardHeader>
				{/* )} */}

				{openNewColumnForm && (
					<CardBody>
						<WrapForm>
							<Form.Control
								ref={newColumnInputRef}
								className='rounded-0 add-column-input'
								name='column'
								size='sm'
								type='text'
								placeholder='Nhập công việc'
								value={newColumnTitle}
								onChange={handleNewColumnTitleChange}
								onKeyDown={(e) => e.key === 'Enter' && addNewColumn()}
							/>
							<div className='d-flex align-items-center'>
								<Button
									className='add-column-button'
									variant='info'
									onClick={addNewColumn}>
									Thêm công việc
								</Button>
								<Icon
									className='add-column-icon cursor-pointer'
									size='2x'
									icon='XLg'
									onClick={handleCloseNewColumnForm}
								/>
							</div>
						</WrapForm>
					</CardBody>
				)}
			</Card>
		</div>
	);
};

export default TaskBoard;
