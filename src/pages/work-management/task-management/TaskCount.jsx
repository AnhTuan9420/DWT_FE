import React from 'react';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';

const TaskCount = () => {
	const dataWorks = [
		{
			id: 1,
			title: 'Công việc của tôi',
			number: 45,
			icon: 'Person',
		},
		{
			id: 2,
			title: 'Công việc đã giao',
			number: 12,
			icon: 'PersonCheck',
		},
		{
			id: 3,
			title: 'Công việc được giao',
			number: 8,
			icon: 'PersonPlus',
		},
		{
			id: 4,
			title: 'Yêu cầu chờ duyệt',
			number: 15,
			icon: 'PersonX',
		},
	];

	return (
		<Card stretch>
			<CardBody>
				{dataWorks.map((item) => (
					<Card key={item.id} className='pt-1 pb-1'>
						<CardBody>
							<div className='row g-3 align-items-center'>
								<div className='col d-flex align-items-center'>
									<div className='flex-shrink-0'>
										<div className='ratio ratio-1x1' style={{ width: 50 }}>
											<div className='rounded-2 d-flex align-items-center justify-content-center bg-l10-info'>
												<span className='text-info fs-1 fw-bold'>
													<Icon icon={item.icon} />
												</span>
											</div>
										</div>
									</div>
									<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
										<div>
											<div className='fw-bold fs-6 mb-0'>{item.title}</div>
											<div className='text-muted'>
												<span>
													Số lượng:{' '}
													<span className='text-info fw-bold'>
														{item.number}
													</span>
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				))}
			</CardBody>
		</Card>
	);
};

export default TaskCount;
