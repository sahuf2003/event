const cron = require('node-cron');
const Event = require('../model/Event');

module.exports = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const fiveMinLater = new Date(now.getTime() + 5 * 60000);

      const upcomingEvents = await Event.find({
        startTime: { $lte: fiveMinLater, $gt: now }
      });

      if (upcomingEvents.length > 0) {
        upcomingEvents.forEach(event => {
          console.log(`[Reminder @ UTC ${now.toISOString()}]  Event '${event.title}' is starting soon.`);
        });
      } else {
        console.log(`[No Events @ UTC ${now.toISOString()}]  No events starting in next 5 minutes.`);
      }
    } catch (err) {
      console.error(`[Cron Error]  Error checking upcoming events: ${err.message}`);
    }
  });

  cron.schedule('*/10 * * * *', async () => {
    try {
      const now = new Date();
      const ongoingUpdate = await Event.updateMany(
        { startTime: { $lte: now }, endTime: { $gt: now }, status: 'upcoming' },
        { status: 'ongoing' }
      );

      const completedUpdate = await Event.updateMany(
        { endTime: { $lte: now }, status: 'ongoing' },
        { status: 'completed' }
      );

      console.log(`[Status Update @ UTC ${now.toISOString()}]`);
      console.log(` ${ongoingUpdate.modifiedCount} event(s) marked as ongoing.`);
      console.log(` ${completedUpdate.modifiedCount} event(s) marked as completed.`);
    } catch (err) {
      console.error(`[Cron Error]  Error updating event statuses: ${err.message}`);
    }
  });
};
