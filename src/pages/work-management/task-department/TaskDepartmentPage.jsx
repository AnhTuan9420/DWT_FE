import React from 'react';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import TaskDepartmentTable from './TaskDepartmentTable';

const TaskDepartmentPage = () => {
	return (
		<PageWrapper title={demoPages.quanLyCongViec.subMenu.danhSachCongViecPhongBan.text}>
			<Page container='fluid'>
				<div className='row mt-4 mb-2'>
					<div className='col-12'>
						<div className='display-6 fw-bold py-3'>
							Giao diện tổng quan - Vai trò nhân viên
						</div>
					</div>
				</div>
				<div className='row'>
					<TaskDepartmentTable />
				</div>
			</Page>
		</PageWrapper>
	);
};

export default TaskDepartmentPage;
