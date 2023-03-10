import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';
import useDarkMode from '../../../../hooks/useDarkMode';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Select from '../../../../components/bootstrap/forms/Select';
import Option from '../../../../components/bootstrap/Option';
import Toasts from '../../../../components/bootstrap/Toasts';
// import { getAllUser } from '../services';

const BoardCard = ({ card, status, data, subtask, onAddStep }) => {
	const { darkModeStatus } = useDarkMode();
	const [editModalStatus, setEditModalStatus] = useState(false);
	const { addToast } = useToasts();
	const formik = useFormik({
		initialValues: {
			name: card?.name || '',
			description: card?.description || '',
			status: parseInt(status, 10) || 0,
			partner: card?.partner || '',
		},
		onSubmit: (values, { resetForm }) => {
			const valuesSubmit = { ...values };
			const subtaskClone = { ...subtask };
			const { steps } = subtaskClone;
			const stepsClone = [...steps];
			valuesSubmit.status = parseInt(values.status, 10);
			valuesSubmit.id = card.id;
			subtaskClone.steps = stepsClone.map((item) =>
				item.id === valuesSubmit.id ? { ...valuesSubmit } : item,
			);
			onAddStep(subtaskClone);
			setEditModalStatus(false);
			resetForm();
		},
	});
	// useEffect(() => {
	// 	async function fetchDataUsers() {
	// 		const response = await getAllUser();
	// 		const result = await response.data;
	// 		setUsers(result);
	// 	}
	// 	fetchDataUsers();
	// }, []);
	const handleShowToast = (titleToast, content, icon = 'Check2Circle', color = 'success') => {
		addToast(
			<Toasts title={titleToast} icon={icon} iconColor={color} time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};
	const handleDeleteStep = (dataDelete) => {
		try {
			const subtaskClone = { ...subtask };
			const initSteps = subtaskClone.steps;
			const newSteps = initSteps?.filter((item) => item.id !== dataDelete.id);
			subtaskClone.steps = newSteps;
			onAddStep(subtaskClone);
			handleShowToast(`Xo?? b?????c th???c hi???n`, `Xo?? b?????c th???c hi???n th??nh c??ng!`);
		} catch (error) {
			handleShowToast(`Xo?? b?????c th???c hi???n`, `Xo?? b?????c th???c hi???n th???t b???i!`);
		}
	};
	return (
		<>
			<Card shadow='md' borderSize={1} className='rounded-2' borderColor='info'>
				<CardHeader>
					<CardLabel onClick={() => setEditModalStatus(true)}>
						<CardTitle
							tag='h6'
							className={classNames('cursor-pointer', {
								'link-dark': !darkModeStatus,
								'link-light': darkModeStatus,
							})}
							data-tour={card.name}>
							{card.name}
						</CardTitle>
					</CardLabel>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleDeleteStep(card)}
						// eslint-disable-next-line prettier/prettier
						/>
				</CardHeader>
				<CardBody className='pt-0' onClick={() => setEditModalStatus(true)}>
					{card.description}
				</CardBody>
			</Card>

			<Modal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				size='lg'
				isScrollable
				isCentered
				data-tour='mail-app-modal'>
				<ModalHeader className='px-4' setIsOpen={setEditModalStatus}>
					<ModalTitle id='project-edit'>{card.name}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row'>
						<div className='col-md-8'>
							<Card shadow='sm'>
								<CardHeader>
									<CardLabel icon='Info' iconColor='success'>
										<CardTitle>Th??ng tin b?????c th???c hi???n</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<FormGroup className='col-12' id='name' label='T??n b?????c'>
											<Input
												ariaLabel='name'
												onChange={formik.handleChange}
												value={formik.values.name}
											/>
										</FormGroup>
										<FormGroup
											className='col-12'
											id='description'
											label='M?? t???'>
											<Textarea
												ariaLabel='description'
												onChange={formik.handleChange}
												value={formik.values.description}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-md-4'>
							<div className='row g-4 sticky-top'>
								<FormGroup className='col-12' id='status' label='Tr???ng th??i'>
									<Select
										ariaLabel='Board select'
										placeholder='Ch???n Tr???ng th??i'
										onChange={formik.handleChange}
										value={formik.values.status}>
										{data.map((group) => (
											<Option key={group.id} value={group.status}>
												{group.title}
											</Option>
										))}
									</Select>
								</FormGroup>
								{/* <FormGroup className='col-12' id='partner' label='C???n ph???i h???p'>
									<Select
										ariaLabel='Board select'
										placeholder='Ch???n ng?????i ph???i h???p'
										onChange={formik.handleChange}
										value={formik.values.partner}>
										{users.map((u) => (
											<Option key={u.id} value={u.id}>
												{`${u.name}`}
											</Option>
										))}
									</Select>
								</FormGroup> */}
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button
						color='primary'
						className='w-100 py-3'
						type='submit'
						onClick={formik.handleSubmit}>
						L??u l???i
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};
BoardCard.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	card: PropTypes.object.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	subtask: PropTypes.object.isRequired,
	status: PropTypes.number.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	data: PropTypes.array.isRequired,
	onAddStep: PropTypes.func.isRequired,
};

export default BoardCard;
