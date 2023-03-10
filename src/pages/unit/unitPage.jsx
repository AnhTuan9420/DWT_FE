import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, createSearchParams, useSearchParams } from 'react-router-dom';
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
import Toasts from '../../components/bootstrap/Toasts';
import useDarkMode from '../../hooks/useDarkMode';
import CommonForm from '../common/ComponentCommon/CommonForm';
import ComfirmSubtask from '../work-management/TaskDetail/TaskDetailForm/ComfirmSubtask';
import { getAllUnits, addUnit, updateUnit, deleteUnit } from './services';
import validate from './validate';
import verifyPermissionHOC from '../../HOC/verifyPermissionHOC';
import NotPermission from '../presentation/auth/NotPermission';

const UnitPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { addToast } = useToasts();
	const navigate = useNavigate();
	const localtion = useLocation();
	const [searchParams] = useSearchParams();

	const text = searchParams.get('text') || '';
	const page = searchParams.get('page') || '';

	const [openForm, setOpenForm] = useState(false);
	const [itemEdit, setItemEdit] = useState({});
	const [units, setUnits] = useState({});
	const [deletes, setDeletes] = React.useState({});
	const [openConfirm, set0penConfirm] = React.useState(false);
	const [currentPage, setCurrentPage] = useState(page || 1);

	async function getUnit(query) {
		try {
			const response = await getAllUnits(query);
			const data = await response.data;
			setUnits(data);
		} catch (error) {
			setUnits([]);
		}
	}

	useEffect(() => {
		const query = {};
		query.text = text;
		query.page = text ? 1 : page;
		getUnit(query);
	}, [page, text]);

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
		const query = {};
		query.text = text;
		query.page = page;
		getUnit(query);
	};

	const handleOpenConfirm = (item) => {
		setDeletes({
			id: item.id,
			name: item.name,
		});
		set0penConfirm(true);
	};

	const handleCloseDeleteComfirm = () => {
		setDeletes({});
		set0penConfirm(false);
	};

	const handleDelete = async (valueDelete) => {
		try {
			await deleteUnit(valueDelete?.id);
			handleShowToast(`Xo?? ????n v???`, `Xo?? ????n v??? th??nh c??ng!`);
			const query = {};
			query.text = text;
			query.page = 1;
			getUnit(query);
		} catch (error) {
			handleShowToast(`Xo?? ????n v???`, `Xo?? ????n v??? th???t b???i!`);
		}
	};

	const columns = [
		{
			title: 'T??n ????n v???',
			id: 'name',
			key: 'name',
			type: 'text',
			align: 'left',
			isShow: true,
		},
		{
			title: 'M?? ????n v???',
			id: 'code',
			key: 'code',
			type: 'text',
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
						onClick={() => handleOpenActionForm(item)}
					/>
					<Button
						isOutline={!darkModeStatus}
						color='danger'
						isLight={darkModeStatus}
						className='text-nowrap mx-2 '
						icon='Delete'
						onClick={() => handleOpenConfirm(item)}
					/>
				</>
			),
			isShow: false,
		},
	];

	const handleOpenActionForm = (item) => {
		setOpenForm(true);
		setItemEdit({ ...item });
	};

	const hanleCloseForm = () => {
		setOpenForm(false);
		setItemEdit(null);
	};

	const handleShowToast = (title, content) => {
		addToast(
			<Toasts title={title} icon='Check2Circle' iconColor='success' time='Now' isDismiss>
				{content}
			</Toasts>,
			{
				autoDismiss: false,
			},
		);
	};

	const handleClearValueForm = () => {
		setItemEdit(null);
	};

	const handleSubmitForm = async (data) => {
		const dataSubmit = {
			name: data.name,
			code: data.code,
			status: Number(data.status),
		};
		if (data.id) {
			try {
				const response = await updateUnit({ id: data?.id, ...dataSubmit });
				await response.data;
				handleClearValueForm();
				hanleCloseForm();
				const query = {};
				query.text = text;
				query.page = 1;
				getUnit(query);
				handleShowToast(`C???p nh???t ????n v???!`, `C???p nh???t ????n v??? th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`C???p nh???t ????n v???`, `C???p nh???t ????n v??? kh??ng th??nh c??ng!`);
			}
		} else {
			try {
				const response = await addUnit(dataSubmit);
				await response.data;
				handleClearValueForm();
				hanleCloseForm();
				const query = {};
				query.text = text;
				query.page = 1;
				getUnit(query);
				handleShowToast(`Th??m ????n v???`, `Th??m ????n v??? th??nh c??ng!`);
			} catch (error) {
				handleShowToast(`Th??m ????n v???`, `Th??m ????n v??? kh??ng th??nh c??ng!`);
			}
		}
	};

	return (
		<PageWrapper title={demoPages.cauHinh.subMenu.unit.text}>
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
											<CardLabel icon='ReceiptLong' iconColor='primary'>
												<CardTitle>
													<CardLabel>Danh s??ch ????n v??? t??nh</CardLabel>
												</CardTitle>
											</CardLabel>
											<CardActions>
												<Button
													color='info'
													icon='ReceiptLong'
													tag='button'
													onClick={() => handleOpenActionForm(null)}>
													Th??m m???i
												</Button>
											</CardActions>
										</CardHeader>
										<div className='p-4'>
											<TableCommon
												className='table table-modern mb-0'
												columns={columns}
												data={units?.data}
												onSubmitSearch={handleSubmitSearch}
												onChangeCurrentPage={handleChangeCurrentPage}
												currentPage={parseInt(currentPage, 10)}
												totalItem={units?.pagination?.totalRows}
												total={units?.pagination?.total}
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
							show={openForm}
							onClose={hanleCloseForm}
							handleSubmit={handleSubmitForm}
							item={itemEdit}
							label={itemEdit?.id ? 'C???p nh???t ????n v??? t??nh' : 'T???o ????n v??? m???i t??nh'}
							fields={columns}
							validate={validate}
						/>
					</>,
					['admin'],
					<NotPermission />,
				)}
				<ComfirmSubtask
					openModal={openConfirm}
					onCloseModal={handleCloseDeleteComfirm}
					onConfirm={() => handleDelete(deletes)}
					title='Xo?? ????n v??? t??nh'
					content={`X??c nh???n xo?? ????n v??? t??nh <strong>${deletes?.name}</strong> ?`}
				/>
			</Page>
		</PageWrapper>
	);
};

export default UnitPage;
