/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { parseInt } from 'lodash';
import moment from 'moment';
import styled from 'styled-components';
import SelectComponent from 'react-select';
import { Button, Modal } from 'react-bootstrap';
import {
	getAllDepartments,
	getAllKeys,
	getAllTasks,
	getAllUser,
	getSubTaskById,
} from '../services';
import Option from '../../../../components/bootstrap/Option';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Icon from '../../../../components/icon/Icon';
import Select from '../../../../components/bootstrap/forms/Select';

const ErrorText = styled.span`
	font-size: 14px;
	color: #e22828;
	margin-top: 5px;
`;
const TaskDetailForm = ({ show, onClose, item, onSubmit, isShowTask = false }) => {
	// state
	const [departmentOptions, setDepartmentOptions] = useState([]);
	const [userOptions, setUserOptions] = useState([]);
	const [taskOptions, setTaskOptions] = useState([]);
	const [subtask, setSubtask] = useState({}); // subtask
	const [keysState, setKeysState] = useState([]);
	const [valueDepartment, setValueDepartment] = useState({});
	const [valueUser, setValueUser] = useState({});
	const [valueTask, setValueTask] = useState({});
	const [usersRelated, setUsersRelated] = useState([]);
	const [departmentRelated, setDepartmentRelated] = useState([]);
	const [keyOption, setKeyOption] = useState([]);
	const PRIORITIES = [5, 4, 3, 2, 1];
	const initError = {
		name: { errorMsg: '' },
		kpiValue: { errorMsg: '' },
		user: { errorMsg: '' },
		department: { errorMsg: '' },
	};
	const [errors, setErrors] = useState(initError);

	const nameRef = useRef(null);
	const kpiRef = useRef(null);
	const userRef = useRef(null);
	const departmentRef = useRef(null);
	const initsubtask = {
		userId: '',
		departmentId: '',
		priority: 2,
		status: 0,
		name: '',
		description: '',
		estimateDate: '',
		estimateTime: '',
		deadlineDate: '',
		deadlineTime: '',
		kpiValue: 0,
		keys: [],
		steps: [],
		notes: [],
		users: [],
		departments: [],
	};
	// render data
	useEffect(() => {
		getAllDepartments().then((res) => {
			setDepartmentOptions(
				res?.data?.map((department) => {
					return {
						id: department.id,
						label: department.name,
						value: department.id,
					};
				}),
			);
		});
		getAllUser().then((res) => {
			setUserOptions(
				res?.data?.map((user) => {
					return {
						id: user.id,
						label: user.name,
						value: user.id,
					};
				}),
			);
		});
		setErrors(initError);
		if (item?.id) {
			getSubTaskById(item?.id).then((res) => {
				const response = res.data;
				setSubtask(response.data);
				setValueUser({
					id: response.data?.users[0]?.id,
					label: response.data?.users[0]?.name,
					value: response.data.users[0].id,
				});
				setValueDepartment({
					id: response.data?.departments[0]?.id,
					label: response.data?.departments[0]?.name,
					value: response.data.departments[0].id,
				});
				setUsersRelated(
					response.data?.users?.slice(1)?.map((user) => {
						return {
							id: user.id,
							label: user.name,
							value: user.id,
						};
					}),
				);
				setDepartmentRelated(
					response.data?.departments?.slice(1)?.map((department) => {
						return {
							id: department.id,
							label: department.name,
							value: department.id,
						};
					}),
				);
				setKeysState(response.data?.keys || []);
			});
		} else {
			setUsersRelated([]);
			setDepartmentRelated([]);
			setValueDepartment({});
			setValueUser({});
			setSubtask(initsubtask);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item?.id]);

	useEffect(() => {
		getAllTasks().then((res) => {
			setTaskOptions(
				res.data.map((task) => {
					return {
						id: task.id,
						label: task.name,
						value: task.id,
					};
				}),
			);
		});
	}, []);

	useEffect(() => {
		async function getKey() {
			try {
				const response = await getAllKeys();
				const data = await response.data;
				setKeyOption(data);
			} catch (error) {
				setKeyOption([]);
			}
		}
		getKey();
	}, []);
	// valueDalite
	const onValidate = (value, name) => {
		setErrors((prev) => ({
			...prev,
			[name]: { ...prev[name], errorMsg: value },
		}));
	};
	const validateFieldForm = (field, value) => {
		if (!value) {
			onValidate(true, field);
		}
	};
	const validateForm = () => {
		validateFieldForm('name', subtask?.name);
		validateFieldForm('kpiValue', subtask?.kpiValue);
		validateFieldForm('department', valueDepartment?.label);
		validateFieldForm('user', valueUser?.label);
	};

	const prevIsValid = () => {
		if (keysState?.length === 0 || !keysState) {
			return true;
		}
		const someEmpty = keysState?.some(
			(key) => key?.keyName === '' || key?.keyValue === '' || key.keyType === '',
		);

		if (someEmpty) {
			// eslint-disable-next-line array-callback-return
			keysState?.map((_key, index) => {
				const allPrev = [...keysState] || [];
				if (keysState[index]?.keyName === '') {
					allPrev[index].error.keyName = 'Nh???p T??n ch??? s??? ????nh gi??!';
				}
				if (keysState[index]?.keyValue === '') {
					allPrev[index].error.keyValue = 'Nh???p gi?? tr??? key!';
				}
				if (keysState[index].keyType === '') {
					allPrev[index].error.keyType = 'Nh???p lo???i key!';
				}
				setKeysState(allPrev);
			});
		}

		return !someEmpty;
	};
	const handleRemoveKeyField = (_e, index) => {
		setKeysState((prev) => prev?.filter((state) => state !== prev[index]));
	};

	const handleChangeKeysState = (index, event) => {
		event.preventDefault();
		event.persist();
		setKeysState((prev) => {
			return prev?.map((key, i) => {
				if (i !== index) return key;
				return {
					...key,
					[event.target.name]: event.target.value,
					error: {
						...key.error,
						[event.target.name]:
							event.target.value.length > 0 ? null : `Vui l??ng nh???p ?????u ????? th??ng tin`,
					},
				};
			});
		});
	};
	const handleAddFieldKey = () => {
		const initKeyState = {
			keyName: '',
			keyValue: '',
			keyType: '',
			error: {
				keyName: null,
				keyValue: null,
				keyType: null,
			},
		};
		if (prevIsValid()) {
			setKeysState((prev) => [...prev, initKeyState]);
		}
	};

	// handle
	const handleChange = (e) => {
		const { value, name } = e.target;
		setSubtask({
			...subtask,
			[name]: value,
		});
	};

	const person = window.localStorage.getItem('name');
	const handleSubmit = async () => {
		validateForm();
		if (!subtask?.name) {
			nameRef.current.focus();
			return;
		}
		if (!valueDepartment.value) {
			departmentRef.current.focus();
			return;
		}
		if (!valueUser?.value) {
			userRef.current.focus();
			return;
		}
		if (!subtask?.kpiValue) {
			kpiRef.current.focus();
			return;
		}

		const valueUsers = [
			{
				id: valueUser.id,
				name: valueUser.label,
			},
			...usersRelated.map((user) => {
				return {
					id: user.id,
					name: user.label,
				};
			}),
		];
		const valueDepartments = [
			{
				id: valueDepartment.id,
				name: valueDepartment.label,
			},
			...departmentRelated.map((department) => {
				return {
					id: department.id,
					name: department.label,
				};
			}),
		];
		setErrors(initError);
		const newWorks = JSON.parse(JSON.stringify(subtask?.logs || []));
		const newNotes = JSON.parse(JSON.stringify(subtask?.notes || []));
		const newLogs = [
			...newWorks,
			{
				user: person,
				type: 2,
				prevStatus: null,
				nextStatus: subtask?.id ? 'C???p nh???t' : 'Th??m m???i',
				subtaskId: subtask.id,
				subtaskName: subtask?.name,
				time: moment().format('YYYY/MM/DD hh:mm'),
				createdAt: Date.now(),
			},
		];
		const dataSubmit = { ...subtask };
		dataSubmit.kpiValue = parseInt(subtask?.kpiValue, 10);
		dataSubmit.priority = parseInt(subtask?.priority, 10);
		dataSubmit.keys = keysState.map((key) => {
			return {
				keyName: key.keyName,
				keyValue: key.keyValue,
				keyType: key.keyType,
			};
		});
		dataSubmit.userId = valueUser.id;
		dataSubmit.taskId = parseInt(item.taskId, 10) || null;
		dataSubmit.users = valueUsers;
		dataSubmit.departmentId = valueDepartment.id;
		dataSubmit.departments = valueDepartments;
		const newData = { ...dataSubmit, logs: newLogs, notes: newNotes };
		onSubmit(newData);
		handleCloseForm();
	};

	// handle form
	// close form
	const handleCloseForm = () => {
		onClose();
		setSubtask(initsubtask);
		setKeysState([]);
		setUsersRelated([]);
		setDepartmentRelated([]);
		setValueDepartment({});
		setValueUser({});
		setErrors({});
	};
	const compare = ['>', '=', '<', '<=', '>='];
	return (
		<Modal show={show} onHide={handleCloseForm} size='lg' scrollable centered>
			<Modal.Header closeButton>
				<Modal.Title id='project-edit'>
					{item?.id ? 'C???p nh???t ?????u vi???c' : 'Th??m m???i ?????u vi???c '}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='row g-4 px-2'>
					<div className='col-12'>
						<FormGroup id='name' label='T??n ?????u vi???c' color='red'>
							<Input
								onChange={handleChange}
								placeholder='T??n ?????u vi???c'
								value={subtask.name || ''}
								name='name'
								ariaLabel='name'
								ref={nameRef}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
						{errors?.name?.errorMsg && (
							<ErrorText>Vui l??ng nh???p t??n ?????u vi???c</ErrorText>
						)}
					</div>
					{isShowTask && (
						<div className='col-12'>
							<FormGroup id='task' label='Thu???c c??ng vi???c' color='red'>
								<SelectComponent
									placeholder='Thu???c c??ng vi???c'
									defaultValue={valueTask}
									value={valueTask}
									onChange={setValueTask}
									options={taskOptions}
								/>
							</FormGroup>
						</div>
					)}
					<div className='col-12'>
						<FormGroup id='description' label='M?? t??? ?????u vi???c'>
							<Textarea
								className='h-100 border border-2 rounded-0 shadow-none'
								placeholder='note'
								value={subtask.description}
								name='description'
								ariaLabel='description'
								onChange={handleChange}
							/>
						</FormGroup>
						{errors?.description?.errorMsg && (
							<ErrorText>Vui l??ng nh???p m?? t???</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='kpiValue' label='Gi?? tr??? KPI' color='red'>
							<Input
								type='number'
								placeholder='Gi?? tr??? KPI'
								value={subtask.kpiValue || ''}
								name='kpiValue'
								onChange={handleChange}
								ariaLabel='kpiValue'
								ref={kpiRef}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
						{errors?.kpiValue?.errorMsg && (
							<ErrorText>Vui l??ng nh???p gi?? tr??? KPI</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='priority' label='????? ??u ti??n' color='red'>
							<Select
								name='priority'
								placeholder='????? ??u ti??n'
								className='border border-2 rounded-0 shadow-none'
								onChange={handleChange}
								value={subtask?.priority}
								defaultValue={2}>
								{PRIORITIES.map((priority) => (
									<Option key={priority} value={priority}>
										{`C???p ${priority}`}
									</Option>
								))}
							</Select>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='department' label='Ph??ng ban ph??? tr??ch' color='red'>
							<SelectComponent
								placeholder='Ph??ng ban ph??? tr??ch'
								defaultValue={valueDepartment}
								value={valueDepartment}
								onChange={setValueDepartment}
								options={departmentOptions}
								ref={departmentRef}
							/>
						</FormGroup>
						{errors?.department?.errorMsg && (
							<ErrorText>Vui l??ng ch???n ph??ng ban ph??? tr??ch</ErrorText>
						)}
					</div>
					<div className='col-6'>
						<FormGroup id='user' label='Nh??n vi??n ph??? tr??ch' color='red'>
							<SelectComponent
								defaultValue={valueUser}
								value={valueUser}
								onChange={setValueUser}
								options={userOptions}
								ref={userRef}
							/>
						</FormGroup>
						{errors?.user?.errorMsg && (
							<ErrorText>Vui l??ng ch???n ng?????i ph??? tr??ch</ErrorText>
						)}
					</div>
					<div className='col-12'>
						<FormGroup id='department' label='Ph??ng ban li??n quan'>
							<SelectComponent
								isMulti
								defaultValue={departmentRelated}
								value={departmentRelated}
								onChange={setDepartmentRelated}
								options={departmentOptions?.filter(
									(department) => department.id !== valueDepartment.id,
								)}
								placeholder=''
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup id='user' label=''>
							<SelectComponent
								isMulti
								defaultValue={usersRelated}
								value={usersRelated}
								onChange={setUsersRelated}
								options={userOptions?.filter((user) => user.id !== valueUser.id)}
								placeholder=''
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='estimateDate' label='Ng??y ho??n th??nh ?????c t??nh' isFloating>
							<Input
								placeholder='Ng??y ho??n th??nh ?????c t??nh'
								type='date'
								value={subtask.estimateDate || ''}
								name='estimateDate'
								ariaLabel='estimateDate'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup
							id='estimateTime'
							label='Th???i gian ho??n th??nh ?????c t??nh'
							isFloating>
							<Input
								placeholder='Th???i gian ho??n th??nh ?????c t??nh'
								type='time'
								value={subtask.estimateTime || ''}
								name='estimateTime'
								ariaLabel='estimateTime'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineDate' label='H???n ng??y ho??n th??nh' isFloating>
							<Input
								placeholder='H???n ng??y ho??n th??nh'
								type='date'
								value={subtask.deadlineDate || ''}
								name='deadlineDate'
								ariaLabel='deadlineDate'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='deadlineTime' label='H???n th???i gian ho??n th??nh' isFloating>
							<Input
								placeholder='H???n th???i gian ho??n th??nh'
								type='time'
								value={subtask.deadlineTime || ''}
								name='deadlineTime'
								ariaLabel='deadlineTime'
								onChange={handleChange}
								className='border border-2 rounded-0 shadow-none'
							/>
						</FormGroup>
					</div>
					<div className='col-12'>
						<FormGroup>
							<Button
								variant='success'
								onClick={handleAddFieldKey}
								icon='AddCircle'
								color='success'>
								Th??m ti??u ch?? ????nh gi??
							</Button>
						</FormGroup>
						{/* eslint-disable-next-line no-shadow */}
						{keysState?.map((item, index) => {
							return (
								<div
									key={item.id}
									// eslint-disable-next-line react/no-array-index-key
									className='mt-4 d-flex align-items-center justify-content-between'>
									<div
										style={{
											width: '40%',
											marginRight: 10,
										}}>
										<FormGroup
											className='mr-2'
											id='name'
											label={`Ch??? s??? key ${index + 1}`}>
											<Select
												name='keyName'
												required
												size='lg'
												className='border border-2 rounded-0 shadow-none'
												placeholder='Ch???n ch??? s??? Key'
												value={item?.keyName}
												onChange={(e) => handleChangeKeysState(index, e)}>
												{keyOption.map((key) => (
													<Option
														key={`${key.name} (${key?.unit?.name})`}
														value={`${key.name} (${key?.unit?.name})`}>
														{`${key?.name} (${key?.unit?.name})`}
													</Option>
												))}
											</Select>
										</FormGroup>
										{item.error?.keyName && (
											<ErrorText>{item.error?.keyName}</ErrorText>
										)}
									</div>
									<div style={{ width: '15%' }}>
										<FormGroup className='ml-2' id='type' label='So s??nh'>
											<Select
												onChange={(e) => handleChangeKeysState(index, e)}
												value={item?.keyType}
												name='keyType'
												size='lg'
												required
												ariaLabel='So s??nh'
												className='border border-2 rounded-0 shadow-none'
												placeholder='> = <'>
												{compare.map((element) => (
													<Option key={`${element}`} value={`${element}`}>
														{`${element}`}
													</Option>
												))}
											</Select>
										</FormGroup>
										{item.error?.keyType && (
											<ErrorText>{item.error?.keyType}</ErrorText>
										)}
									</div>
									<div style={{ width: '30%', marginLeft: 10 }}>
										<FormGroup className='ml-2' id='name' label='Gi?? tr??? key'>
											<Input
												onChange={(e) => handleChangeKeysState(index, e)}
												value={item?.keyValue || ''}
												name='keyValue'
												size='lg'
												required
												className='border border-2 rounded-0 shadow-none'
												placeholder='VD: 100 , 1000 , ..'
											/>
										</FormGroup>
										{item.error?.keyValue && (
											<ErrorText>{item.error?.keyValue}</ErrorText>
										)}
									</div>
									<FormGroup>
										<Button
											color='light'
											variant='light'
											style={{
												background: 'transparent',
												border: 0,
											}}
											size='lg'
											className='mt-4 h-100'
											onClick={(e) => handleRemoveKeyField(e, index)}>
											<Icon icon='Trash' size='lg' />
										</Button>
									</FormGroup>
								</div>
							);
						})}
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer>
				<Button variant='secondary' onClick={handleCloseForm}>
					????ng
				</Button>
				<Button variant='primary' type='submit' onClick={handleSubmit}>
					L??u ?????u vi???c
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
export default TaskDetailForm;
