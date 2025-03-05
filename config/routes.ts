import component from "@/locales/en-US/component";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/bai-1',
		name: 'Bai 1',
		component: './Bai1/Bai1',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/bai-2',
		name: 'Bai 2',
		component: './Bai2/Bai2',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/quan-ly',
		name: 'Bài 2',
		icon: 'UnorderedListOutlined',
		routes: [
		  {
			path: '/quan-ly/mon-hoc',
			name: 'Quản lý môn học',
			component: './MonHoc/MonHoc',
		  },
		//   {
		// 	path: '/quan-ly/cau-hoi',
		// 	name: 'Quản lý câu hỏi ',
		// 	component: './CauHoi/index',
		//   },
		//   {
		// 	path: '/quan-ly/de-thi',
		// 	name: 'Quản lý đề thi',
		// 	component: './DeThi/index',
		//   },

		],
	  },
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
