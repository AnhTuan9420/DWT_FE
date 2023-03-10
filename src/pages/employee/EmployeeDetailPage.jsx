import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import { useToasts } from 'react-toast-notifications';
import Button from '../../components/bootstrap/Button';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import validate from './validate';
import { demoPages } from '../../menu';
import Input from '../../components/bootstrap/forms/Input';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Avatar from '../../components/Avatar';
import { getUserById, updateEmployee } from './services';
import Textarea from '../../components/bootstrap/forms/Textarea';
import SubHeaderCommon from '../common/SubHeaders/SubHeaderCommon';
import Toasts from '../../components/bootstrap/Toasts';

const EmployeePage = () => {
	const params = useParams();
	const { addToast } = useToasts();
	const [user, setUser] = useState({});
	const formik = useFormik({
		initialValues: {
			code: user?.code || '',
			name: user?.name || '',
			email: user?.email || '',
			phone: user?.phone || '',
			address: user?.address || '',
			city: user?.city || '',
			dateOfBirth: user?.dateOfBirth || '',
			dateOfJoin: user?.dateOfJoin || '',
			department: user?.department?.name || '',
			active: true,
		},
		enableReinitialize: true,
		validate,
		onSubmit: (values, { resetForm }) => {
			handleSubmitForm(values);
			resetForm();
		},
	});

	useEffect(() => {
		async function getInfoUserById(id) {
			try {
				const response = await getUserById(id);
				const data = await response.data;
				setUser(data);
				formik.initialValues = {
					code: data?.code,
					name: data?.name,
					email: data?.email,
					phone: data?.phone,
					address: data?.address,
					city: data?.city,
					dateOfBirth: user?.dateOfBirth || '',
					dateOfJoin: user?.dateOfJoin || '',
					department: data?.department,
				};
			} catch (error) {
				setUser({});
			}
		}
		getInfoUserById(params.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);

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
			id: data?.id,
			name: data.name,
			departmentId: params.id,
			code: data.code,
			email: data.email,
			password: '123456',
			dateOfBirth: data.dateOfBirth,
			dateOfJoin: data.dateOfJoin,
			phone: data.phone,
			address: data.address,
			status: Number(data.status),
			roles: ['user'],
		};
		try {
			const response = await updateEmployee(dataSubmit);
			const result = await response.data;
			setUser(result);
			handleShowToast(
				`C???p nh???t nh??n vi??n!`,
				`Nh??n vi??n ${result.name} ???????c c???p nh???t th??nh c??ng!`,
			);
		} catch (error) {
			handleShowToast(`C???p nh???t nh??n vi??n`, `C???p nh???t nh??n vi??n kh??ng th??nh c??ng!`);
		}
	};

	return (
		<PageWrapper title={demoPages.hrRecords.subMenu.hrList.text}>
			<SubHeaderCommon />
			<Page>
				<div className='row h-100'>
					<div className='col-lg-4 col-md-6'>
						<Card className='h-100'>
							<CardHeader>
								<CardLabel icon='AccountCircle'>
									<CardTitle>Th??ng tin</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-3'>
									<div className='col-12'>
										<Button
											icon='Contacts'
											color='info'
											className='w-100 p-3'
											isLight>
											T??i kho???n
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8 col-md-6'>
						{isEmpty(user) ? (
							<h1>zz.</h1>
						) : (
							<Formik initialValues={user} enableReinitialize>
								<Card className='h-100'>
									<Card style={{ minHeight: 250 }}>
										<CardHeader>
											<CardLabel icon='Assignment'>
												<CardTitle>Th??ng tin nh??n vi??n</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody>
											<div className='row g-4 align-items-center'>
												<div className='col-xl-3'>
													<Avatar
														srcSet='https://s.memehay.com/files/posts/20200813/a0411f5f0bd3f731df35ba98342e44fekien-thuc-ki-quai-nay-da-duoc-tiep-thu.png'
														src='https://s.memehay.com/files/posts/20200813/a0411f5f0bd3f731df35ba98342e44fekien-thuc-ki-quai-nay-da-duoc-tiep-thu.png'
													/>
												</div>
												<div className='col-xl-9'>
													<div className='row'>
														<div className='col-xl-6 mb-4'>
															<FormGroup
																id='code'
																label='M?? nh??n vi??n'
																isFloating>
																<Input
																	placeholder='M?? nh??n vi??n'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={formik.values.code}
																	isValid={formik.isValid}
																	isTouched={formik.touched.code}
																	size='lg'
																	invalidFeedback={
																		formik.errors.code
																	}
																	disabled
																	className='border border-2 shadow-none'
																/>
															</FormGroup>
														</div>
														<div className='col-xl-6 mb-4'>
															<FormGroup
																id='dateOfJoin'
																label='Ng??y gia nh???p'
																isFloating>
																<Input
																	type='date'
																	placeholder='Ng??y gia nh???p'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={formik.values.dateOfJoin}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.dateOfJoin
																	}
																	invalidFeedback={
																		formik.errors.dateOfJoin
																	}
																	size='lg'
																	disabled
																	className='border border-2 shadow-none'
																/>
															</FormGroup>
														</div>
														<div className='col-xl-6'>
															<FormGroup
																id='department'
																label='Ph??ng ban'
																isFloating>
																<Input
																	placeholder='Ph??ng ban'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={formik.values.department}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.department
																	}
																	invalidFeedback={
																		formik.errors.department
																	}
																	size='lg'
																	className='border border-2 shadow-none'
																/>
															</FormGroup>
														</div>
														<div className='col-xl-6'>
															<FormGroup
																id='photo'
																label='Ch???n ???nh'
																isFloating>
																<Input
																	type='file'
																	size='lg'
																	className='border border-2 shadow-none'
																/>
															</FormGroup>
														</div>
													</div>
												</div>
											</div>
										</CardBody>
									</Card>
									<Card className='h-100 mb-0'>
										<CardHeader>
											<CardLabel icon='Edit' iconColor='warning'>
												<CardTitle>Th??ng tin chi ti???t</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-md-6'>
													<FormGroup
														id='name'
														label='H??? v?? t??n'
														isFloating>
														<Input
															placeholder='H??? v?? t??n'
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
													<FormGroup
														id='dateOfBirth'
														label='Ng??y sinh'
														isFloating>
														<Input
															type='date'
															placeholder='Ng??y sinh'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.dateOfBirth}
															isValid={formik.isValid}
															isTouched={formik.touched.dateOfBirth}
															invalidFeedback={
																formik.errors.dateOfBirth
															}
															size='lg'
															className='border border-2 shadow-none'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup id='email' label='Email' isFloating>
														<Input
															placeholder='Email'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.email}
															isValid={formik.isValid}
															isTouched={formik.touched.email}
															invalidFeedback={formik.errors.email}
															size='lg'
															className='border border-2 shadow-none'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='phone'
														label='S??? ??i???n tho???i'
														isFloating>
														<Input
															placeholder='S??? ??i???n tho???i'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.phone}
															isValid={formik.isValid}
															isTouched={formik.touched.phone}
															invalidFeedback={formik.errors.phone}
															size='lg'
															className='border border-2 shadow-none'
														/>
													</FormGroup>
												</div>
												<div className='col-12'>
													<FormGroup id='address' label='?????a ch???'>
														<Textarea
															rows={5}
															placeholder='?????a ch???'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.address}
															isValid={formik.isValid}
															isTouched={formik.touched.address}
															invalidFeedback={formik.errors.address}
															size='lg'
															className='border border-2 shadow-none'
														/>
													</FormGroup>
												</div>
												<div className='col-12'>
													<div className='w-100 mt-4 text-center'>
														<Button
															color='primary'
															size='lg'
															className='w-50 p-3'
															type='submit'
															onClick={formik.handleSubmit}>
															L??u th??ng tin
														</Button>
													</div>
												</div>
											</div>
										</CardBody>
									</Card>
								</Card>
							</Formik>
						)}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default EmployeePage;
