import React from 'react';
import classNames from 'classnames';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';

// eslint-disable-next-line react/prop-types
const TaskRecentItem = ({ status, title, subtitle, info, reason }) => {
	const { darkModeStatus } = useDarkMode();

	const _status =
		(status === 'Hoàn thành' && 'success') ||
		(status === 'Quá hạn' && 'warning') ||
		(status === 'Từ chối' && 'danger');
	return (
		<div className='col-12'>
			<div className='row'>
				<div className='col d-flex align-items-center'>
					<div className='flex-shrink-0'>
						<div
							style={{ width: 100 }}
							className={classNames(
								`bg-l${
									darkModeStatus ? 'o25' : '10'
								}-${_status} text-${_status} fw-bold py-2 rounded-pill me-3 text-center`,
							)}>
							{status}
						</div>
					</div>
					<div className='flex-grow-1'>
						<div className='fs-6'>{title}</div>
						<div className='text-muted'>
							<small>{subtitle}</small>
						</div>
					</div>
				</div>
				<div className='col-auto text-end'>
					<div>
						<strong>{info}</strong>
					</div>
					<div className='text-muted'>
						<span>{reason}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const TaskRecent = () => {
	const dataWorks = [
		{
			id: 1,
			title: 'Thiết kế ảnh cho nhà thuốc Ngọc Đông',
			subtitle: 'design.creative@doppelhelz.vn',
			info: '3 - 1.5KPI - 2:00 -10h (30/05/2022)',
			reason: 'Hoàn thành 8/12 đầu việc',
			status: 'Hoàn thành',
		},
		{
			id: 2,
			title: 'Thiết kế ảnh cho nhà thuốc Ngọc Đông',
			subtitle: 'design.creative@doppelhelz.vn',
			info: '3 - 1.5KPI - 2:00 -10h (30/05/2022)',
			reason: 'Hoàn thành 8/12 đầu việc',
			status: 'Từ chối',
		},
		{
			id: 3,
			title: 'Thiết kế ảnh cho nhà thuốc Ngọc Đông',
			subtitle: 'design.creative@doppelhelz.vn',
			info: '3 - 1.5KPI - 2:00 -10h (30/05/2022)',
			reason: 'Hoàn thành 8/12 đầu việc',
			status: 'Hoàn thành',
		},
		{
			id: 4,
			title: 'Thiết kế ảnh cho nhà thuốc Ngọc Đông',
			subtitle: 'design.creative@doppelhelz.vn',
			info: '3 - 1.5KPI - 2:00 -10h (30/05/2022)',
			reason: 'Hoàn thành 8/12 đầu việc',
			status: 'Quá hạn',
		},
	];

	return (
		<Card stretch>
			<CardHeader>
				<CardLabel>
					<CardTitle>Hoạt động gần đây</CardTitle>
				</CardLabel>
				<CardActions>
					<Button color='info' isLink icon='Summarize' tag='a' to='#'>
						Tất cả hoạt động
					</Button>
				</CardActions>
			</CardHeader>
			<CardBody isScrollable>
				<div className='row g-4'>
					{dataWorks.map((i) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<TaskRecentItem key={i.id} {...i} />
					))}
				</div>
			</CardBody>
		</Card>
	);
};

export default TaskRecent;
