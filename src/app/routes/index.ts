import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';

import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { studentRoutes } from '../modules/student/student.routes';
import { teacherRoutes } from '../modules/teacher/teacher.routes';
import { friendRoutes } from '../modules/friend/friend.routes';
import { friendRequestRoutes } from '../modules/friendRequest/friendRequest.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/student',
    route: studentRoutes,
  },
  {
    path: '/teacher',
    route: teacherRoutes,
  },
  {
    path: '/friend',
    route: friendRoutes,
  },
  {
    path: '/friendRequest',
    route: friendRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
//TODO -  this is my main routes
