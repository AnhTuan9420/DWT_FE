import React from 'react';
import workCountData from '../../../common/data/workCountData';
import Alert, { AlertHeading } from '../../../components/bootstrap/Alert';
import CardAlert from '../../../components/CardAlert/CardAlert';
// import Card, { CardBody } from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import CommonTodo from '../../common/CommonTodo';
import TaskCount from './TaskCount';
import TaskProgress from './TaskProgress';
import TaskProgressTable from './TaskProgressTable';
import TaskRecent from './TaskRecent';

// eslint-disable-next-line react/prop-types
// const RenderWorkCount = ({ id, label, number, status }) => {
// 	const _status =
// 		(status === 1 && 'success') ||
// 		(status === 2 && 'warning') ||
// 		(status === 3 && 'danger') ||
// 		(status === 4 && 'info');
// 	return (
// 		<div className='col-xl-3 col-md-6 col-sm-12'>
// 			<Card key={id} className={`pt-1 pb-1 bg-l10-${_status}`}>
// 				<CardBody>
// 					<div className='row g-3 align-items-center'>
// 						<div className='col d-flex align-items-center'>
// 							<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
// 								<div>
// 									<div className='fw-bold fs-6 mb-0'>{`${label}: ${number}`}</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</CardBody>
// 			</Card>
// 		</div>
// 	);
// };

const WorkManagementPage = () => {
	return (
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.congViec.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Alert
							icon='Verified'
							isLight
							color='primary'
							borderWidth={0}
							className='shadow-3d-primary'
							isDismissible>
							<AlertHeading tag='h2' className='h4'>
								Chúc mừng! Đầu việc “15. Thiết kế banner” đã hoàn tất.
							</AlertHeading>
							<span>Trưởng bộ phận Nhãn đã xác nhận đầu việc này hoàn thành!</span>
						</Alert>
					</div>
				</div>
				<div className='row'>
					<div className='col-xl-4'>
						<TaskProgress />
					</div>
					<div className='col-xl-3'>
						<TaskCount />
					</div>
					<div className='col-xl-5'>
						<TaskRecent />
					</div>
				</div>
				<div className='row'>
					{workCountData.map((item) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						// <RenderWorkCount key={item.id} {...item} />
						<div key={item.id} className='col-xl-3 col-md-6 col-sm-12'>
							{/* eslint-disable-next-line react/jsx-props-no-spreading */}
							<CardAlert key={item.id} {...item} />
						</div>
					))}
				</div>
				<div className='row'>
					<div className='col-xl-8'>
						<TaskProgressTable />
					</div>
					<div className='col-xl-4'>
						<CommonTodo titleProps='Vấn đề của Bảo' />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default WorkManagementPage;
