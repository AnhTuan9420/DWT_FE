import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import TableCommon from '../common/ComponentCommon/TableCommon';
import { demoPages } from '../../menu';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import validate from './validate';
import Toasts from '../../components/bootstrap/Toasts';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import { toggleFormSlice } from '../../redux/common/toggleFormSlice';
import { fetchRequirementList } from '../../redux/slice/requirementSlice';
import { addRequirement, updateRequirement, deleteRequirement } from './services';
import CommonForm from '../common/ComponentCommon/CommonForm';
import TaskAlertConfirm from '../work-management/mission/TaskAlertConfirm';
import NotPermission from '../presentation/auth/NotPermission';

const RecruitmentRequirementPage = () => {
	const { darkModeStatus } = useDarkMode();
	const [searchParams] = useSearchParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const localtion = useLocation();
	const { addToast } = useToasts();

	const toggleForm = useSelector((state) => state.toggleForm.open);
	const itemEdit = useSelector((state) => state.toggleForm.data);

	const handleOpenForm = (data) => dispatch(toggleFormSlice.actions.openForm(data));
	const handleCloseForm = () => dispatch(toggleFormSlice.actions.closeForm());

	const requirements = useSelector((state) => state.requirement.requirements);
	const pagination = useSelector((state) => state.requirement.pagination);

	const [itemDelete, setItemDelete] = React.useState({});
	const [isDelete, setIsDelete] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(page || 1);

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		dispatch(fetchRequirementList(query));
	}, [dispatch, page, text]);

	const handleSubmitSearch = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: 1,
			}).toString(),
		});
	};

	const handleChangeCurrentPage = (searchValue) => {
		navigate({
			pathname: localtion.pathname,
			search: createSearchParams({
				text: searchValue.text,
				page: searchValue.page,
			}).toString(),
		});
	};
	const columns = [
		{
			title: 'T??n y??u c???u',
			placeholder: 't??n y??u c???u',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'M?? t???',
			placeholder: 'm?? t???',
			id: 'description',
			key: 'description',
			type: 'textarea',
			align: 'left',
			isShow: true,
		},
		{
			title: 'H??nh ?????ng',
			id: 'action',
			key: 'action',
			align: 'center',
			render: (item) => (
				<>
					<Button
						isOutline={!darkModeStatus}
						color='success'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Edit'
						onClick={() => handleOpenForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2'
						icon='Trash'
						onClick={() => handleOpenDelete(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

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
			id: parseInt(data.id, 10),
			name: data.name,
			description: data?.description,
		};
		if (data.id) {
			// eslint-disable-next-line no-useless-catch
			try {
				const response = await updateRequirement(dataSubmit);
				await response.data;
				dispatch(fetchRequirementList());
				handleCloseForm();
				handleShowToast(
					`C???p nh???t y??u c???u tuy???n d???ng!`,
					`C???p nh???t y??u c???u tuy???n d???ng th??nh c??ng!`,
				);
			} catch (error) {
				handleShowToast(
					`C???p nh???t y??u c???u tuy???n d???ng`,
					`C???p nh???t y??u c???u tuy???n d???ng kh??ng th??nh c??ng!`,
				);
			}
		} else {
			// eslint-disable-next-line no-useless-catch
			try {
				const response = await addRequirement(dataSubmit);
				await response.data;
				dispatch(fetchRequirementList());
				handleCloseForm();
				handleShowToast(`Th??m y??u c???u tuy???n d???ng`, `Th??m y??u c???u tuy???n d???ng th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`Th??m c???u tuy???n d???ng`, `Th??m c???u tuy???n d???ng kh??ng th??nh c??ng!`);
			}
		}
	};

	const handleOpenDelete = (item) => {
		setIsDelete(true);
		setItemDelete({ ...item });
	};
	const handleCloseDelete = () => {
		setIsDelete(false);
	};

	const handleDeleteRequirement = async (data) => {
		// eslint-disable-next-line no-useless-catch
		try {
			await deleteRequirement(data);
			const query = {};
			query.text = text;
			query.page = 1;
			dispatch(fetchRequirementList(query));
			handleShowToast(`Xo?? y??u c???u tuy???n d???ng`, `Xo?? y??u c???u tuy???n d???ng th??nh c??ng!`);
		} catch (error) {
			handleShowToast(`Xo?? y??u c???u tuy???n d???ng`, `Xo?? y??u c???u tuy???n d???ng kh??ng th??nh c??ng!`);
		}
		handleCloseDelete();
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.recruitmentRequirements.text}>
			<Page container='fluid'>
				{verifyPermissionHOC(
					<>
						<div
							className='row mb-0'
							style={{ maxWidth: '60%', minWidth: '60%', margin: '0 auto' }}>
							<div className='col-12'>
								<Card className='w-100'>
									<div style={{ margin: '24px 24px 0' }}>
										<CardHeader>
											<CardLabel icon='AccountCircle' iconColor='primary'>
												<CardTitle>
													<CardLabel>
														Danh s??ch y??u c???u tuy???n d???ng
													</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='PersonPlusFill'
													tag='button'
													onClick={() => handleOpenForm(null)}>
													Th??m m???i
												</Button>
											</CardActions>
										</CardHeader>
										<div className='p-4'>
											<TableCommon
												className='table table-modern mb-0'
												columns={columns}
												data={requirements}
												onSubmitSearch={handleSubmitSearch}
												onChangeCurrentPage={handleChangeCurrentPage}
												currentPage={parseInt(currentPage, 10)}
												totalItem={pagination?.totalRows}
												total={pagination?.total}
												setCurrentPage={setCurrentPage}
												searchvalue={text}
												isSearch
											/>
										</div>
									</div>
								</Card>
							</div>
						</div>
						<CommonForm
							show={toggleForm}
							onClose={handleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={
								itemEdit?.id
									? 'C???p nh???t y??u c???u n??ng l???c'
									: 'Th??m m???i y??u c???u n??ng l???c'
							}
							fields={columns}
							validate={validate}
						/>
						<TaskAlertConfirm
							openModal={isDelete}
							onCloseModal={handleCloseDelete}
							onConfirm={() => handleDeleteRequirement(itemDelete?.id)}
							title='Xo?? y??u c???u n??ng l???c'
							content={`X??c nh???n xo?? y??u c???u n??ng l???c <strong>${itemDelete?.name}</strong> ?`}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
			</Page>
		</PageWrapper>
	);
};

export default RecruitmentRequirementPage;
