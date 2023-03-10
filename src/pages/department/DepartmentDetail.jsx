/* eslint-disable react/prop-types */
import React, { useState, memo, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Formik, useFormik } from 'formik';
import { Tab, Tabs } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Toasts from '../../components/bootstrap/Toasts';
import { updateDepartment } from './services';
import UserDetailPage from './UserDetailPage';
import validate from './validate';
import Checks from '../../components/bootstrap/forms/Checks';
import Select from '../../components/bootstrap/forms/Select';
import { fetchDepartmentWithUserList } from '../../redux/slice/departmentSlice';
import ComfirmSubtask from '../work-management/TaskDetail/TaskDetailForm/ComfirmSubtask';
import './style.scss';

// eslint-disable-next-line react/prop-types
const DepartmentDetail = ({ organizationLevelOptions, departmentList, initValues }) => {
	const [initData, setInitData] = useState({});
	const { addToast } = useToasts();
	const dispatch = useDispatch();
	const [isEdit, setIsEdit] = useState(true);
	const [openDelete, setOpenDelete] = useState(false);
	useEffect(() => {
		setInitData({ ...initValues });
	}, [initValues]);
	useEffect(() => {
		formik.initialValues = {
			id: initValues.id,
			code: initValues?.code,
			description: initValues?.description,
			name: initValues?.name,
			address: initValues?.address,
			status: initValues?.status,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initValues]);
	const formik = useFormik({
		initialValues: initData,
		enableReinitialize: true,
		validationSchema: validate,
		onSubmit: (values) => {
			handleSubmitForm(values);
			setIsEdit(true);
		},
	});

	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: true,
			},
		);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			organizationLevel: parseInt(data?.organizationLevel, 10),
			parentId: parseInt(data?.parentId, 10),
			id: data?.id,
			name: data.name,
			description: data.description,
			code: data.code,
			address: data.address,
			status: Number(data.status),
		};
		try {
			await updateDepartment(dataSubmit);
			setInitData({ ...dataSubmit });
			dispatch(fetchDepartmentWithUserList());
		} catch (error) {
			handleShowToast(`C???p nh???t ph??ng ban`, `C???p nh???t ph??ng ban kh??ng th??nh c??ng!`);
		}
	};

	const handleDelete = async (data) => {
		const dataSubmit = {
			organizationLevel: parseInt(data?.organizationLevel, 10),
			parentId: parseInt(data?.parentId, 10),
			id: data?.id,
			name: data.name,
			description: data.description,
			code: data.code,
			address: data.address,
			status: Number(data.status),
			isDelete: 1,
		};
		try {
			await updateDepartment(dataSubmit);
			setInitData({ ...dataSubmit });
			dispatch(fetchDepartmentWithUserList());
		} catch (error) {
			handleShowToast(`X??a ph??ng ban`, `X??a ph??ng ban kh??ng th??nh c??ng!`);
		}
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleEdit = () => {
		setIsEdit(false);
	};
	const handleOpenDelete = () => {
		setOpenDelete(!openDelete);
	};
	return (
		<div className='col-lg-9 col-md-6'>
			<Formik initialValues={initValues} enableReinitialize>
				<Card className='h-98'>
					<Card className='h-100 mb-0'>
						<Tabs defaultActiveKey='userDepartment' id='uncontrolled-tab-example'>
							<Tab
								eventKey='userDepartment'
								title='Danh s??ch nh??n vi??n'
								className='mb-3'>
								<UserDetailPage dataUser={initValues} />
							</Tab>
							<Tab
								eventKey='departmentDetail'
								title='Th??ng tin chi ti???t'
								className='mb-3'>
								<CardHeader>
									<CardLabel icon='Edit' iconColor='warning'>
										<CardTitle>
											{isEdit
												? 'Th??ng tin chi ti???t c?? c???u t??? ch???c'
												: 'Ch???nh s???a c???u t??? ch???c'}
										</CardTitle>
									</CardLabel>
									<CardActions>
										{isEdit && (
											<div>
												<Button
													color='info'
													size='lg'
													icon='Build'
													tag='button'
													// className='w-30 p-3'
													onClick={() => handleEdit()}
												/>
												<Button
													color='danger'
													size='lg'
													icon='Trash'
													tag='button'
													// className='w-5 p-3'
													style={{ marginLeft: '3px' }}
													onClick={() => handleOpenDelete()}
												/>
											</div>
										)}
									</CardActions>
								</CardHeader>
								<CardBody className='pt-0'>
									<div className='row g-4'>
										<div className='col-md-6'>
											<FormGroup id='name' label='T??n ????n v???'>
												<Input
													disabled={isEdit}
													placeholder='T??n ????n v???'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.name}
													isValid={formik.isValid}
													isTouched={formik.touched.name}
													invalidFeedback={formik.errors.name}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-6'>
											<FormGroup id='slug' label='M?? c?? c???u t??? ch???c'>
												<Input
													disabled={isEdit}
													type='text'
													placeholder='M?? ????n v???'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.slug}
													isValid={formik.isValid}
													isTouched={formik.touched.slug}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
											<FormGroup id='parentId' label='Thu???c ????n v???'>
												<Select
													list={departmentList}
													disabled={isEdit}
													type='text'
													placeholder='Ch???n ????n v??? tr???c thu???c'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.parentId}
													isValid={formik.isValid}
													isTouched={formik.touched.parentId}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
											<FormGroup id='organizationLevel' label='C???p t??? ch???c'>
												<Select
													list={organizationLevelOptions}
													disabled={isEdit}
													type='text'
													placeholder='Ch???n c???p t??? ch???c'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.organizationLevel}
													isValid={formik.isValid}
													isTouched={formik.touched.organizationLevel}
													size='lg'
													className='border border-2 shadow-none'
												/>
											</FormGroup>
										</div>
										<div className='col-md-12'>
											<FormGroup id='description' label='M?? t???'>
												<Textarea
													disabled={isEdit}
													rows={3}
													placeholder='M?? t???'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.description}
													isValid={formik.isValid}
													isTouched={formik.touched.description}
													size='lg'
													className='border border-2 shadow-none'
													name='description'
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup id='address' label='?????a ch???'>
												<Textarea
													disabled={isEdit}
													rows={3}
													placeholder='?????a ch???'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.address}
													isValid={formik.isValid}
													isTouched={formik.touched.address}
													invalidFeedback={formik.errors.address}
													size='lg'
													className='border border-2 shadow-none'
													name='address'
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup id='status' label='Tr???ng th??i ho???t ?????ng'>
												<Checks
													disabled={isEdit}
													id='status'
													type='switch'
													size='lg'
													label={
														Number(formik.values.status) === 1
															? '??ang ho???t ?????ng'
															: 'Kh??ng ho???t ?????ng'
													}
													onChange={formik.handleChange}
													checked={formik.values.status}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<div className='w-100 mt-4 text-center'>
												{!isEdit && (
													<Button
														color='primary'
														size='lg'
														className='w-50 p-3'
														type='submit'
														onClick={formik.handleSubmit}>
														L??u th??ng tin
													</Button>
												)}
											</div>
										</div>
									</div>
									<ComfirmSubtask
										openModal={openDelete}
										onCloseModal={handleOpenDelete}
										onConfirm={() => handleDelete(initValues)}
										title='Xo?? c?? c???u t??? ch???c'
										content={`X??c nh???n xo?? c?? c???u t??? ch???c <strong>${initValues?.name}</strong> ?`}
									/>
								</CardBody>
							</Tab>
						</Tabs>
					</Card>
				</Card>
			</Formik>
		</div>
	);
};

export default memo(DepartmentDetail);
