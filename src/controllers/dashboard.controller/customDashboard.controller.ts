import { Request, Response } from 'express';
import { apiResponse } from '../../utils/method-helper/method';
import { catchAsync } from '../../utils/method-helper/catchAsync';
import User from '../../databases/models/user.model';
import Session from '../../databases/models/session.model';
import { Op } from 'sequelize';
import { now } from '../../utils/unix-epoch-date/date';



export const customDashboard = catchAsync(async (req: Request, res: Response) => {
  let data
  // start of today
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const startOfDayUnix = Math.floor(startOfDay.getTime() / 1000);
  // seven days agoo
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  const sevenDaysAgoUnix = Math.floor(sevenDaysAgo.getTime() / 1000);

  // today
  const today = now()


  // user sign up
  const findAllData = await User.findAll()
  // user active today
  const findUserActiveToday = await Session.findAndCountAll({
    where: {
      last_logged_in_at: {
        [Op.gte]: startOfDayUnix,
      },
    }
  })
  // user active one week ago
  const findUserActiveOneWeekAgo = await Session.findAndCountAll({
    where: {
      last_logged_in_at: {
        [Op.between]: [sevenDaysAgoUnix, today],
      },
    }
  })

  data = {
    totalUserSignUp: findAllData.length,
    totalUserActiveToday: findUserActiveToday.count,
    totalUserActiveOneWeek: findUserActiveOneWeekAgo.count
  }



  if (!findAllData) return apiResponse(
    res,
    404,
    "User Profile or User not found"
  );


  return apiResponse(res, 200, "Get all data are success!", data);
});
